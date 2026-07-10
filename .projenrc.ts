import { awscdk, javascript } from 'projen';
import { JobPermission } from 'projen/lib/github/workflows-model';
import { TypeScriptModuleResolution } from 'projen/lib/javascript/typescript-config';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.260.0',
  defaultReleaseBranch: 'main',
  packageManager: javascript.NodePackageManager.NPM,
  name: 'project_template',
  projenrcTs: true,
  gitignore: ['.env'],
  deps: ['aws-lambda'], // Runtime dependencies of this module.
  devDeps: [
    'aws-lambda-mock-context',
    'constructs',
    '@types/aws-lambda@^8.10.138',
    'typescript',
    'copyfiles',
    'ts-dotenv',
  ], // Build dependencies for this module.

  tsconfig: {
    compilerOptions: {
      target: 'es2020',
      strict: true,
      noEmit: true,
      sourceMap: false,
      module: 'commonjs',
      moduleResolution: TypeScriptModuleResolution.NODE,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      isolatedModules: true,
      rootDir: './src',
    },
    include: ['src/**/*.ts'], // Only include src directory
    exclude: ['node_modules'],
  },
});

// Add custom scripts
project.addScripts({
  projen: 'ts-node .projenrc.ts',
  build: 'npx projen && npx projen build && npx projen bundle',
  package: 'tsc && copyfiles -u 1 src/**/* dist',
  deploy: 'npm run projen && npm run build && npm run test &&npm run package && cdk deploy',
});

// Enables unit tests on windows
project.jest?.addTestMatch('<rootDir>/test/**/*(*.)@(spec|test).ts?(x)');
project.jest?.addTestMatch('<rootDir>/src/**/*(*.)@(spec|test).ts?(x)');
project.jest!.config.modulePaths = ['<rootDir>'];

// GitHub Actions workflow: deploy to AWS on push to main via OIDC role assumption
const deployWorkflow = project.github?.addWorkflow('deploy');
deployWorkflow?.on({
  push: { branches: ['main'] },
  workflowDispatch: {},
});
deployWorkflow?.addJob('deploy', {
  runsOn: ['ubuntu-latest'],
  permissions: {
    idToken: JobPermission.WRITE,
    contents: JobPermission.READ,
  },
  env: {
    CI: 'true',
  },
  steps: [
    {
      name: 'Checkout',
      uses: 'actions/checkout@v6',
    },
    {
      name: 'Configure AWS credentials',
      uses: 'aws-actions/configure-aws-credentials@v4',
      with: {
        'role-to-assume': 'arn:aws:iam::085180950819:role/github-actions-deploy',
        'aws-region': 'us-east-1',
      },
    },
    {
      name: 'Install dependencies',
      run: 'npm install',
    },
    {
      name: 'Build',
      run: 'npx projen build',
    },
    {
      name: 'Deploy',
      run: 'npx cdk deploy --require-approval never',
    },
  ],
});

project.synth();