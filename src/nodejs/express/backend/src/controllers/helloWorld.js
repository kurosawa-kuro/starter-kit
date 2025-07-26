/**
 * Hello World コントローラー
 * HTTPリクエスト/レスポンス処理
 */

const helloWorldService = require('../services/helloWorldService');
const { ResponseFactory, StatusCodes } = require('../models/response');
const { createValidator, validateString } = require('../middleware/validator');

// バリデーションスキーマ
const createHelloWorldSchema = {
    body: {
        name: (value) => validateString(value, 'name', { minLength: 1, maxLength: 100 }),
        message: (value) => validateString(value, 'message', { required: false, minLength: 1, maxLength: 1000 })
    }
};

class HelloWorldController {
    /**
     * Hello Worldメッセージを取得
     * @swagger
     * /api/hello-world:
     *   get:
     *     summary: Hello Worldメッセージを取得
     *     description: 指定された名前のHello Worldメッセージを取得（名前が指定されない場合は'World'を使用）
     *     tags: [Hello World]
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: 挨拶する相手の名前
     *         example: 'World'
     *     responses:
     *       200:
     *         description: Hello Worldメッセージ取得成功
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     *             example:
     *               status: 'success'
     *               message: 'Hello World message retrieved'
     *               timestamp: '2025-01-01T00:00:00.000Z'
     *               data:
     *                 id: 1
     *                 name: 'World'
     *                 message: 'Hello, World!'
     *                 created_at: '2025-01-01T00:00:00.000Z'
     *                 updated_at: '2025-01-01T00:00:00.000Z'
     *       500:
     *         description: 内部サーバーエラー
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async getHelloWorld(req, res) {
        try {
            const { name } = req.query;
            const message = await helloWorldService.getHelloWorldMessage(name);
            
            const response = ResponseFactory.success('Hello World message retrieved', message);
            res.status(StatusCodes.OK).json(response.toJSON());
        } catch (error) {
            console.error('Get Hello World error:', error);
            const errorResponse = ResponseFactory.internalError('Failed to get Hello World message');
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse.toJSON());
        }
    }

    /**
     * Hello Worldメッセージを作成
     * @swagger
     * /api/hello-world:
     *   post:
     *     summary: Hello Worldメッセージを作成
     *     description: 新しいHello Worldメッセージを作成
     *     tags: [Hello World]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 description: 挨拶する相手の名前
     *                 example: 'World'
     *               message:
     *                 type: string
     *                 description: カスタムメッセージ（オプション）
     *                 example: 'Hello, World!'
     *           example:
     *             name: 'World'
     *             message: 'Hello, World!'
     *     responses:
     *       201:
     *         description: Hello Worldメッセージ追加成功
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     *             example:
     *               status: 'success'
     *               message: 'Hello World message added'
     *               timestamp: '2025-01-01T00:00:00.000Z'
     *               data:
     *                 id: 1
     *                 name: 'World'
     *                 message: 'Hello, World!'
     *                 created_at: '2025-01-01T00:00:00.000Z'
     *                 updated_at: '2025-01-01T00:00:00.000Z'
     *       400:
     *         description: バリデーションエラー
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: 内部サーバーエラー
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async addHelloWorld(req, res) {
        try {
            const { name, message } = req.validated.body;
            const createdMessage = await helloWorldService.addHelloWorldMessage(name, message);
            
            const response = ResponseFactory.success('Hello World message added', createdMessage);
            res.status(StatusCodes.CREATED).json(response.toJSON());
        } catch (error) {
            console.error('Add Hello World error:', error);
            const errorResponse = ResponseFactory.internalError('Failed to add Hello World message');
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse.toJSON());
        }
    }

    /**
     * Hello Worldメッセージ一覧を取得
     * @swagger
     * /api/hello-world/list:
     *   get:
     *     summary: Hello Worldメッセージ一覧を取得
     *     description: データベース内の全Hello Worldメッセージを取得
     *     tags: [Hello World]
     *     responses:
     *       200:
     *         description: Hello Worldメッセージ一覧取得成功
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     */
    async listHelloWorld(req, res) {
        try {
            const messages = await helloWorldService.listHelloWorldMessages();
            
            const response = ResponseFactory.success('Hello World messages retrieved', messages);
            res.status(StatusCodes.OK).json(response.toJSON());
        } catch (error) {
            console.error('List Hello World error:', error);
            const errorResponse = ResponseFactory.internalError('Failed to get Hello World messages');
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse.toJSON());
        }
    }
}

// バリデーションミドルウェアを追加
const createHelloWorldValidator = createValidator(createHelloWorldSchema);

module.exports = {
    HelloWorldController,
    createHelloWorldValidator
}; 