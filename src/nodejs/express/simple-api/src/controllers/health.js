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
                    helloWorld: '/api/hello-world'
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