const express = require('express');
const app = express();
const port = 3000;

// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');

// 静的ファイルの提供
app.use(express.static('public'));

// ルートパスのハンドラー
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Hello World',
    message: 'Express.jsとEJSで作成したHello Worldアプリケーションへようこそ！'
  });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
}); 