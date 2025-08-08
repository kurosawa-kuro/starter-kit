/**
 * Jest環境変数設定
 * テスト実行時の環境変数を設定
 */

// テスト用環境変数を設定
process.env.NODE_ENV = 'test';
process.env.PORT = '8081';
process.env.DB_PATH = './data/test-database.sqlite';
process.env.MOCK_MODE = 'false';
process.env.DEBUG_MODE = 'false';
process.env.LOG_LEVEL = 'error';

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
