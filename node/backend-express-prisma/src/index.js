const app = require('./config/app');
const handleErrors = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

// ルートの設定
app.use('/users', userRoutes);

// エラーハンドリング
app.use(handleErrors);

// サーバー起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
  console.log(`APIドキュメント: http://localhost:${port}/api-docs`);
}); 