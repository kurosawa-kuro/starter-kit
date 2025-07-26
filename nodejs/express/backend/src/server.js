/**
 * サーバー起動ファイル
 * アプリケーションの初期化とサーバー起動を担当
 */

require('dotenv').config();

// 設定読み込み
const config = require('./config/config');
const database = require('./config/database');
const helloWorldService = require('./services/helloWorldService');
const { logApplicationStart, logApplicationShutdown } = require('./middleware/logger');

// Expressアプリケーション読み込み
const app = require('./app');

/**
 * アプリケーション初期化
 */
async function initializeApp() {
    try {
        // アプリケーション起動ログ
        logApplicationStart();
        
        // データベース接続
        await database.connect();
        
        // データベーステーブル初期化
        await helloWorldService.initializeDatabase();
        
        console.log('🚀 Hello World API starting on port', config.port);
        console.log('📖 API Documentation:', `http://localhost:${config.port}${config.swaggerPath}`);
        console.log('🔗 Health Check:', `http://localhost:${config.port}${config.healthCheckPath}`);
        console.log('🌐 Environment:', config.nodeEnv);
        
        if (database.isConnected()) {
            console.log('📦 Database: Connected');
        } else {
            console.log('🔄 Database: Mock mode');
        }
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        process.exit(1);
    }
}

/**
 * グレースフルシャットダウン
 */
function gracefulShutdown(signal) {
    logApplicationShutdown(signal);
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    database.disconnect()
        .then(() => {
            console.log('📦 Database disconnected');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        });
}

// シグナルハンドラー
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未処理のPromise拒否ハンドラー
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// 未処理の例外ハンドラー
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

/**
 * サーバー起動
 */
async function startServer() {
    try {
        // アプリケーション初期化
        await initializeApp();
        
        // サーバー起動
        const server = app.listen(config.port, config.host, () => {
            console.log(`✅ Server is running on ${config.host}:${config.port}`);
        });
        
        return server;
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

// メイン実行（テスト環境以外）
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = { startServer, gracefulShutdown }; 