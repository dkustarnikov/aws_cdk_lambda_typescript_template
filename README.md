# AWS CDK Lambda TypeScript Template

This repository provides a structured template for building and deploying AWS Lambda functions using the AWS Cloud Development Kit (CDK) and TypeScript. It follows modern best practices for infrastructure-as-code, application development, testing, and project automation.

---

## Features

- **TypeScript-Based Lambda Development** – Strongly typed, modern code.
- **AWS CDK v2** – Define infrastructure using TypeScript.
- **Projen-Managed Configuration** – Use [Projen](https://github.com/projen/projen) to manage and regenerate project files.
- **Testing Support** – Unit tests for both Lambda logic and infrastructure.
- **Preconfigured CI Workflow** – GitHub Actions with build/test/self-mutation.

---

## Prerequisites

Ensure the following are installed:

- Node.js (v18+ recommended)
- Yarn or npm
- AWS CLI (configured)
- AWS CDK v2 CLI (`npm install -g aws-cdk`)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dkustarnikov/aws_cdk_lambda_typescript_template.git
cd aws_cdk_lambda_typescript_template
```

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Configure AWS Credentials

```bash
aws configure
```

### 4. Bootstrap the CDK Environment (first-time only)

```bash
cdk bootstrap
```

### 5. Deploy the Stack

```bash
cdk deploy
```

---

## Project Structure

```
├── src/              # Lambda function source code
├── test/             # Unit and infrastructure test cases
├── dist/             # Output directory for packaged artifacts
├── .projenrc.ts      # Projen configuration
├── cdk.json          # CDK CLI config
└── tsconfig.json     # TypeScript config
```

---

## Common Commands

| Command        | Description                                         |
|----------------|-----------------------------------------------------|
| `yarn build`   | Compile TypeScript to JavaScript                    |
| `yarn watch`   | Watch for file changes and recompile                |
| `yarn test`    | Run unit tests using Jest                          |
| `cdk synth`    | Output CloudFormation template                      |
| `cdk deploy`   | Deploy stack to AWS                                 |
| `npx projen`   | Regenerate project files from `.projenrc.ts`       |

---

## Testing

- **Framework**: Jest
- **Covers**: Lambda logic and infrastructure
- **Configurable via**: `.projenrc.ts` or `jest.config.js`

To run all tests:

```bash
yarn test
```

---

## Project Customization

Modify `.projenrc.ts` to:

- Add/modify dependencies
- Change CDK version
- Update TS/CI/test configuration

Then regenerate project files:

```bash
npx projen
```

---

## License

Licensed under the Apache License 2.0.

---

## Contributing

Contributions are welcome! Open an issue or submit a PR with your proposed improvements.