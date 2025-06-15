/**
 * 環境変数の読み込みと管理
 */
const path = require('path');
const dotenv = require('dotenv');
const { ENV } = require('./environment');

// 環境変数ファイルのマッピング
const ENV_FILE_MAP = {
  [ENV.DEV]: '.env.dev',
  [ENV.TEST]: '.env.test',
  [ENV.STAG]: '.env.stag',
  [ENV.STAG_TEST]: '.env.stag.test',
  [ENV.PROD]: '.env.prod',
  [ENV.PROD_TEST]: '.env.prod.test'
};

/**
 * 環境変数の読み込み
 * @param {string} env - 環境名
 * @returns {void}
 */
const loadEnv = (env = process.env.NODE_ENV || ENV.DEV) => {
  const envFile = ENV_FILE_MAP[env];
  
  if (!envFile) {
    throw new Error(`無効な環境: ${env}`);
  }

  const envPath = path.resolve(process.cwd(), envFile);
  
  // 環境変数ファイルの読み込み
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    throw new Error(`環境変数ファイルの読み込みに失敗: ${envFile}`);
  }

  console.log(`環境変数を読み込みました: ${envFile}`);
};

/**
 * 環境変数の検証
 * @param {string[]} requiredVars - 必須の環境変数名の配列
 * @returns {void}
 */
const validateEnvVars = (requiredVars = []) => {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`必須の環境変数が設定されていません: ${missingVars.join(', ')}`);
  }
};

module.exports = {
  loadEnv,
  validateEnvVars
}; 