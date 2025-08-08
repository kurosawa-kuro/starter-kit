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