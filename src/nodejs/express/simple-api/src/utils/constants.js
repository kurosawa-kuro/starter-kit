/**
 * アプリケーション定数
 * システム全体で使用される定数値
 */

// HTTPステータスコード
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// エラータイプ
const ERROR_TYPES = {
    VALIDATION_ERROR: 'validation_error',
    DATABASE_ERROR: 'database_error',
    AUTHENTICATION_ERROR: 'authentication_error',
    AUTHORIZATION_ERROR: 'authorization_error',
    NOT_FOUND: 'not_found',
    INTERNAL_ERROR: 'internal_error'
};

// ログレベル
const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};

// データベース関連
const DB_CONSTANTS = {
    MAX_CONNECTIONS: 25,
    IDLE_TIMEOUT: 30000,
    CONNECTION_TIMEOUT: 5000
};

// API関連
const API_CONSTANTS = {
    VERSION: 'v1',
    PREFIX: '/api',
    HEALTH_ENDPOINT: '/health',
    DOCS_ENDPOINT: '/api-docs'
};

// アプリケーション情報
const APP_INFO = {
    NAME: 'Hello World API',
    VERSION: '1.0.0',
    DESCRIPTION: 'JavaScript + Express スタータープロジェクト'
};

// レート制限
const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15分
    MAX_REQUESTS: 100
};

module.exports = {
    HTTP_STATUS,
    ERROR_TYPES,
    LOG_LEVELS,
    DB_CONSTANTS,
    API_CONSTANTS,
    APP_INFO,
    RATE_LIMIT
}; 