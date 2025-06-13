const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const userRoutes = require('../routes/userRoutes');
require('dotenv').config();

const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ルートの設定
app.use('/users', userRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app; 