const chalk = require('chalk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 必須の環境変数
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT'
];

// 環境変数の型定義
const envVarTypes = {
  DATABASE_URL: 'string',
  JWT_SECRET: 'string',
  PORT: 'number',
  NODE_ENV: 'string'
};

function validateEnvFile(envPath) {
  console.log(chalk.blue(`\nValidating environment file: ${envPath}`));
  
  if (!fs.existsSync(envPath)) {
    console.error(chalk.red(`Error: ${envPath} does not exist`));
    return false;
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  let isValid = true;

  // 必須環境変数のチェック
  for (const envVar of requiredEnvVars) {
    if (!envConfig[envVar]) {
      console.error(chalk.red(`Error: ${envVar} is required but not set in ${envPath}`));
      isValid = false;
    }
  }

  // 型チェック
  for (const [key, value] of Object.entries(envConfig)) {
    const expectedType = envVarTypes[key];
    if (expectedType) {
      if (expectedType === 'number' && isNaN(Number(value))) {
        console.error(chalk.red(`Error: ${key} should be a number but got "${value}"`));
        isValid = false;
      }
    }
  }

  if (isValid) {
    console.log(chalk.green(`✓ ${envPath} is valid`));
  }

  return isValid;
}

// 各環境の.envファイルを検証
const environments = ['dev', 'test', 'stag', 'prod'];
let allValid = true;

for (const env of environments) {
  const envPath = path.resolve(process.cwd(), `.env.${env}`);
  if (!validateEnvFile(envPath)) {
    allValid = false;
  }
}

if (!allValid) {
  process.exit(1);
} 