/**
 * 環境設定の定数と検証ロジック
 */

// 環境の定数定義
const Environment = Object.freeze({
  DEV: 'dev',
  TEST: 'test',
  STAGING: 'staging',
  PROD: 'prod'
});

// 許可された環境の定義
const ALLOWED_ENVIRONMENTS = [Environment.DEV, Environment.TEST, Environment.PROD];

// 現在の環境を取得（デフォルトは'dev'）
const currentEnv = process.env.NODE_ENV || Environment.DEV;

// 環境の検証
if (!ALLOWED_ENVIRONMENTS.includes(currentEnv)) {
  throw new Error(`Invalid NODE_ENV: ${currentEnv}. Must be one of: ${ALLOWED_ENVIRONMENTS.join(', ')}`);
}

// 環境に応じた設定
const config = {
  isDev: currentEnv === Environment.DEV,
  isTest: currentEnv === Environment.TEST,
  isProd: currentEnv === Environment.PROD,
  currentEnv,
  allowedEnvironments: ALLOWED_ENVIRONMENTS,
  
  // 環境ごとの設定値
  values: {
    [Environment.DEV]: {
      logLevel: 'debug',
      corsOrigin: '*',
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15分
        max: 1000 // リクエスト数
      }
    },
    [Environment.TEST]: {
      logLevel: 'info',
      corsOrigin: '*',
      rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 1000
      }
    },
    [Environment.PROD]: {
      logLevel: 'warn',
      corsOrigin: process.env.CORS_ORIGIN || 'https://example.com',
      rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100
      }
    }
  }
};

module.exports = config; 