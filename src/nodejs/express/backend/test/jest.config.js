/**
 * Jest設定ファイル
 * テスト実行の設定とカバレッジ設定
 */

module.exports = {
    // テスト環境
    testEnvironment: 'node',
    
    // テストファイルのパターン
    testMatch: [
        '**/*.test.js',
        '**/*.spec.js'
    ],
    
    // テストから除外するファイル
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/'
    ],
    
    // セットアップファイル
    setupFilesAfterEnv: [
        '<rootDir>/setup/testSetup.js'
    ],
    
    // モジュールパスマッピング
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/../src/$1',
        '^@test/(.*)$': '<rootDir>/$1'
    },
    
    // カバレッジ設定（必要に応じて有効化）
    collectCoverage: false,
    // collectCoverageFrom: [
    //     '../src/**/*.js',
    //     '!../src/**/*.test.js',
    //     '!../src/**/*.spec.js',
    //     '!../src/config/database.js', // データベース接続は除外
    //     '!../src/app.js' // アプリケーションエントリーポイントは除外
    // ],
    // coverageDirectory: 'coverage',
    // coverageReporters: [
    //     'text',
    //     'lcov',
    //     'html'
    // ],
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80
    //     }
    // },
    
    // テストタイムアウト
    testTimeout: 10000,
    
    // 並列実行設定
    maxWorkers: '50%',
    
    // 詳細な出力
    verbose: true,
    
    // テスト実行時の環境変数
    testEnvironmentOptions: {
        NODE_ENV: 'test'
    },
    
    // モック設定
    clearMocks: true,
    restoreMocks: true,
    
    // テスト実行順序（必要に応じて有効化）
    // testSequencer: '<rootDir>/test/utils/testSequencer.js',
    
    // レポーター設定（jest-junitがインストールされていない場合はコメントアウト）
    reporters: [
        'default'
        // [
        //     'jest-junit',
        //     {
        //         outputDirectory: 'coverage',
        //         outputName: 'junit.xml',
        //         classNameTemplate: '{classname}',
        //         titleTemplate: '{title}',
        //         ancestorSeparator: ' › ',
        //         usePathForSuiteName: true
        //     }
        // ]
    ],
    
    // グローバル設定
    globals: {
        'ts-jest': {
            useESM: true
        }
    }
}; 