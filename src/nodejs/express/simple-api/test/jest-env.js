/**
 * Jest環境変数設定
 * テスト実行時の環境変数を設定
 */

// テスト用環境変数を設定
process.env.NODE_ENV = 'test';
process.env.PORT = '8081';
process.env.HOST = 'localhost';
process.env.DB_PATH = './data/test-database.sqlite';
process.env.DB_MODE = 'sqlite';
process.env.LOG_LEVEL = 'error';
process.env.LOG_FORMAT = 'json';
process.env.CORS_ORIGIN = '*';
process.env.CORS_CREDENTIALS = 'false';
process.env.CORS_METHODS = 'GET,POST,PUT,DELETE,OPTIONS';
process.env.CORS_HEADERS = 'Content-Type,Authorization';
process.env.RATE_LIMIT_ENABLED = 'false';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX = '1000';
process.env.RATE_LIMIT_MESSAGE = 'Too many requests from this IP';
process.env.HELMET_ENABLED = 'false';
process.env.TRUST_PROXY = 'false';
process.env.REQUEST_SIZE_LIMIT = '10mb';
process.env.API_PREFIX = '/api';
process.env.API_VERSION = 'v1';
process.env.HEALTH_CHECK_PATH = '/api/health';
process.env.HEALTH_CHECK_TIMEOUT = '5000';
process.env.MOCK_MODE = 'false';
process.env.DEBUG_MODE = 'false';

// テスト用のタイムアウト設定
jest.setTimeout(10000);

// コンソール出力を抑制（テスト実行時）
if (process.env.NODE_ENV === 'test') {
    // エラーログのみ表示
    const originalError = console.error;
    console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Error')) {
            originalError(...args);
        }
    };
}
