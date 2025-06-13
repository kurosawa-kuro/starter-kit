const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// バリデーション
const validateUser = [
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('name').notEmpty().withMessage('名前は必須です')
];

// エラーハンドリングミドルウェア
const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
};

// ユーザー作成
app.post('/users', validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name }
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
    } else {
      next(error);
    }
  }
});

// ユーザー一覧取得
app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// 特定のユーザー取得
app.get('/users/:email', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.params.email }
    });
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// エラーハンドリング
app.use(handleErrors);

// サーバー起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
}); 