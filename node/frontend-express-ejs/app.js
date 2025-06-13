const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');

// 静的ファイルの提供
app.use(express.static('public'));

// ルートパスのハンドラー
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8080/api/users');
    const users = response.data.data.users;
    console.log(users);
    
    res.render('index', { 
      title: 'ユーザー一覧',
      message: 'ユーザー一覧を表示します',
      users: users
    });
  } catch (error) {
    console.error('ユーザー一覧の取得に失敗しました:', error);
    res.render('index', { 
      title: 'エラー',
      message: 'ユーザー一覧の取得に失敗しました',
      users: []
    });
  }
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
}); 