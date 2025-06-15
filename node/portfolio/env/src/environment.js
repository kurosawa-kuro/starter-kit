/**
 * 環境設定の定義と管理
 */

// 環境の種類
const ENV = {
  DEV: 'dev',
  TEST: 'test',
  STAG: 'stag',
  STAG_TEST: 'stag.test',
  PROD: 'prod',
  PROD_TEST: 'prod.test'
};

// 環境ごとの設定値
const values = {
  [ENV.DEV]: {
    logLevel: 'debug',
    corsOrigin: 'http://localhost:3000',
    port: 8080,
    database: {
      host: 'localhost',
      port: 5432,
      name: 'dev_db'
    },
    redis: {
      host: 'localhost',
      port: 6379
    }
  },
  [ENV.TEST]: {
    logLevel: 'debug',
    corsOrigin: 'http://localhost:3000',
    port: 8080,
    database: {
      host: 'localhost',
      port: 5432,
      name: 'test_db'
    },
    redis: {
      host: 'localhost',
      port: 6379
    }
  },
  [ENV.STAG]: {
    logLevel: 'info',
    corsOrigin: 'https://staging.example.com',
    port: 8080,
    database: {
      host: 'staging-db.example.com',
      port: 5432,
      name: 'staging_db'
    },
    redis: {
      host: 'staging-redis.example.com',
      port: 6379
    }
  },
  [ENV.STAG_TEST]: {
    logLevel: 'debug',
    corsOrigin: 'https://staging.example.com',
    port: 8080,
    database: {
      host: 'staging-db.example.com',
      port: 5432,
      name: 'staging_test_db'
    },
    redis: {
      host: 'staging-redis.example.com',
      port: 6379
    }
  },
  [ENV.PROD]: {
    logLevel: 'warn',
    corsOrigin: 'https://example.com',
    port: 8080,
    database: {
      host: 'prod-db.example.com',
      port: 5432,
      name: 'prod_db'
    },
    redis: {
      host: 'prod-redis.example.com',
      port: 6379
    }
  },
  [ENV.PROD_TEST]: {
    logLevel: 'info',
    corsOrigin: 'https://example.com',
    port: 8080,
    database: {
      host: 'prod-db.example.com',
      port: 5432,
      name: 'prod_test_db'
    },
    redis: {
      host: 'prod-redis.example.com',
      port: 6379
    }
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

// 環境変数の取得ヘルパー
const getEnvValue = (key, defaultValue = null) => {
  const envConfig = values[currentEnv];
  return envConfig[key] || defaultValue;
};

module.exports = {
  ENV,
  values,
  currentEnv,
  validateEnv,
  getEnvValue
}; 