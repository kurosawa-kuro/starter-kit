/**
 * エラーハンドラーミドルウェア
 */

const logger = require('./logger');

// カスタムエラークラス
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// エラーレスポンスの形式を統一
const formatErrorResponse = (err, status) => {
  return {
    status: 'fail',
    message: err.message,
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack })
  };
};

// エラーハンドラーミドルウェア
const errorHandler = (err, req, res, next) => {
  // エラーのログ記録
  logger.error({
    error: err.message,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query
    }
  });

  // エラーの種類に応じてステータスコードを設定
  const status = err.status || 500;

  // エラーレスポンスの送信
  res.status(status).json(formatErrorResponse(err, status));
};

module.exports = {
  AppError,
  errorHandler
}; 