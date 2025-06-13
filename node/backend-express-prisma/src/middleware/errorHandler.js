const { logger } = require('./logger');

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

// エラーハンドリングミドルウェア
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 開発環境では詳細なエラー情報を返す
  if (process.env.NODE_ENV === 'development') {
    logger.error({
      error: err,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // 本番環境では簡潔なエラーメッセージのみを返す
    logger.error({
      error: err.message,
      path: req.path,
      method: req.method
    });

    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '予期せぬエラーが発生しました'
      });
    }
  }
};

module.exports = {
  AppError,
  errorHandler
}; 