/**
 * ヘルスチェックコントローラー
 * アプリケーション状態監視
 */

const database = require('../config/database');
const mockData = require('../utils/mock');
const { ResponseFactory } = require('../models/response');
const { HTTP_STATUS } = require('../utils/constants');

class HealthController {
    /**
     * ヘルスチェックエンドポイント
     * @swagger
     * /api/health:
     *   get:
     *     summary: アプリケーションのヘルスチェック
     *     description: サーバーの状態、データベース接続、メモリ使用量などを確認
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: ヘルスチェック成功
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     *             example:
     *               status: 'success'
     *               message: 'Health check successful'
     *               timestamp: '2025-01-01T00:00:00.000Z'
     *               data:
     *                 status: 'OK'
     *                 message: 'Server is running'
     *                 timestamp: '2025-01-01T00:00:00.000Z'
     *                 uptime: 123.456
     *                 memory:
     *                   rss: 12345678
     *                   heapTotal: 9876543
     *                   heapUsed: 5432109
     *                   external: 123456
     *                 database:
     *                   connected: true
     *                   mode: 'database'
     *       500:
     *         description: 内部サーバーエラー
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async checkHealth(req, res) {
        try {
            const healthInfo = {
                status: 'OK',
                message: 'Server is running',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                environment: process.env.NODE_ENV || 'development',
                database: {
                    connected: database.isConnected(),
                    mode: database.isConnected() ? 'database' : 'mock'
                }
            };

            const response = ResponseFactory.success('Health check successful', healthInfo);
            res.status(HTTP_STATUS.OK).json(response.toJSON());
        } catch (error) {
            console.error('Health check error:', error);
            const errorResponse = ResponseFactory.internalError('Health check failed');
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse.toJSON());
        }
    }

    /**
     * アプリケーション情報取得
     * @swagger
     * /:
     *   get:
     *     summary: アプリケーション情報取得
     *     description: APIの基本情報、バージョン、利用可能なエンドポイントを取得
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: アプリケーション情報取得成功
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BaseResponse'
     *             example:
     *               status: 'success'
     *               message: 'Application info retrieved'
     *               timestamp: '2025-01-01T00:00:00.000Z'
     *               data:
     *                 name: 'Hello World API'
     *                 version: '1.0.0'
     *                 description: 'JavaScript + Express スタータープロジェクト'
     *                 environment: 'development'
     *                 timestamp: '2025-01-01T00:00:00.000Z'
     *                 endpoints:
     *                   health: '/api/health'
     *                   helloWorld: '/api/hello-world'
     *                   docs: '/api-docs'
     *       500:
     *         description: 内部サーバーエラー
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async getAppInfo(req, res) {
        try {
            const appInfo = {
                name: 'Hello World API',
                version: '1.0.0',
                description: 'JavaScript + Express スタータープロジェクト',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                endpoints: {
                    health: '/api/health',
                    helloWorld: '/api/hello-world',
                    docs: '/api-docs'
                }
            };

            const response = ResponseFactory.success('Application info retrieved', appInfo);
            res.status(HTTP_STATUS.OK).json(response.toJSON());
        } catch (error) {
            console.error('App info error:', error);
            const errorResponse = ResponseFactory.internalError('Failed to get application info');
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse.toJSON());
        }
    }
}

module.exports = new HealthController(); 