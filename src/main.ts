import * as path from 'path';
import { App, CfnOutput, Stack, StackProps, aws_lambda as lambda, aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // Lambda function definitions (unchanged)
    const healthFunction = new NodejsFunction(this, `health`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, 'lambdas/health/index.ts'), // adjust the path as necessary
      handler: 'handler',
      bundling: {
        externalModules: [],
      },
      environment: {
        SOME_KEY: 'some_key variable',
      },
    });

    // Define the API Gateway resource
    const api = new apigateway.LambdaRestApi(this, 'ExampleAPI', {
      handler: healthFunction,
      proxy: false,
    });

    // Other API Gateway Endpoints (unchanged)
    api.root.addResource('health').addMethod('GET', new apigateway.LambdaIntegration(healthFunction), {
      // authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.CUSTOM,
    });

    new CfnOutput(this, 'TestBucket', { value: '' });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'template-dev', { env: devEnv });

app.synth();
