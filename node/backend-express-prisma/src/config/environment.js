/**
 * 環境設定の定数と検証ロジック
 */

// 許可された環境の定義
const ALLOWED_ENVIRONMENTS = ['dev', 'test', 'prod'];

// 現在の環境を取得（デフォルトは'dev'）
const currentEnv = process.env.NODE_ENV || 'dev';

// 環境の検証
if (!ALLOWED_ENVIRONMENTS.includes(currentEnv)) {
  throw new Error(`Invalid NODE_ENV: ${currentEnv}. Must be one of: ${ALLOWED_ENVIRONMENTS.join(', ')}`);
}

// 環境に応じた設定
const config = {
  isDev: currentEnv === 'dev',
  isTest: currentEnv === 'test',
  isProd: currentEnv === 'prod',
  currentEnv,
  allowedEnvironments: ALLOWED_ENVIRONMENTS,
  
  // 環境ごとの設定値
  values: {
    dev: {
      logLevel: 'debug',
      corsOrigin: '*',
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15分
        max: 1000 // リクエスト数
      }
    },
    test: {
      logLevel: 'info',
      corsOrigin: '*',
      rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 1000
      }
    },
    prod: {
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