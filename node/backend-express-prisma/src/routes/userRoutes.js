const express = require('express');
const router = express.Router();
const { validateUser } = require('../middleware/validators');
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ユーザーID
 *         email:
 *           type: string
 *           format: email
 *           description: メールアドレス
 *         name:
 *           type: string
 *           description: ユーザー名
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 新規ユーザーを作成
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: ユーザーが作成されました
 *       400:
 *         description: 無効なリクエスト
 */
router.post('/', validateUser, createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: ユーザー一覧を取得
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: ユーザー一覧
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 特定のユーザーを取得
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ユーザー情報
 *       404:
 *         description: ユーザーが見つかりません
 */
router.get('/:id', getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: ユーザー情報を更新
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: ユーザーが更新されました
 *       404:
 *         description: ユーザーが見つかりません
 */
router.put('/:id', validateUser, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: ユーザーを削除
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: ユーザーが削除されました
 *       404:
 *         description: ユーザーが見つかりません
 */
router.delete('/:id', deleteUser);

module.exports = router; 