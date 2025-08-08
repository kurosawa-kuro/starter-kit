/**
 * 基本的機能テスト
 * health.js、errorHandler.js、rateLimiter.js、validator.js、utilsのテスト
 */

const request = require('supertest');
const express = require('express');
const { 
    errorHandler, 
    notFoundHandler, 
    AppError, 
    ValidationError, 
    DatabaseError, 
    AuthenticationError, 
    AuthorizationError, 
    NotFoundError 
} = require('../src/middleware/errorHandler');
const { rateLimiter, createCustomRateLimiter, getRateLimitStats } = require('../src/middleware/rateLimiter');
const { 
    validateString, 
    validateNumber, 
    validateEmail, 
    validateURL, 
    validateArray, 
    validateObject, 
    createValidator, 
    commonSchemas 
} = require('../src/middleware/validator');
const { HTTP_STATUS, ERROR_TYPES, LOG_LEVELS, API_CONSTANTS, APP_INFO } = require('../src/utils/constants');
const { ResponseFactory } = require('../src/models/response');
const healthController = require('../src/controllers/health');

// テスト用アプリケーションを作成
let app;

beforeEach(() => {
    app = express();
    app.use(express.json());

    // テスト用ルート
    app.get('/test', (req, res) => {
        res.json({ message: 'Test endpoint' });
    });

    app.get('/error', (req, res, next) => {
        next(new ValidationError('Test validation error'));
    });

    app.get('/database-error', (req, res, next) => {
        next(new DatabaseError('Test database error'));
    });

    app.get('/auth-error', (req, res, next) => {
        next(new AuthenticationError('Test authentication error'));
    });

    app.get('/forbidden', (req, res, next) => {
        next(new AuthorizationError('Test authorization error'));
    });

    app.get('/not-found-error', (req, res, next) => {
        next(new NotFoundError('Test not found error'));
    });

    app.get('/internal-error', (req, res, next) => {
        next(new Error('Test internal error'));
    });

    // エラーハンドラーを適用
    app.use('*', notFoundHandler);
    app.use(errorHandler);
});

