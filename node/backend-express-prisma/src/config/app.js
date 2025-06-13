const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

module.exports = app; 