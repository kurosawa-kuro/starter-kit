const morgan = require('morgan');
const { isProd } = require('../config/environment');

// カスタムトークンの定義
morgan.token('response-time-ms', (req, res) => {
  if (!res._header || !req._startAt) return '';
  const diff = process.hrtime(req._startAt);
  const ms = diff[0] * 1e3 + diff[1] * 1e-6;
  return ms.toFixed(2);
});

// カスタムフォーマット
const format = isProd
  ? ':remote-addr - :method :url :status :response-time-ms ms'
  : ':method :url :status :response-time-ms ms - :res[content-length]';

// リクエストロギングミドルウェア
const requestLogger = morgan(format, {
  skip: (req, res) => res.statusCode >= 400,
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
});

// エラーロギングミドルウェア
const errorLogger = morgan(format, {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => {
      console.error(message.trim());
    }
  }
});

module.exports = {
  requestLogger,
  errorLogger
}; 