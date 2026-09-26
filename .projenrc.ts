import { awscdk, javascript } from 'projen';
import { TypeScriptModuleResolution } from 'projen/lib/javascript/typescript-config';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.260.0',
  defaultReleaseBranch: 'main',
  packageManager: javascript.NodePackageManager.NPM,
  name: 'project_template',
  projenrcTs: true,
  github: false,
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

project.synth();