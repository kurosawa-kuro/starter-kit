/**
 * Jestセットアップファイル
 * テスト実行前後の共通処理
 */

const path = require('path');
const fs = require('fs');

// テスト用データベースパス
const TEST_DB_PATH = path.join(__dirname, '../data/test-database.sqlite');

// グローバルテスト設定
global.TEST_DB_PATH = TEST_DB_PATH;

// テスト実行前の共通処理
beforeAll(async () => {
    // テスト用データベースディレクトリを作成
    const dbDir = path.dirname(TEST_DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // 既存のテストデータベースを削除
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
    }
});

// テスト実行後の共通処理
afterAll(async () => {
    // テスト用データベースを削除
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
    }
});

// 各テスト前の処理
beforeEach(async () => {
    // テスト用データベースが存在する場合は削除
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
    }
});

// 各テスト後の処理
afterEach(async () => {
    // テスト用データベースを削除
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.unlinkSync(TEST_DB_PATH);
    }
});

// グローバルエラーハンドラー
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
