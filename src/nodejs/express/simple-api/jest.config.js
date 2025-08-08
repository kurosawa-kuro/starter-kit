/**
 * Jest設定ファイル
 * SQLiteテスト用の設定
 */

module.exports = {
    // テスト環境
    testEnvironment: 'node',
    
    // テストファイルのパターン
    testMatch: [
        '**/test/**/*.test.js',
        '**/__tests__/**/*.js'
    ],
    
    // テストを除外するファイル
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/'
    ],
    
    // カバレッジ設定
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/test/',
        '/coverage/',
        'src/server.js',
        'src/utils/mock.js'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/test/**/*.js',
        '!src/server.js',
        '!src/utils/mock.js'
    ],
    
    // テストタイムアウト
    testTimeout: 10000,
    
    // セットアップファイル
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.js'],
    
    // 環境変数
    setupFiles: ['<rootDir>/test/jest-env.js'],
    
    // モジュールパス
    moduleDirectories: ['node_modules', 'src'],
    
    // テスト結果の表示
    verbose: true,
    
    // テスト実行時の出力
    silent: false,
    

};
