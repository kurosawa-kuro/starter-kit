/**
 * アプリケーションのエントリーポイント
 */
const { loadEnv, validateEnvVars } = require('./env-loader');
const { currentEnv } = require('./environment');

// 環境変数の読み込み
loadEnv(currentEnv);

// 必須の環境変数の検証
validateEnvVars([
  'NODE_ENV',
  'LOG_LEVEL',
  'PORT',
  'CORS_ORIGIN',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'REDIS_HOST',
  'REDIS_PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'API_VERSION',
  'API_PREFIX'
]);

// アプリケーションの初期化
const app = require('express')();

// 基本的なミドルウェアの設定
app.use(require('cors')({
  origin: process.env.CORS_ORIGIN
}));
app.use(require('express').json());

// ルートの設定
app.get('/', (req, res) => {
  res.json({
    message: '環境変数の設定が完了しました',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// サーバーの起動
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
  console.log(`環境: ${process.env.NODE_ENV}`);
}); 