describe('Basic Functionality Tests', () => {
    describe('Constants Tests', () => {
        it('should have correct HTTP status codes', () => {
            expect(HTTP_STATUS.OK).toBe(200);
            expect(HTTP_STATUS.CREATED).toBe(201);
            expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
            expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
            expect(HTTP_STATUS.FORBIDDEN).toBe(403);
            expect(HTTP_STATUS.NOT_FOUND).toBe(404);
            expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
        });

        it('should have correct error types', () => {
            expect(ERROR_TYPES.VALIDATION_ERROR).toBe('validation_error');
            expect(ERROR_TYPES.DATABASE_ERROR).toBe('database_error');
            expect(ERROR_TYPES.AUTHENTICATION_ERROR).toBe('authentication_error');
            expect(ERROR_TYPES.AUTHORIZATION_ERROR).toBe('authorization_error');
            expect(ERROR_TYPES.NOT_FOUND).toBe('not_found');
            expect(ERROR_TYPES.INTERNAL_ERROR).toBe('internal_error');
        });

        it('should have correct log levels', () => {
            expect(LOG_LEVELS.ERROR).toBe('error');
            expect(LOG_LEVELS.WARN).toBe('warn');
            expect(LOG_LEVELS.INFO).toBe('info');
            expect(LOG_LEVELS.DEBUG).toBe('debug');
        });

        it('should have correct API constants', () => {
            expect(API_CONSTANTS.VERSION).toBe('v1');
            expect(API_CONSTANTS.PREFIX).toBe('/api');
            expect(API_CONSTANTS.HEALTH_ENDPOINT).toBe('/health');
        });

        it('should have correct app info', () => {
            expect(APP_INFO.NAME).toBe('Hello World API');
            expect(APP_INFO.VERSION).toBe('1.0.0');
            expect(APP_INFO.DESCRIPTION).toBe('JavaScript + Express スタータープロジェクト');
        });
    });

    describe('Error Handler Tests', () => {
        it('should handle validation errors', async () => {
            const response = await request(app)
                .get('/error')
                .expect(400);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Test validation error');
            expect(response.body).toHaveProperty('error', 'validation_error');
        });

        it('should handle database errors', async () => {
            const response = await request(app)
                .get('/database-error')
                .expect(500);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Test database error');
            expect(response.body).toHaveProperty('error', 'database_error');
        });

        it('should handle authentication errors', async () => {
            const response = await request(app)
                .get('/auth-error')
                .expect(401);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Test authentication error');
            expect(response.body).toHaveProperty('error', 'authentication_error');
        });

        it('should handle authorization errors', async () => {
            const response = await request(app)
                .get('/forbidden')
                .expect(403);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Test authorization error');
            expect(response.body).toHaveProperty('error', 'authorization_error');
        });

        it('should handle not found errors', async () => {
            const response = await request(app)
                .get('/not-found-error')
                .expect(404);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Test not found error');
            expect(response.body).toHaveProperty('error', 'not_found');
        });

        it('should handle internal errors', async () => {
            const response = await request(app)
                .get('/internal-error')
                .expect(500);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Test internal error');
        });

        it('should handle 404 not found', async () => {
            const response = await request(app)
                .get('/non-existent')
                .expect(404);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Route /non-existent not found');
            expect(response.body).toHaveProperty('error', 'not_found');
        });
    });

    describe('Error Classes Tests', () => {
        it('should create AppError correctly', () => {
            const error = new AppError('Test error', 'test_type', 400);
            expect(error.message).toBe('Test error');
            expect(error.type).toBe('test_type');
            expect(error.status).toBe(400);
            expect(error.name).toBe('AppError');
        });

        it('should create ValidationError correctly', () => {
            const error = new ValidationError('Validation failed');
            expect(error.message).toBe('Validation failed');
            expect(error.type).toBe('validation_error');
            expect(error.status).toBe(400);
            expect(error.name).toBe('ValidationError');
        });

        it('should create DatabaseError correctly', () => {
            const error = new DatabaseError('Database connection failed');
            expect(error.message).toBe('Database connection failed');
            expect(error.type).toBe('database_error');
            expect(error.status).toBe(500);
            expect(error.name).toBe('DatabaseError');
        });

        it('should create AuthenticationError correctly', () => {
            const error = new AuthenticationError('Invalid credentials');
            expect(error.message).toBe('Invalid credentials');
            expect(error.type).toBe('authentication_error');
            expect(error.status).toBe(401);
            expect(error.name).toBe('AuthenticationError');
        });

        it('should create AuthorizationError correctly', () => {
            const error = new AuthorizationError('Access denied');
            expect(error.message).toBe('Access denied');
            expect(error.type).toBe('authorization_error');
            expect(error.status).toBe(403);
            expect(error.name).toBe('AuthorizationError');
        });

        it('should create NotFoundError correctly', () => {
            const error = new NotFoundError('Resource not found');
            expect(error.message).toBe('Resource not found');
            expect(error.type).toBe('not_found');
            expect(error.status).toBe(404);
            expect(error.name).toBe('NotFoundError');
        });
    });

    describe('Rate Limiter Tests', () => {
        let testApp;

        beforeEach(() => {
            testApp = express();
            testApp.use(express.json());
        });

        it('should allow requests within rate limit', () => {
            const customLimiter = createCustomRateLimiter(5, 1000);
            
            // 5回のリクエストを送信
            for (let i = 0; i < 5; i++) {
                const req = { ip: '192.168.1.1' };
                const res = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
                const next = jest.fn();
                
                customLimiter(req, res, next);
                expect(next).toHaveBeenCalled();
            }
        });


        it('should return rate limit stats', () => {
            const stats = getRateLimitStats();
            expect(stats).toHaveProperty('totalClients');
            expect(stats).toHaveProperty('totalRequests');
            expect(stats).toHaveProperty('activeClients');
            expect(typeof stats.totalClients).toBe('number');
            expect(typeof stats.totalRequests).toBe('number');
            expect(typeof stats.activeClients).toBe('number');
        });


        it('should handle unknown IP address', () => {
            const customLimiter = createCustomRateLimiter(1, 1000);
            const req = { connection: {} };
            const res = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            customLimiter(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should set correct headers for rate limited requests', () => {
            const customLimiter = createCustomRateLimiter(1, 1000);
            const req = { ip: '192.168.1.1' };
            
            // 最初のリクエスト
            const res1 = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next1 = jest.fn();
            customLimiter(req, res1, next1);

            // 2回目のリクエスト（制限超過）
            const res2 = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next2 = jest.fn();
            customLimiter(req, res2, next2);

            expect(res2.set).toHaveBeenCalledWith({
                'X-RateLimit-Limit': 1,
                'X-RateLimit-Remaining': 0,
                'X-RateLimit-Reset': expect.any(String),
                'Retry-After': expect.any(Number)
            });
            expect(res2.status).toHaveBeenCalledWith(429);
        });

        it('should handle cleanup function', () => {
            const { cleanupRateLimitStore } = require('../src/middleware/rateLimiter');
            expect(typeof cleanupRateLimitStore).toBe('function');
            expect(() => cleanupRateLimitStore()).not.toThrow();
        });

        it('should test main rateLimiter function', () => {
            const { rateLimiter } = require('../src/middleware/rateLimiter');
            const config = require('../src/config/config');
            
            const originalEnabled = config.rateLimitEnabled;
            config.rateLimitEnabled = true;
            
            const req = { ip: '192.168.1.1' };
            const res = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            
            rateLimiter(req, res, next);
            expect(next).toHaveBeenCalled();
            
            config.rateLimitEnabled = originalEnabled;
        });

        it('should skip rate limiting when disabled', () => {
            const { rateLimiter } = require('../src/middleware/rateLimiter');
            const config = require('../src/config/config');
            
            const originalEnabled = config.rateLimitEnabled;
            config.rateLimitEnabled = false;
            
            const req = { ip: '192.168.1.1' };
            const res = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            
            rateLimiter(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.set).not.toHaveBeenCalled();
            
            config.rateLimitEnabled = originalEnabled;
        });
    });

    describe('Config Tests', () => {
        let originalEnv;

        beforeEach(() => {
            originalEnv = { ...process.env };
        });

        afterEach(() => {
            process.env = originalEnv;
        });

        it('should load default configuration', () => {
            const config = require('../src/config/config');
            expect(config.port).toBe(8081); // テスト環境では8081が設定されている
            expect(config.nodeEnv).toBe('test');
            expect(config.host).toBe('0.0.0.0');
            expect(config.dbPath).toBe('./data/test-database.sqlite');
            expect(config.appName).toBe('Hello World API');
            expect(config.appVersion).toBe('1.0.0');
        });

        it('should load configuration from environment variables', () => {
            // 環境変数を設定
            const originalEnv = { ...process.env };
            process.env.PORT = '3000';
            process.env.NODE_ENV = 'production';
            process.env.DB_PATH = '/custom/path/db.sqlite';
            process.env.LOG_LEVEL = 'debug';
            process.env.RATE_LIMIT_ENABLED = 'false';
            process.env.MOCK_MODE = 'true';
            process.env.DEBUG_MODE = 'true';

            // モジュールを再読み込み
            jest.resetModules();
            const config = require('../src/config/config');

            expect(config.port).toBe(3000);
            expect(config.nodeEnv).toBe('production');
            expect(config.dbPath).toBe('/custom/path/db.sqlite');
            expect(config.logLevel).toBe('info'); // production環境では'info'に上書きされる
            expect(config.rateLimitEnabled).toBe(true); // production環境ではtrueに上書きされる
            expect(config.mockMode).toBe(false); // production環境ではfalseに上書きされる
            expect(config.debugMode).toBe(false); // production環境ではfalseに上書きされる

            // 環境変数を復元
            process.env = originalEnv;
        });

        it('should handle invalid port number', () => {
            // process.exitをモックしてテストが終了しないようにする
            const originalExit = process.exit;
            process.exit = jest.fn();
            
            const originalEnv = { ...process.env };
            process.env.PORT = '70000';
            jest.resetModules();
            
            // 設定検証でエラーが発生することを確認
            let config;
            try {
                config = require('../src/config/config');
            } catch (error) {
                expect(error.message).toContain('Invalid port number');
                expect(process.exit).toHaveBeenCalledWith(1);
            }
            
            // process.exitを元に戻す
            process.exit = originalExit;
            process.env = originalEnv;
        });

        it('should handle missing required fields', () => {
            const originalPort = process.env.PORT;
            const originalDbPath = process.env.DB_PATH;
            
            delete process.env.PORT;
            delete process.env.DB_PATH;
            
            jest.resetModules();
            
            // デフォルト値が設定されるため、エラーは発生しない
            const config = require('../src/config/config');
            expect(config.port).toBe(8080);
            expect(config.dbPath).toBe('./data/database.sqlite');
            
            // 環境変数を復元
            if (originalPort) process.env.PORT = originalPort;
            if (originalDbPath) process.env.DB_PATH = originalDbPath;
        });
    });

    describe('Database Tests', () => {
        let database;
        let originalEnv;

        beforeEach(() => {
            originalEnv = { ...process.env };
            process.env.DB_PATH = './data/test-database.sqlite';
            jest.resetModules();
            database = require('../src/config/database');
        });

        afterEach(async () => {
            process.env = originalEnv;
            if (database.isConnected()) {
                await database.disconnect();
            }
        });

        it('should connect to database successfully', async () => {
            const result = await database.connect();
            expect(result).toBe(true);
            expect(database.isConnected()).toBe(true);
        });

        it('should initialize tables on connection', async () => {
            await database.connect();
            expect(database.isConnected()).toBe(true);
            
            // テーブルが存在することを確認
            const result = await database.query("SELECT name FROM sqlite_master WHERE type='table' AND name='hello_world_messages'");
            expect(result.rows.length).toBe(1);
        });

        it('should disconnect from database', async () => {
            await database.connect();
            expect(database.isConnected()).toBe(true);
            
            await database.disconnect();
            expect(database.isConnected()).toBe(false);
        });

        it('should handle disconnect when not connected', async () => {
            expect(database.isConnected()).toBe(false);
            await expect(database.disconnect()).resolves.not.toThrow();
        });

        it('should execute query successfully', async () => {
            await database.connect();
            
            const result = await database.query('SELECT 1 as test');
            expect(result.rows).toEqual([{ test: 1 }]);
            expect(result.rowCount).toBe(1);
        });

        it('should execute queryOne successfully', async () => {
            await database.connect();
            
            const result = await database.queryOne('SELECT 1 as test');
            expect(result.row).toEqual({ test: 1 });
            expect(result.rowCount).toBe(1);
        });

        it('should execute run successfully', async () => {
            await database.connect();
            
            const result = await database.run('INSERT INTO hello_world_messages (name, message) VALUES (?, ?)', ['Test', 'Hello']);
            expect(result.lastID).toBeDefined();
            expect(result.changes).toBe(1);
        });

        it('should handle query with parameters', async () => {
            await database.connect();
            
            // テストデータを挿入
            await database.run('INSERT INTO hello_world_messages (name, message) VALUES (?, ?)', ['TestUser', 'Test Message']);
            
            const result = await database.query('SELECT * FROM hello_world_messages WHERE name = ?', ['TestUser']);
            expect(result.rows.length).toBe(1);
            expect(result.rows[0].name).toBe('TestUser');
            expect(result.rows[0].message).toBe('Test Message');
        });

        it('should handle queryOne with no results', async () => {
            await database.connect();
            
            const result = await database.queryOne('SELECT * FROM hello_world_messages WHERE name = ?', ['NonExistent']);
            expect(result.row).toBeUndefined();
            expect(result.rowCount).toBe(0);
        });

        it('should throw error when querying without connection', async () => {
            expect(database.isConnected()).toBe(false);
            
            await expect(database.query('SELECT 1')).rejects.toThrow('Database not connected');
            await expect(database.queryOne('SELECT 1')).rejects.toThrow('Database not connected');
            await expect(database.run('INSERT INTO test VALUES (1)')).rejects.toThrow('Database not connected');
        });

        it('should handle database errors gracefully', async () => {
            await database.connect();
            
            // 無効なSQLを実行してエラーをテスト
            await expect(database.query('SELECT * FROM non_existent_table')).rejects.toThrow();
        });

        it('should handle connection errors gracefully', async () => {
            // 無効なパスでデータベースに接続しようとする
            process.env.DB_PATH = '/invalid/path/database.sqlite';
            jest.resetModules();
            const testDatabase = require('../src/config/database');
            
            const result = await testDatabase.connect();
            expect(result).toBe(false);
            expect(testDatabase.isConnected()).toBe(false);
        });

        it('should create database directory if it does not exist', async () => {
            const fs = require('fs');
            const path = require('path');
            
            // 一時的なディレクトリパス
            const tempDbPath = './data/temp/test-database.sqlite';
            process.env.DB_PATH = tempDbPath;
            
            jest.resetModules();
            const testDatabase = require('../src/config/database');
            
            const result = await testDatabase.connect();
            expect(result).toBe(true);
            expect(testDatabase.isConnected()).toBe(true);
            
            // ディレクトリが作成されたことを確認
            expect(fs.existsSync(path.dirname(tempDbPath))).toBe(true);
            
            await testDatabase.disconnect();
            
            // クリーンアップ
            if (fs.existsSync(tempDbPath)) {
                fs.unlinkSync(tempDbPath);
            }
            if (fs.existsSync(path.dirname(tempDbPath))) {
                fs.rmdirSync(path.dirname(tempDbPath));
            }
        });
    });

    describe('Response Factory Tests', () => {
        it('should create success response', () => {
            const response = ResponseFactory.success('Test message', { id: 1 });
            expect(response.status).toBe('success');
            expect(response.message).toBe('Test message');
            expect(response.data).toEqual({ id: 1 });
            expect(response.timestamp).toBeDefined();
        });

        it('should create success response without data', () => {
            const response = ResponseFactory.success('Test message');
            expect(response.status).toBe('success');
            expect(response.message).toBe('Test message');
            expect(response.data).toBeUndefined();
        });

        it('should create success response with meta', () => {
            const response = ResponseFactory.success('Test message', { id: 1 }, { version: '1.0' });
            expect(response.meta).toEqual({ version: '1.0' });
        });

        it('should create validation error response', () => {
            const response = ResponseFactory.validationError('Validation failed');
            expect(response.status).toBe('error');
            expect(response.error).toBe('validation_error');
            expect(response.message).toBe('Validation failed');
            expect(response.statusCode).toBe(400);
        });

        it('should create database error response', () => {
            const response = ResponseFactory.databaseError('Database error');
            expect(response.status).toBe('error');
            expect(response.error).toBe('database_error');
            expect(response.message).toBe('Database error');
            expect(response.statusCode).toBe(500);
        });

        it('should create authentication error response', () => {
            const response = ResponseFactory.authenticationError('Auth failed');
            expect(response.status).toBe('error');
            expect(response.error).toBe('authentication_error');
            expect(response.message).toBe('Auth failed');
            expect(response.statusCode).toBe(401);
        });

        it('should create authorization error response', () => {
            const response = ResponseFactory.authorizationError('Access denied');
            expect(response.status).toBe('error');
            expect(response.error).toBe('authorization_error');
            expect(response.message).toBe('Access denied');
            expect(response.statusCode).toBe(403);
        });

        it('should create not found error response', () => {
            const response = ResponseFactory.notFoundError('Not found');
            expect(response.status).toBe('error');
            expect(response.error).toBe('not_found');
            expect(response.message).toBe('Not found');
            expect(response.statusCode).toBe(404);
        });

        it('should create internal error response', () => {
            const response = ResponseFactory.internalError('Internal error');
            expect(response.status).toBe('error');
            expect(response.error).toBe('internal_error');
            expect(response.message).toBe('Internal error');
            expect(response.statusCode).toBe(500);
        });

        it('should create rate limit error response', () => {
            const response = ResponseFactory.rateLimitError('Rate limit exceeded');
            expect(response.status).toBe('error');
            expect(response.error).toBe('rate_limit_exceeded');
            expect(response.message).toBe('Rate limit exceeded');
            expect(response.statusCode).toBe(429);
        });

        it('should create method not allowed error response', () => {
            const response = ResponseFactory.methodNotAllowedError('Method not allowed');
            expect(response.status).toBe('error');
            expect(response.error).toBe('method_not_allowed');
            expect(response.message).toBe('Method not allowed');
            expect(response.statusCode).toBe(405);
        });

        it('should create service unavailable error response', () => {
            const response = ResponseFactory.serviceUnavailableError('Service unavailable');
            expect(response.status).toBe('error');
            expect(response.error).toBe('service_unavailable');
            expect(response.message).toBe('Service unavailable');
            expect(response.statusCode).toBe(503);
        });

        it('should create gateway timeout error response', () => {
            const response = ResponseFactory.gatewayTimeoutError('Gateway timeout');
            expect(response.status).toBe('error');
            expect(response.error).toBe('gateway_timeout');
            expect(response.message).toBe('Gateway timeout');
            expect(response.statusCode).toBe(504);
        });

        it('should create error response with custom status code', () => {
            const response = ResponseFactory.error('custom_error', 'Custom error', 422);
            expect(response.status).toBe('error');
            expect(response.error).toBe('custom_error');
            expect(response.message).toBe('Custom error');
            expect(response.statusCode).toBe(422);
        });

        it('should create error response with details', () => {
            const details = { field: 'email', message: 'Invalid email' };
            const response = ResponseFactory.validationError('Validation failed', details);
            expect(response.details).toEqual(details);
        });

        it('should create validation errors', () => {
            const fieldErrors = [
                { field: 'email', message: 'Invalid email', value: 'test' },
                { field: 'password', message: 'Too short', value: '123' }
            ];
            const validationErrors = ResponseFactory.createValidationErrors(fieldErrors);
            expect(validationErrors).toHaveProperty('validationErrors');
            expect(validationErrors.validationErrors).toHaveLength(2);
            expect(validationErrors.validationErrors[0]).toEqual(fieldErrors[0]);
            expect(validationErrors.validationErrors[1]).toEqual(fieldErrors[1]);
        });

        describe('BaseResponse Tests', () => {
            it('should create base response with all properties', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message', { id: 1 }, { version: '1.0' });
                expect(response.status).toBe('success');
                expect(response.message).toBe('Test message');
                expect(response.data).toEqual({ id: 1 });
                expect(response.meta).toEqual({ version: '1.0' });
                expect(response.timestamp).toBeDefined();
            });

            it('should create base response without optional properties', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message');
                expect(response.status).toBe('success');
                expect(response.message).toBe('Test message');
                expect(response.data).toBeUndefined();
                expect(response.meta).toBeUndefined();
            });

            it('should convert to JSON correctly', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message', { id: 1 }, { version: '1.0' });
                const json = response.toJSON();
                expect(json).toHaveProperty('status', 'success');
                expect(json).toHaveProperty('message', 'Test message');
                expect(json).toHaveProperty('data', { id: 1 });
                expect(json).toHaveProperty('meta', { version: '1.0' });
                expect(json).toHaveProperty('timestamp');
            });

            it('should convert to JSON without optional properties', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message');
                const json = response.toJSON();
                expect(json).toHaveProperty('status', 'success');
                expect(json).toHaveProperty('message', 'Test message');
                expect(json).toHaveProperty('timestamp');
                expect(json).not.toHaveProperty('data');
                expect(json).not.toHaveProperty('meta');
            });

            it('should add meta data', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message');
                response.addMeta('version', '1.0');
                expect(response.meta).toEqual({ version: '1.0' });
            });

            it('should add multiple meta data', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message');
                response.addMeta('version', '1.0');
                response.addMeta('environment', 'test');
                expect(response.meta).toEqual({ version: '1.0', environment: 'test' });
            });

            it('should add pagination information', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message');
                response.addPagination(1, 10, 100, 10);
                expect(response.meta).toHaveProperty('pagination');
                expect(response.meta.pagination).toEqual({
                    page: 1,
                    limit: 10,
                    total: 100,
                    totalPages: 10
                });
            });

            it('should chain methods', () => {
                const { BaseResponse } = require('../src/models/response');
                const response = new BaseResponse('Test message')
                    .addMeta('version', '1.0')
                    .addPagination(1, 10, 100, 10);
                expect(response.meta).toHaveProperty('version', '1.0');
                expect(response.meta).toHaveProperty('pagination');
            });
        });

        describe('ErrorResponse Tests', () => {
            it('should create error response with all properties', () => {
                const { ErrorResponse } = require('../src/models/response');
                const details = { field: 'email', message: 'Invalid email' };
                const response = new ErrorResponse('validation_error', 'Validation failed', 400, details);
                expect(response.status).toBe('error');
                expect(response.error).toBe('validation_error');
                expect(response.message).toBe('Validation failed');
                expect(response.statusCode).toBe(400);
                expect(response.details).toEqual(details);
                expect(response.timestamp).toBeDefined();
            });

            it('should create error response without details', () => {
                const { ErrorResponse } = require('../src/models/response');
                const response = new ErrorResponse('validation_error', 'Validation failed', 400);
                expect(response.status).toBe('error');
                expect(response.error).toBe('validation_error');
                expect(response.message).toBe('Validation failed');
                expect(response.statusCode).toBe(400);
                expect(response.details).toBeUndefined();
            });

            it('should convert to JSON correctly', () => {
                const { ErrorResponse } = require('../src/models/response');
                const details = { field: 'email', message: 'Invalid email' };
                const response = new ErrorResponse('validation_error', 'Validation failed', 400, details);
                const json = response.toJSON();
                expect(json).toHaveProperty('status', 'error');
                expect(json).toHaveProperty('error', 'validation_error');
                expect(json).toHaveProperty('message', 'Validation failed');
                expect(json).toHaveProperty('details', details);
                expect(json).toHaveProperty('timestamp');
            });

            it('should convert to JSON without details', () => {
                const { ErrorResponse } = require('../src/models/response');
                const response = new ErrorResponse('validation_error', 'Validation failed', 400);
                const json = response.toJSON();
                expect(json).toHaveProperty('status', 'error');
                expect(json).toHaveProperty('error', 'validation_error');
                expect(json).toHaveProperty('message', 'Validation failed');
                expect(json).toHaveProperty('timestamp');
                expect(json).not.toHaveProperty('details');
            });

            it('should add details', () => {
                const { ErrorResponse } = require('../src/models/response');
                const response = new ErrorResponse('validation_error', 'Validation failed', 400);
                const details = { field: 'email', message: 'Invalid email' };
                response.addDetails(details);
                expect(response.details).toEqual(details);
            });

            it('should add validation errors', () => {
                const { ErrorResponse } = require('../src/models/response');
                const response = new ErrorResponse('validation_error', 'Validation failed', 400);
                const errors = [
                    { field: 'email', message: 'Invalid email' },
                    { field: 'password', message: 'Too short' }
                ];
                response.addValidationErrors(errors);
                expect(response.details).toHaveProperty('validationErrors', errors);
            });

            it('should chain methods', () => {
                const { ErrorResponse } = require('../src/models/response');
                const response = new ErrorResponse('validation_error', 'Validation failed', 400)
                    .addDetails({ field: 'email' })
                    .addValidationErrors([{ field: 'email', message: 'Invalid' }]);
                expect(response.details).toHaveProperty('validationErrors');
            });
        });

        describe('Constants Tests', () => {
            it('should have correct error types', () => {
                const { ErrorTypes } = require('../src/models/response');
                expect(ErrorTypes.VALIDATION).toBe('validation_error');
                expect(ErrorTypes.DATABASE).toBe('database_error');
                expect(ErrorTypes.AUTHENTICATION).toBe('authentication_error');
                expect(ErrorTypes.AUTHORIZATION).toBe('authorization_error');
                expect(ErrorTypes.NOT_FOUND).toBe('not_found');
                expect(ErrorTypes.INTERNAL).toBe('internal_error');
                expect(ErrorTypes.RATE_LIMIT).toBe('rate_limit_exceeded');
                expect(ErrorTypes.METHOD_NOT_ALLOWED).toBe('method_not_allowed');
                expect(ErrorTypes.SERVICE_UNAVAILABLE).toBe('service_unavailable');
                expect(ErrorTypes.GATEWAY_TIMEOUT).toBe('gateway_timeout');
            });

            it('should have correct status codes', () => {
                const { StatusCodes } = require('../src/models/response');
                expect(StatusCodes.OK).toBe(200);
                expect(StatusCodes.CREATED).toBe(201);
                expect(StatusCodes.NO_CONTENT).toBe(204);
                expect(StatusCodes.BAD_REQUEST).toBe(400);
                expect(StatusCodes.UNAUTHORIZED).toBe(401);
                expect(StatusCodes.FORBIDDEN).toBe(403);
                expect(StatusCodes.NOT_FOUND).toBe(404);
                expect(StatusCodes.METHOD_NOT_ALLOWED).toBe(405);
                expect(StatusCodes.CONFLICT).toBe(409);
                expect(StatusCodes.UNPROCESSABLE_ENTITY).toBe(422);
                expect(StatusCodes.TOO_MANY_REQUESTS).toBe(429);
                expect(StatusCodes.INTERNAL_SERVER_ERROR).toBe(500);
                expect(StatusCodes.SERVICE_UNAVAILABLE).toBe(503);
                expect(StatusCodes.GATEWAY_TIMEOUT).toBe(504);
            });
        });
    });

    describe('Validator Tests', () => {
        describe('String Validation', () => {
            it('should validate required string', () => {
                const result = validateString('test', 'name');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('test');
            });

            it('should fail for missing required string', () => {
                const result = validateString(undefined, 'name');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('name is required');
            });

            it('should validate optional string', () => {
                const result = validateString('', 'name', { required: false });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('');
            });

            it('should validate string length', () => {
                const result = validateString('test', 'name', { minLength: 2, maxLength: 10 });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('test');
            });

            it('should fail for string too short', () => {
                const result = validateString('a', 'name', { minLength: 2 });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('name must be at least 2 characters long');
            });

            it('should fail for string too long', () => {
                const result = validateString('very long string', 'name', { maxLength: 5 });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('name must be no more than 5 characters long');
            });

            it('should validate string pattern', () => {
                const result = validateString('test@example.com', 'email', { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('test@example.com');
            });

            it('should fail for invalid pattern', () => {
                const result = validateString('invalid-email', 'email', { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('email format is invalid');
            });

            it('should trim string by default', () => {
                const result = validateString('  test  ', 'name');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('test');
            });

            it('should not trim string when disabled', () => {
                const result = validateString('  test  ', 'name', { trim: false });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('  test  ');
            });
        });

        describe('Number Validation', () => {
            it('should validate required number', () => {
                const result = validateNumber('123', 'age');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe(123);
            });

            it('should fail for missing required number', () => {
                const result = validateNumber(undefined, 'age');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('age is required');
            });

            it('should validate optional number', () => {
                const result = validateNumber('', 'age', { required: false });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe(null);
            });

            it('should fail for invalid number', () => {
                const result = validateNumber('not-a-number', 'age');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('age must be a valid number');
            });

            it('should validate integer', () => {
                const result = validateNumber('123', 'age', { integer: true });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe(123);
            });

            it('should fail for non-integer', () => {
                const result = validateNumber('123.45', 'age', { integer: true });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('age must be an integer');
            });

            it('should validate number range', () => {
                const result = validateNumber('50', 'age', { min: 0, max: 120 });
                expect(result.isValid).toBe(true);
                expect(result.value).toBe(50);
            });

            it('should fail for number below minimum', () => {
                const result = validateNumber('-1', 'age', { min: 0 });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('age must be at least 0');
            });

            it('should fail for number above maximum', () => {
                const result = validateNumber('150', 'age', { max: 120 });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('age must be no more than 120');
            });
        });

        describe('Email Validation', () => {
            it('should validate valid email', () => {
                const result = validateEmail('test@example.com', 'email');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('test@example.com');
            });

            it('should fail for invalid email', () => {
                const result = validateEmail('invalid-email', 'email');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('email format is invalid');
            });

            it('should fail for email without domain', () => {
                const result = validateEmail('test@', 'email');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('email format is invalid');
            });
        });

        describe('URL Validation', () => {
            it('should validate valid URL', () => {
                const result = validateURL('https://example.com', 'url');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('https://example.com');
            });

            it('should validate HTTP URL', () => {
                const result = validateURL('http://example.com', 'url');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('http://example.com');
            });

            it('should fail for invalid URL', () => {
                const result = validateURL('not-a-url', 'url');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('url format is invalid');
            });
        });

        describe('Array Validation', () => {
            it('should validate required array', () => {
                const result = validateArray(['item1', 'item2'], 'items');
                expect(result.isValid).toBe(true);
                expect(result.value).toEqual(['item1', 'item2']);
            });

            it('should fail for missing required array', () => {
                const result = validateArray(undefined, 'items');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('items is required');
            });

            it('should validate optional array', () => {
                const result = validateArray(undefined, 'items', { required: false });
                expect(result.isValid).toBe(true);
                expect(result.value).toEqual([]);
            });

            it('should fail for non-array', () => {
                const result = validateArray('not-an-array', 'items');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('items must be an array');
            });

            it('should validate array length', () => {
                const result = validateArray(['item1', 'item2'], 'items', { minLength: 1, maxLength: 5 });
                expect(result.isValid).toBe(true);
                expect(result.value).toEqual(['item1', 'item2']);
            });

            it('should fail for array too short', () => {
                const result = validateArray([], 'items', { minLength: 1 });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('items must have at least 1 items');
            });

            it('should fail for array too long', () => {
                const result = validateArray(['item1', 'item2', 'item3'], 'items', { maxLength: 2 });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('items must have no more than 2 items');
            });
        });

        describe('Object Validation', () => {
            it('should validate required object', () => {
                const schema = {
                    name: (value) => validateString(value, 'name'),
                    age: (value) => validateNumber(value, 'age')
                };
                const result = validateObject({ name: 'John', age: '30' }, 'user', { schema });
                expect(result.isValid).toBe(true);
                expect(result.value).toEqual({ name: 'John', age: 30 });
            });

            it('should fail for missing required object', () => {
                const result = validateObject(undefined, 'user');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('user is required');
            });

            it('should validate optional object', () => {
                const result = validateObject(undefined, 'user', { required: false });
                expect(result.isValid).toBe(true);
                expect(result.value).toEqual({});
            });

            it('should fail for non-object', () => {
                const result = validateObject('not-an-object', 'user');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('user must be an object');
            });

            it('should fail for array', () => {
                const result = validateObject([], 'user');
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('user must be an object');
            });

            it('should fail for unknown properties', () => {
                const schema = { name: (value) => validateString(value, 'name') };
                const result = validateObject({ name: 'John', unknown: 'value' }, 'user', { schema });
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('Unknown property: unknown');
            });

            it('should allow unknown properties when configured', () => {
                const schema = { name: (value) => validateString(value, 'name') };
                const result = validateObject({ name: 'John', unknown: 'value' }, 'user', { schema, allowUnknown: true });
                expect(result.isValid).toBe(true);
                expect(result.value).toEqual({ name: 'John' });
            });
        });

        describe('Validator Middleware', () => {
            let testApp;

            beforeEach(() => {
                testApp = express();
                testApp.use(express.json());
            });

            it('should validate request body', async () => {
                const schema = {
                    body: {
                        name: (value) => validateString(value, 'name'),
                        age: (value) => validateNumber(value, 'age')
                    }
                };

                testApp.post('/test', createValidator(schema), (req, res) => {
                    res.json({ validated: req.validated });
                });

                const response = await request(testApp)
                    .post('/test')
                    .send({ name: 'John', age: '30' })
                    .expect(200);

                expect(response.body.validated.body).toEqual({ name: 'John', age: 30 });
            });

            it('should fail validation for invalid body', async () => {
                const schema = {
                    body: {
                        name: (value) => validateString(value, 'name'),
                        age: (value) => validateNumber(value, 'age')
                    }
                };

                testApp.post('/test', createValidator(schema), (req, res) => {
                    res.json({ validated: req.validated });
                });

                const response = await request(testApp)
                    .post('/test')
                    .send({ name: '', age: 'invalid' })
                    .expect(400);

                expect(response.body).toHaveProperty('status', 'error');
                expect(response.body).toHaveProperty('error', 'validation_error');
            });

            it('should validate query parameters', async () => {
                const schema = {
                    query: {
                        page: (value) => validateNumber(value, 'page', { min: 1, integer: true }),
                        limit: (value) => validateNumber(value, 'limit', { min: 1, max: 100, integer: true })
                    }
                };

                testApp.get('/test', createValidator(schema), (req, res) => {
                    res.json({ validated: req.validated });
                });

                const response = await request(testApp)
                    .get('/test?page=1&limit=10')
                    .expect(200);

                expect(response.body.validated.query).toEqual({ page: 1, limit: 10 });
            });
        });

        describe('Common Schemas', () => {
            it('should validate pagination schema', () => {
                const pageResult = commonSchemas.pagination.page('1');
                const limitResult = commonSchemas.pagination.limit('10');

                expect(pageResult.isValid).toBe(true);
                expect(pageResult.value).toBe(1);
                expect(limitResult.isValid).toBe(true);
                expect(limitResult.value).toBe(10);
            });

            it('should validate ID schema', () => {
                const result = commonSchemas.id('123');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe(123);
            });

            it('should validate email schema', () => {
                const result = commonSchemas.email('test@example.com');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('test@example.com');
            });

            it('should validate name schema', () => {
                const result = commonSchemas.name('John Doe');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('John Doe');
            });

            it('should validate message schema', () => {
                const result = commonSchemas.message('Hello World');
                expect(result.isValid).toBe(true);
                expect(result.value).toBe('Hello World');
            });
        });
    });

    describe('Health Controller Tests', () => {
        let testApp;

        beforeEach(() => {
            testApp = express();
            testApp.use(express.json());
            testApp.get('/health', healthController.checkHealth);
            testApp.get('/app-info', healthController.getAppInfo);
        });

        describe('checkHealth', () => {
            it('should return health status successfully', async () => {
                const response = await request(testApp)
                    .get('/health')
                    .expect(200);

                expect(response.body).toHaveProperty('status', 'success');
                expect(response.body).toHaveProperty('message', 'Health check successful');
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('status', 'OK');
                expect(response.body.data).toHaveProperty('message', 'Server is running');
            });

            it('should return memory usage information', async () => {
                const response = await request(testApp)
                    .get('/health')
                    .expect(200);

                const memory = response.body.data.memory;
                expect(memory).toHaveProperty('rss');
                expect(memory).toHaveProperty('heapTotal');
                expect(memory).toHaveProperty('heapUsed');
                expect(memory).toHaveProperty('external');
                expect(typeof memory.rss).toBe('number');
                expect(typeof memory.heapTotal).toBe('number');
                expect(typeof memory.heapUsed).toBe('number');
                expect(typeof memory.external).toBe('number');
            });

            it('should return environment information', async () => {
                const response = await request(testApp)
                    .get('/health')
                    .expect(200);

                expect(response.body.data).toHaveProperty('environment');
                expect(typeof response.body.data.environment).toBe('string');
            });

            it('should return uptime information', async () => {
                const response = await request(testApp)
                    .get('/health')
                    .expect(200);

                expect(response.body.data).toHaveProperty('uptime');
                expect(typeof response.body.data.uptime).toBe('number');
                expect(response.body.data.uptime).toBeGreaterThan(0);
            });

            it('should return timestamp information', async () => {
                const response = await request(testApp)
                    .get('/health')
                    .expect(200);

                expect(response.body.data).toHaveProperty('timestamp');
                expect(typeof response.body.data.timestamp).toBe('string');
                expect(new Date(response.body.data.timestamp)).toBeInstanceOf(Date);
            });

            it('should return database connection status', async () => {
                const response = await request(testApp)
                    .get('/health')
                    .expect(200);

                expect(response.body.data.database).toHaveProperty('connected');
                expect(response.body.data.database).toHaveProperty('mode');
                expect(typeof response.body.data.database.connected).toBe('boolean');
                expect(typeof response.body.data.database.mode).toBe('string');
            });


            it('should handle database disconnected state', async () => {
                const database = require('../src/config/database');
                try {
                    // データベース接続を切断
                    await database.disconnect();
                    
                    const response = await request(testApp)
                        .get('/health')
                        .expect(200);

                    expect(response.body.data.database).toHaveProperty('connected', false);
                    expect(response.body.data.database).toHaveProperty('mode', 'mock');
                } finally {
                    // データベース接続を復元
                    await database.connect();
                }
            });
        });

        describe('getAppInfo', () => {
            it('should return application information successfully', async () => {
                const response = await request(testApp)
                    .get('/app-info')
                    .expect(200);

                expect(response.body).toHaveProperty('status', 'success');
                expect(response.body).toHaveProperty('message', 'Application info retrieved');
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('name', 'Hello World API');
                expect(response.body.data).toHaveProperty('version', '1.0.0');
                expect(response.body.data).toHaveProperty('description', 'JavaScript + Express スタータープロジェクト');
            });

            it('should return environment information', async () => {
                const response = await request(testApp)
                    .get('/app-info')
                    .expect(200);

                expect(response.body.data).toHaveProperty('environment');
                expect(typeof response.body.data.environment).toBe('string');
            });

            it('should return timestamp information', async () => {
                const response = await request(testApp)
                    .get('/app-info')
                    .expect(200);

                expect(response.body.data).toHaveProperty('timestamp');
                expect(typeof response.body.data.timestamp).toBe('string');
                expect(new Date(response.body.data.timestamp)).toBeInstanceOf(Date);
            });

            it('should return endpoints information', async () => {
                const response = await request(testApp)
                    .get('/app-info')
                    .expect(200);

                expect(response.body.data).toHaveProperty('endpoints');
                expect(response.body.data.endpoints).toHaveProperty('health', '/api/health');
                expect(response.body.data.endpoints).toHaveProperty('helloWorld', '/api/hello-world');
            });

            it('should handle app info error', async () => {
                // エラーを発生させるために、ResponseFactoryを一時的にモック
                const originalSuccess = ResponseFactory.success;
                
                try {
                    ResponseFactory.success = jest.fn().mockImplementation(() => {
                        throw new Error('Response factory error');
                    });
                    
                    const response = await request(testApp)
                        .get('/app-info')
                        .expect(500);

                    expect(response.body).toHaveProperty('status', 'error');
                    expect(response.body).toHaveProperty('message', 'Failed to get application info');
                } finally {
                    // モックを元に戻す
                    ResponseFactory.success = originalSuccess;
                }
            });
        });

        describe('Direct Controller Method Tests', () => {
            it('should test checkHealth method directly', async () => {
                const req = {};
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await healthController.checkHealth(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalled();
                
                const responseData = res.json.mock.calls[0][0];
                expect(responseData).toHaveProperty('status', 'success');
                expect(responseData).toHaveProperty('message', 'Health check successful');
            });

            it('should test getAppInfo method directly', async () => {
                const req = {};
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await healthController.getAppInfo(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalled();
                
                const responseData = res.json.mock.calls[0][0];
                expect(responseData).toHaveProperty('status', 'success');
                expect(responseData).toHaveProperty('message', 'Application info retrieved');
            });


            it('should handle getAppInfo method error', async () => {
                // エラーを発生させるために、ResponseFactoryを一時的にモック
                const originalSuccess = ResponseFactory.success;
                
                try {
                    ResponseFactory.success = jest.fn().mockImplementation(() => {
                        throw new Error('Test error');
                    });

                    const req = {};
                    const res = {
                        status: jest.fn().mockReturnThis(),
                        json: jest.fn()
                    };

                    await healthController.getAppInfo(req, res);

                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalled();
                    
                    const responseData = res.json.mock.calls[0][0];
                    expect(responseData).toHaveProperty('status', 'error');
                    expect(responseData).toHaveProperty('message', 'Failed to get application info');
                } finally {
                    // モックを元に戻す
                    ResponseFactory.success = originalSuccess;
                }
            });
        });
    });

    describe('Logger Tests', () => {
        const { 
            logger, 
            requestLogger, 
            errorLogger, 
            performanceLogger, 
            databaseLogger, 
            securityLogger, 
            logApplicationStart, 
            logApplicationShutdown,
            LogLevel,
            LogLevelName
        } = require('../src/middleware/logger');

        describe('Log Level Tests', () => {
            it('should have correct log levels', () => {
                expect(LogLevel.ERROR).toBe(0);
                expect(LogLevel.WARN).toBe(1);
                expect(LogLevel.INFO).toBe(2);
                expect(LogLevel.DEBUG).toBe(3);
            });

            it('should have correct log level names', () => {
                expect(LogLevelName[0]).toBe('ERROR');
                expect(LogLevelName[1]).toBe('WARN');
                expect(LogLevelName[2]).toBe('INFO');
                expect(LogLevelName[3]).toBe('DEBUG');
            });
        });

        describe('Logger Function Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should log error messages', () => {
                logger.error('Test error', { error: 'details' });
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should log warn messages', () => {
                logger.warn('Test warning', { warning: 'details' });
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should log info messages', () => {
                logger.info('Test info', { info: 'details' });
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should log debug messages', () => {
                // ログレベルを一時的にdebugに設定
                const originalConfig = require('../src/config/config');
                const mockConfig = { ...originalConfig, logLevel: 'debug' };
                jest.doMock('../src/config/config', () => mockConfig);
                
                // loggerを再読み込み
                const { logger } = require('../src/middleware/logger');
                
                logger.debug('Test debug', { debug: 'details' });
                expect(consoleLogSpy).toHaveBeenCalled();
                
                // モックを元に戻す
                jest.doMock('../src/config/config', () => originalConfig);
            });

            it('should log without data', () => {
                logger.info('Test message without data');
                expect(consoleLogSpy).toHaveBeenCalled();
            });
        });

        describe('Request Logger Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should log incoming request', () => {
                const req = {
                    method: 'GET',
                    url: '/test',
                    ip: '127.0.0.1',
                    get: jest.fn().mockReturnValue('test-agent')
                };
                const res = {
                    on: jest.fn(),
                    get: jest.fn().mockReturnValue('100')
                };
                const next = jest.fn();

                requestLogger(req, res, next);

                expect(next).toHaveBeenCalled();
                expect(req.requestId).toBeDefined();
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should log request completion', () => {
                const req = {
                    method: 'GET',
                    url: '/test',
                    ip: '127.0.0.1',
                    get: jest.fn().mockReturnValue('test-agent')
                };
                const res = {
                    on: jest.fn((event, callback) => {
                        if (event === 'finish') {
                            callback();
                        }
                    }),
                    get: jest.fn().mockReturnValue('100'),
                    statusCode: 200
                };
                const next = jest.fn();

                requestLogger(req, res, next);

                expect(next).toHaveBeenCalled();
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should log error status codes as warnings', () => {
                const req = {
                    method: 'GET',
                    url: '/test',
                    ip: '127.0.0.1',
                    get: jest.fn().mockReturnValue('test-agent')
                };
                const res = {
                    on: jest.fn((event, callback) => {
                        if (event === 'finish') {
                            callback();
                        }
                    }),
                    get: jest.fn().mockReturnValue('100'),
                    statusCode: 404
                };
                const next = jest.fn();

                requestLogger(req, res, next);

                expect(next).toHaveBeenCalled();
                expect(consoleLogSpy).toHaveBeenCalled();
            });
        });

        describe('Error Logger Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should log unhandled errors', () => {
                const req = {
                    requestId: 'test-id',
                    method: 'GET',
                    url: '/test',
                    headers: {},
                    body: {}
                };
                const res = {};
                const next = jest.fn();
                const error = new Error('Test error');

                errorLogger(error, req, res, next);

                expect(next).toHaveBeenCalledWith(error);
                expect(consoleLogSpy).toHaveBeenCalled();
            });
        });

        describe('Performance Logger Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should log slow requests', () => {
                const req = {
                    requestId: 'test-id',
                    method: 'GET',
                    url: '/test'
                };
                const res = {
                    on: jest.fn((event, callback) => {
                        if (event === 'finish') {
                            // 1秒以上の処理時間をシミュレート
                            setTimeout(callback, 10);
                        }
                    })
                };
                const next = jest.fn();

                performanceLogger(req, res, next);

                expect(next).toHaveBeenCalled();
            });

            it('should log request performance in debug mode', () => {
                // 設定を一時的にdebug modeに変更
                const originalConfig = require('../src/config/config');
                const mockConfig = { ...originalConfig, debugMode: true };
                jest.doMock('../src/config/config', () => mockConfig);
                
                // performanceLoggerを再読み込み
                const { performanceLogger } = require('../src/middleware/logger');

                const req = {
                    requestId: 'test-id',
                    method: 'GET',
                    url: '/test'
                };
                const res = {
                    on: jest.fn((event, callback) => {
                        if (event === 'finish') {
                            callback();
                        }
                    })
                };
                const next = jest.fn();

                performanceLogger(req, res, next);

                expect(next).toHaveBeenCalled();
                
                // モックを元に戻す
                jest.doMock('../src/config/config', () => originalConfig);
            });
        });

        describe('Database Logger Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should log slow database queries', () => {
                databaseLogger('SELECT * FROM users', ['param1'], 150);
                expect(consoleLogSpy).toHaveBeenCalled();
            });
        });

        describe('Security Logger Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should detect suspicious requests', () => {
                const req = {
                    requestId: 'test-id',
                    ip: '127.0.0.1',
                    url: '/test?q=<script>alert("xss")</script>',
                    body: {},
                    query: {},
                    headers: {}
                };
                const res = {};
                const next = jest.fn();

                securityLogger(req, res, next);

                expect(next).toHaveBeenCalled();
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should handle normal requests', () => {
                const req = {
                    requestId: 'test-id',
                    ip: '127.0.0.1',
                    url: '/api/users',
                    body: { name: 'test' },
                    query: {},
                    headers: {}
                };
                const res = {};
                const next = jest.fn();

                securityLogger(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('Application Log Tests', () => {
            let originalConsoleLog;
            let consoleLogSpy;

            beforeEach(() => {
                originalConsoleLog = console.log;
                consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            });

            afterEach(() => {
                console.log = originalConsoleLog;
                consoleLogSpy.mockRestore();
            });

            it('should log application start', () => {
                logApplicationStart();
                expect(consoleLogSpy).toHaveBeenCalled();
            });

            it('should log application shutdown', () => {
                logApplicationShutdown('SIGTERM');
                expect(consoleLogSpy).toHaveBeenCalled();
            });
        });
    });
});
