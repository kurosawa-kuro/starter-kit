const dotenv = require('dotenv');
const config = require('./environment');
const chalk = require('chalk');

// 環境変数の読み込み
dotenv.config();

// 環境設定の表示
console.log(chalk.blue('=== 環境設定 ==='));
console.log(chalk.green('環境:'), config.currentEnv);
console.log(chalk.green('データベースURL:'), process.env.DATABASE_URL);
console.log(chalk.green('ログレベル:'), config.values[config.currentEnv].logLevel);
console.log(chalk.green('CORS Origin:'), config.values[config.currentEnv].corsOrigin);
console.log(chalk.blue('================')); 