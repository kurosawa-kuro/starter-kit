const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../environment');

/**
 * 環境変数の検証
 */
const validateEnv = () => {
  console.log(chalk.blue('環境変数の検証を開始します...'));

  // 必須の環境変数
  const requiredEnvVars = [
    'DATABASE_URL',
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'CORS_ORIGIN'
  ];

  // 環境変数の存在確認
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error(chalk.red('エラー: 以下の環境変数が設定されていません:'));
    missingVars.forEach(varName => console.error(chalk.yellow(`  - ${varName}`)));
    process.exit(1);
  }

  // 環境設定の検証
  try {
    config.validateEnv();
  } catch (error) {
    console.error(chalk.red('エラー:'), error.message);
    process.exit(1);
  }

  // データベースURLの形式検証
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith('postgresql://')) {
    console.error(chalk.red('エラー: 無効なデータベースURL形式です'));
    process.exit(1);
  }

  // ポート番号の検証
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error(chalk.red('エラー: 無効なポート番号です'));
    process.exit(1);
  }

  console.log(chalk.green('環境変数の検証が完了しました'));
};

// スクリプトが直接実行された場合
if (require.main === module) {
  validateEnv();
}

module.exports = validateEnv; 