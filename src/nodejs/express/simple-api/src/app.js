/**
 * Hello World API メインアプリケーション
 * クリーンアーキテクチャ実装
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// 設定読み込み
const config = require('./config/config');

// ミドルウェア読み込み
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const { requestLogger, errorLogger, performanceLogger, securityLogger } = require('./middleware/logger');

// ルーティング読み込み
const apiRoutes = require('./routes/routes');



// Expressアプリケーション初期化
const app = express();

// セキュリティミドルウェア
if (config.helmetEnabled) {
    app.use(helmet());
}

// プロキシ信頼設定
if (config.trustProxy) {
    app.set('trust proxy', 1);
}

// CORS設定
app.use(cors({
    origin: config.corsOrigin,
    credentials: config.corsCredentials,
    methods: config.corsMethods.split(','),
    allowedHeaders: config.corsHeaders.split(',')
}));

// リクエストボディパーサー
app.use(express.json({ limit: config.requestSizeLimit }));
app.use(express.urlencoded({ extended: true, limit: config.requestSizeLimit }));

// ログミドルウェア
app.use(requestLogger);
app.use(performanceLogger);
app.use(securityLogger);

// レート制限ミドルウェア
app.use(rateLimiter);

// ルートエンドポイント
app.get('/', (req, res) => {
    const healthController = require('./controllers/health');
    healthController.getAppInfo(req, res);
});

// APIルート
app.use(config.apiPrefix, apiRoutes);



// 404エラーハンドラー
app.use('*', notFoundHandler);

// エラーログミドルウェア
app.use(errorLogger);

// エラーハンドリングミドルウェア
app.use(errorHandler);

module.exports = app; 