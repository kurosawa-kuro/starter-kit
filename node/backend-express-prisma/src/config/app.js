const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const userRoutes = require('../routes/userRoutes');
const { errorHandler } = require('../middleware/errorHandler');
const { requestLogger } = require('../middleware/logger');
require('dotenv').config();

const app = express();

// 基本ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// APIルートの設定
app.use('/api/users', userRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// エラーハンドリング
app.use(errorHandler);

module.exports = app; 