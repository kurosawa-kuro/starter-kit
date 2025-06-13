const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name } = req.body;

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
    }

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    res.status(500).json({ error: 'ユーザーの作成に失敗しました' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    res.status(500).json({ error: 'ユーザー一覧の取得に失敗しました' });
  }
};

const getUserByEmail = async (req, res, next) => {
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
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail
}; 