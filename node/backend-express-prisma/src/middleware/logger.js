const winston = require('winston');
const { isProd, values } = require('../config/environment');

// ロガーの設定
const logger = winston.createLogger({
  level: values[process.env.NODE_ENV || 'dev'].logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 開発環境とテスト環境でのみコンソールログを有効化
if (!isProd) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// リクエストロギングミドルウェア
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  next();
};

module.exports = {
  logger,
  requestLogger
}; 