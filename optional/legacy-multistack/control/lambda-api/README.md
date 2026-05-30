# Lambda Hono

AWS Lambda function with Hono framework.

## Quick Start

```bash
make install
make deploy
make test
```

## Commands

| Command | Description |
|---------|-------------|
| `make install` | Install dependencies |
| `make build` | Build TypeScript |
| `make zip` | Create lambda.zip |
| `make deploy` | Build, zip, and deploy |
| `make test` | Test Lambda connectivity |
| `make clean` | Remove build artifacts |

## Initial Setup (One-time)

### 1. Create IAM Role

```bash
aws iam create-role --role-name lambda-execution-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'
```

### 2. Attach Execution Policy

```bash
aws iam attach-role-policy --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### 3. Create Lambda Function

Wait 10 seconds for IAM propagation, then:

```bash
make build
make zip

aws lambda create-function \
  --function-name hello \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://lambda.zip \
  --role arn:aws:iam::<ACCOUNT_ID>:role/lambda-execution-role
```

## Subsequent Deployments

```bash
make deploy
```

## Test

```bash
# Using Makefile
make test

# Direct script execution
./script/test-lambda.sh

# With custom function name
./script/test-lambda.sh my-function

# With payload
./script/test-lambda.sh hello '{"key":"value"}'
```
