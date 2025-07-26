// API エンドポイント
export const API_ENDPOINTS = {
  HELLO_WORLD: '/hello-world',
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
}

// HTTP ステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
}

// アプリケーション定数
export const APP_CONSTANTS = {
  // ページネーション
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // バリデーション
  MAX_NAME_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 8,
  
  // タイムアウト
  DEFAULT_TIMEOUT: 10000,
  SHORT_TIMEOUT: 5000,
  LONG_TIMEOUT: 30000,
  
  // リトライ
  DEFAULT_RETRY_ATTEMPTS: 3,
  MAX_RETRY_ATTEMPTS: 5,
}

// エラーコード
export const ERROR_CODES = {
  VALIDATION_ERROR: 'validation_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  AUTHORIZATION_ERROR: 'authorization_error',
  NOT_FOUND_ERROR: 'not_found_error',
  INTERNAL_ERROR: 'internal_error',
  NETWORK_ERROR: 'network_error',
  TIMEOUT_ERROR: 'timeout_error',
}

// ログレベル
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

// ローカルストレージキー
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// ルート名
export const ROUTE_NAMES = {
  HOME: 'home',
  HELLO_WORLD: 'hello-world',
  NOT_FOUND: 'not-found',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
}

// テーマ設定
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// 言語設定
export const LANGUAGES = {
  JA: 'ja',
  EN: 'en',
}

// 日付フォーマット
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DISPLAY: 'YYYY-MM-DD HH:mm:ss',
  SHORT: 'MM/DD/YYYY',
  TIME: 'HH:mm:ss',
} 