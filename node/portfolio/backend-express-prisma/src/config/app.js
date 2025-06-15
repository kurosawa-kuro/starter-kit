const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const userRoutes = require('../routes/userRoutes');
const { requestLogger, errorLogger } = require('../middleware/logger');
const { values } = require('./environment');
require('dotenv').config();

const app = express();

// 基本ミドルウェアの設定
app.use(cors({
  origin: values[process.env.NODE_ENV || 'dev'].corsOrigin
}));
app.use(express.json());

// ロギングミドルウェア
app.use(requestLogger);
app.use(errorLogger);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// APIルートの設定
app.use('/api/users', userRoutes);

// Swagger UI（開発環境とテスト環境でのみ有効）
if (process.env.NODE_ENV !== 'prod') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

module.exports = app; 