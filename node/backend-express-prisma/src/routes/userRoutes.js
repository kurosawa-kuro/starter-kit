const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middleware/validators');

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
 *           description: ユーザーのメールアドレス
 *         name:
 *           type: string
 *           description: ユーザー名
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 新規ユーザーを作成
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: ユーザーが作成されました
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 無効なリクエスト
 */
router.post('/', validateUser, userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 全ユーザーを取得
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: ユーザー一覧
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: メールアドレスでユーザーを検索
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: ユーザーのメールアドレス
 *     responses:
 *       200:
 *         description: ユーザー情報
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: ユーザーが見つかりません
 */
router.get('/:email', userController.getUserByEmail);

module.exports = router; 