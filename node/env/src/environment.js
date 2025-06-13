/**
 * 環境設定の定義と管理
 */

// 環境の種類
const ENV = {
  DEV: 'dev',
  TEST: 'test',
  STAG: 'stag',
  PROD: 'prod'
};

// 環境ごとの設定値
const values = {
  [ENV.DEV]: {
    logLevel: 'debug',
    corsOrigin: 'http://localhost:3000',
    port: 8080
  },
  [ENV.TEST]: {
    logLevel: 'debug',
    corsOrigin: 'http://localhost:3000',
    port: 8080
  },
  [ENV.STAG]: {
    logLevel: 'info',
    corsOrigin: 'https://staging.example.com',
    port: 8080
  },
  [ENV.PROD]: {
    logLevel: 'warn',
    corsOrigin: 'https://example.com',
    port: 8080
  }
};

// 現在の環境を取得
const currentEnv = process.env.NODE_ENV || ENV.DEV;

// 環境設定の検証
const validateEnv = () => {
  if (!values[currentEnv]) {
    throw new Error(`無効な環境: ${currentEnv}`);
  }
};

// 環境設定の初期化
validateEnv();

module.exports = {
  ENV,
  values,
  currentEnv,
  validateEnv
}; 