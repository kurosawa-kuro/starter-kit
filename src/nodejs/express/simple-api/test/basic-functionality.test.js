/* eslint-disable max-lines */
/**
 * 基本機能総合テスト
 *  ├─ Constants / Utils
 *  ├─ Middleware（errorHandler / rateLimiter / validator）
 *  ├─ Config / Database
 *  ├─ Models（response）
 *  ├─ Controllers（health）
 *  └─ Logger
 *
 *  ❗ ファイル分割は禁止のため、本ファイル内でセクション毎に整理しています。
 *     セクション境界は `//// =====` で示し、共通ヘルパは最上部に配置。
 */

//// ========================================================================
////  共通インポート & ヘルパ
//// ========================================================================

const request = require('supertest');
const express = require('express');

// ── Middleware & Utils ────────────────────────────────────────────────────
const {
  errorHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} = require('../src/middleware/errorHandler');
const {
  rateLimiter,
  createCustomRateLimiter,
  getRateLimitStats,
  cleanupRateLimitStore,
} = require('../src/middleware/rateLimiter');
const {
  validateString,
  validateNumber,
  validateEmail,
  validateURL,
  validateArray,
  validateObject,
  createValidator,
  commonSchemas,
} = require('../src/middleware/validator');
const {
  HTTP_STATUS,
  ERROR_TYPES,
  LOG_LEVELS,
  API_CONSTANTS,
  APP_INFO,
} = require('../src/utils/constants');

// ── Models & Controllers ──────────────────────────────────────────────────
const { ResponseFactory, BaseResponse, ErrorResponse, ErrorTypes, StatusCodes } = require('../src/models/response');
const healthController = require('../src/controllers/health');

// ── Logger ────────────────────────────────────────────────────────────────
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
  LogLevelName,
} = require('../src/middleware/logger');

// ── Config & Database ─────────────────────────────────────────────────────
const config = require('../src/config/config');
const database = require('../src/config/database');

/**
 * Create a new Express app instance with basic routes for each test run.
 */
function createTestApp() {
  const app = express();
  app.use(express.json());

  // Happy‑path test route
  app.get('/test', (_req, res) => res.json({ message: 'Test endpoint' }));

  // Routes to trigger specific errors
  app.get('/error', (_req, _res, next) => next(new ValidationError('Test validation error')));
  app.get('/database-error', (_req, _res, next) => next(new DatabaseError('Test database error')));
  app.get('/auth-error', (_req, _res, next) => next(new AuthenticationError('Test authentication error')));
  app.get('/forbidden', (_req, _res, next) => next(new AuthorizationError('Test authorization error')));
  app.get('/not-found-error', (_req, _res, next) => next(new NotFoundError('Test not found error')));
  app.get('/internal-error', (_req, _res, next) => next(new Error('Test internal error')));

  // 404 & 全体エラーハンドラ
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Utility: create mock response object with jest spies.
 */
function createMockRes() {
  return {
    set: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    on: jest.fn(),
    get: jest.fn(),
    statusCode: undefined,
  };
}

//// ========================================================================
////  テスト本体
//// ========================================================================

describe('🧪 Basic Functionality Suite', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  //// --------------------------------------------------------------------
  //// 1. Constants & Utils
  //// --------------------------------------------------------------------
  describe('📦 Constants', () => {
    test('HTTP_STATUS mapping', () => {
      expect(HTTP_STATUS).toMatchObject({
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
      });
    });

    test('ERROR_TYPES mapping', () => {
      expect(ERROR_TYPES).toMatchObject({
        VALIDATION_ERROR: 'validation_error',
        DATABASE_ERROR: 'database_error',
        AUTHENTICATION_ERROR: 'authentication_error',
        AUTHORIZATION_ERROR: 'authorization_error',
        NOT_FOUND: 'not_found',
        INTERNAL_ERROR: 'internal_error',
      });
    });

    test('LOG_LEVELS mapping', () => {
      expect(LOG_LEVELS).toMatchObject({
        ERROR: 'error',
        WARN: 'warn',
        INFO: 'info',
        DEBUG: 'debug',
      });
    });

    test('API & APP constants', () => {
      expect(API_CONSTANTS).toMatchObject({ VERSION: 'v1', PREFIX: '/api', HEALTH_ENDPOINT: '/health' });
      expect(APP_INFO).toMatchObject({ NAME: 'Hello World API', VERSION: '1.0.0' });
    });
  });

  //// --------------------------------------------------------------------
  //// 2. Error Handling Middleware & Custom Error Classes
  //// --------------------------------------------------------------------
  describe('🚨 Error Handling', () => {
    const errorCases = [
      { path: '/error', status: 400, type: 'validation_error', message: 'Test validation error' },
      { path: '/database-error', status: 500, type: 'database_error', message: 'Test database error' },
      { path: '/auth-error', status: 401, type: 'authentication_error', message: 'Test authentication error' },
      { path: '/forbidden', status: 403, type: 'authorization_error', message: 'Test authorization error' },
      { path: '/not-found-error', status: 404, type: 'not_found', message: 'Test not found error' },
      { path: '/internal-error', status: 500, type: 'internal_error', message: 'Test internal error' },
      { path: '/non-existent', status: 404, type: 'not_found', message: 'Route /non-existent not found' },
    ];

    test.each(errorCases)('$path returns structured error response', async ({ path, status, type, message }) => {
      const res = await request(app).get(path).expect(status);
      expect(res.body).toEqual(expect.objectContaining({ status: 'error', message }));
      if (type) expect(res.body.error).toBe(type);
    });

    describe('Custom Error Class constructors', () => {
      const ctorMatrix = [
        [AppError, 'internal_error', 500],
        [ValidationError, 'validation_error', 400],
        [DatabaseError, 'database_error', 500],
        [AuthenticationError, 'authentication_error', 401],
        [AuthorizationError, 'authorization_error', 403],
        [NotFoundError, 'not_found', 404],
      ];

      test.each(ctorMatrix)('%p constructs properly', (Ctor, type, status) => {
        const err = new Ctor('msg');
        expect(err).toMatchObject({ message: 'msg', type, status });
        expect(err.name).toBe(Ctor.name);
      });
    });
  });

  //// --------------------------------------------------------------------
  //// 3. Rate Limiter
  //// --------------------------------------------------------------------
  describe('🚦 Rate Limiter', () => {
    test('allows requests under limit', () => {
      const limiter = createCustomRateLimiter(5, 1000);
      const req = { ip: '1.1.1.1' };
      const res = createMockRes();
      const next = jest.fn();
      Array.from({ length: 5 }).forEach(() => limiter(req, res, next));
      expect(next).toHaveBeenCalledTimes(5);
    });

    test('headers & 429 when exceeded', () => {
      const limiter = createCustomRateLimiter(1, 1000);
      const req = { ip: '2.2.2.2' };

      // first ok
      limiter(req, createMockRes(), jest.fn());

      // 2nd => 429
      const res = createMockRes();
      limiter(req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'X-RateLimit-Limit': 1,
          'X-RateLimit-Remaining': 0,
          'Retry-After': expect.any(Number),
        })
      );
    });

    test('rate limit stats shape', () => {
      const stats = getRateLimitStats();
      expect(stats).toMatchObject({
        totalClients: expect.any(Number),
        totalRequests: expect.any(Number),
        activeClients: expect.any(Number),
      });
    });

    test('cleanup function is callable', () => {
      expect(() => cleanupRateLimitStore()).not.toThrow();
    });

    test('main rateLimiter honours config toggle', () => {
      const original = config.rateLimitEnabled;

      // enabled
      config.rateLimitEnabled = true;
      rateLimiter({ ip: '3.3.3.3' }, createMockRes(), jest.fn());

      // disabled
      config.rateLimitEnabled = false;
      const res = createMockRes();
      const next = jest.fn();
      rateLimiter({ ip: '3.3.3.3' }, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.set).not.toHaveBeenCalled();

      config.rateLimitEnabled = original;
    });
  });

  //// --------------------------------------------------------------------
  //// 4. Validator
  //// --------------------------------------------------------------------
  describe('🛡️ Validator', () => {
    test('validateString basics', () => {
      expect(validateString('abc', 'x').isValid).toBe(true);
      expect(validateString(undefined, 'x').isValid).toBe(false);
    });

    test('validateString with non-required field returns empty string when value is empty', () => {
      expect(validateString(undefined, 'field', { required: false })).toEqual({ isValid: true, value: '' });
      expect(validateString(null, 'field', { required: false })).toEqual({ isValid: true, value: '' });
      expect(validateString('', 'field', { required: false })).toEqual({ isValid: true, value: '' });
    });

    test('validateString rejects non-string values', () => {
      expect(validateString(123, 'field').isValid).toBe(false);
      expect(validateString(123, 'field').error).toBe('field must be a string');
    });

    test('validateString enforces minLength', () => {
      const result = validateString('ab', 'field', { minLength: 3 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field must be at least 3 characters long');
    });

    test('validateString enforces maxLength', () => {
      const result = validateString('abcde', 'field', { maxLength: 3 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field must be no more than 3 characters long');
    });

    test('validateNumber integer enforcement', () => {
      expect(validateNumber('123', 'n', { integer: true }).value).toBe(123);
      expect(validateNumber('1.2', 'n', { integer: true }).isValid).toBe(false);
    });

    test('validateNumber with non-required field returns null when value is empty', () => {
      expect(validateNumber(undefined, 'field', { required: false })).toEqual({ isValid: true, value: null });
      expect(validateNumber(null, 'field', { required: false })).toEqual({ isValid: true, value: null });
      expect(validateNumber('', 'field', { required: false })).toEqual({ isValid: true, value: null });
    });

    test('validateNumber rejects invalid numbers', () => {
      expect(validateNumber('abc', 'field').isValid).toBe(false);
      expect(validateNumber('abc', 'field').error).toBe('field must be a valid number');
    });

    test('validateNumber required validation with empty string', () => {
      expect(validateNumber('', 'field').isValid).toBe(false);
      expect(validateNumber('', 'field').error).toBe('field is required');
    });

    test('validateNumber enforces minimum value', () => {
      const result = validateNumber(5, 'field', { min: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field must be at least 10');
    });

    test('validateNumber enforces maximum value', () => {
      const result = validateNumber(15, 'field', { max: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field must be no more than 10');
    });

    test('validateEmail format check', () => {
      expect(validateEmail('test@example.com', 'email').isValid).toBe(true);
      expect(validateEmail('invalid', 'email').isValid).toBe(false);
    });

    test('validateURL format check', () => {
      expect(validateURL('https://example.com', 'url').isValid).toBe(true);
      expect(validateURL('invalid', 'url').isValid).toBe(false);
    });

    test('validateArray basics', () => {
      expect(validateArray(['a', 'b'], 'arr').isValid).toBe(true);
      expect(validateArray('not-array', 'arr').isValid).toBe(false);
    });

    test('validateArray required validation', () => {
      expect(validateArray(undefined, 'field').isValid).toBe(false);
      expect(validateArray(undefined, 'field').error).toBe('field is required');
      expect(validateArray(null, 'field').isValid).toBe(false);
      expect(validateArray(null, 'field').error).toBe('field is required');
    });

    test('validateArray with non-required field returns empty array when value is empty', () => {
      expect(validateArray(undefined, 'field', { required: false })).toEqual({ isValid: true, value: [] });
      expect(validateArray(null, 'field', { required: false })).toEqual({ isValid: true, value: [] });
    });

    test('validateArray enforces minimum length', () => {
      const result = validateArray(['a'], 'field', { minLength: 2 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field must have at least 2 items');
    });

    test('validateArray enforces maximum length', () => {
      const result = validateArray(['a', 'b', 'c'], 'field', { maxLength: 2 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field must have no more than 2 items');
    });

    test('validateArray with itemValidator validates each item', () => {
      const itemValidator = (value, fieldName) => validateString(value, fieldName, { minLength: 2 });
      const result = validateArray(['ab', 'c'], 'field', { itemValidator });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('field[1] must be at least 2 characters long');
    });

    test('validateObject with schema', () => {
      const schema = { name: (v) => validateString(v, 'name') };
      expect(validateObject({ name: 'test' }, 'obj', { schema }).isValid).toBe(true);
    });

    test('validateObject required validation', () => {
      expect(validateObject(undefined, 'field').isValid).toBe(false);
      expect(validateObject(undefined, 'field').error).toBe('field is required');
      expect(validateObject(null, 'field').isValid).toBe(false);
      expect(validateObject(null, 'field').error).toBe('field is required');
    });

    test('validateObject with non-required field returns empty object when value is empty', () => {
      expect(validateObject(undefined, 'field', { required: false })).toEqual({ isValid: true, value: {} });
      expect(validateObject(null, 'field', { required: false })).toEqual({ isValid: true, value: {} });
    });

    test('validateObject rejects non-object values including arrays', () => {
      expect(validateObject('not-object', 'field').isValid).toBe(false);
      expect(validateObject('not-object', 'field').error).toBe('field must be an object');
      expect(validateObject(['array'], 'field').isValid).toBe(false);
      expect(validateObject(['array'], 'field').error).toBe('field must be an object');
    });

    test('validateObject with schema validation errors', () => {
      const schema = { 
        name: (v) => validateString(v, 'name', { minLength: 5 })
      };
      const result = validateObject({ name: 'ab' }, 'field', { schema });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('name must be at least 5 characters long');
    });

    test('validateObject rejects unknown properties when allowUnknown is false', () => {
      const schema = { name: (v) => validateString(v, 'name') };
      const result = validateObject({ name: 'test', extra: 'value' }, 'field', { schema, allowUnknown: false });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unknown property: extra');
    });

    test('validateObject with multiple errors combines them', () => {
      const schema = { 
        name: (v) => validateString(v, 'name', { minLength: 5 })
      };
      const result = validateObject({ name: 'ab', extra1: 'val1', extra2: 'val2' }, 'field', { schema, allowUnknown: false });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('name must be at least 5 characters long');
      expect(result.error).toContain('Unknown property: extra1');
      expect(result.error).toContain('Unknown property: extra2');
    });

    test('commonSchemas.pagination', () => {
      expect(commonSchemas.pagination.page('2').value).toBe(2);
      expect(commonSchemas.pagination.limit('10').value).toBe(10);
    });

    test('commonSchemas individual validators', () => {
      expect(commonSchemas.id('123').value).toBe(123);
      expect(commonSchemas.email('test@example.com').isValid).toBe(true);
      expect(commonSchemas.name('John Doe').isValid).toBe(true);
      expect(commonSchemas.message('Hello world').isValid).toBe(true);
    });

    test('middleware createValidator', async () => {
      const schema = {
        body: { name: (v) => validateString(v, 'name') },
      };
      const vApp = express();
      vApp.use(express.json());
      vApp.post('/v', createValidator(schema), (req, res) => res.json(req.validated));
      const res = await request(vApp).post('/v').send({ name: 'abc' }).expect(200);
      expect(res.body.body.name).toBe('abc');
    });

    test('middleware createValidator with body validation errors', async () => {
      const schema = {
        body: { name: (v) => validateString(v, 'name', { minLength: 5 }) },
      };
      const vApp = express();
      vApp.use(express.json());
      vApp.post('/v', createValidator(schema), (req, res) => res.json(req.validated));
      const res = await request(vApp).post('/v').send({ name: 'ab' }).expect(400);
      expect(res.body.status).toBe('error');
      expect(res.body.error).toBe('validation_error');
    });

    test('middleware createValidator with query validation', async () => {
      const schema = {
        query: { page: (v) => validateNumber(v, 'page', { min: 1, integer: true }) },
      };
      const vApp = express();
      vApp.use(express.json());
      vApp.get('/v', createValidator(schema), (req, res) => res.json(req.validated));
      
      // Test successful query validation
      const successRes = await request(vApp).get('/v?page=2').expect(200);
      expect(successRes.body.query.page).toBe(2);
      
      // Test query validation error
      const errorRes = await request(vApp).get('/v?page=0').expect(400);
      expect(errorRes.body.status).toBe('error');
    });

    test('middleware createValidator with params validation', async () => {
      const schema = {
        params: { id: (v) => validateNumber(v, 'id', { min: 1, integer: true }) },
      };
      const vApp = express();
      vApp.use(express.json());
      vApp.get('/v/:id', createValidator(schema), (req, res) => res.json(req.validated));
      
      // Test successful params validation
      const successRes = await request(vApp).get('/v/123').expect(200);
      expect(successRes.body.params.id).toBe(123);
      
      // Test params validation error
      const errorRes = await request(vApp).get('/v/0').expect(400);
      expect(errorRes.body.status).toBe('error');
    });
  });

  //// --------------------------------------------------------------------
  //// 5. Config
  //// --------------------------------------------------------------------
  describe('⚙️ Config Loader', () => {
    const ORIGINAL_ENV = { ...process.env };

    afterEach(() => {
      process.env = { ...ORIGINAL_ENV };
      jest.resetModules();
    });

    test('defaults in test env', () => {
      expect(config).toMatchObject({
        port: 8081,
        nodeEnv: 'test',
        host: '0.0.0.0',
        dbPath: './data/test-database.sqlite',
      });
    });

    test('env vars are respected (with prod overrides)', () => {
      Object.assign(process.env, {
        PORT: '3000',
        NODE_ENV: 'production',
        DB_PATH: '/custom/db.sqlite',
        LOG_LEVEL: 'debug',
        RATE_LIMIT_ENABLED: 'false',
        MOCK_MODE: 'true',
        DEBUG_MODE: 'true',
      });
      jest.resetModules();
      const cfg = require('../src/config/config');
      expect(cfg.port).toBe(3000);
      expect(cfg.nodeEnv).toBe('production');
      expect(cfg.dbPath).toBe('/custom/db.sqlite'); // env wins but prod may override others
      expect(cfg.logLevel).toBe('info');
      expect(cfg.rateLimitEnabled).toBe(true);
      expect(cfg.mockMode).toBe(false);
      expect(cfg.debugMode).toBe(false);
    });

    test('invalid port exits process', () => {
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      process.env.PORT = '70000';
      jest.resetModules();
      expect(() => require('../src/config/config')).toThrow('process.exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });
  });

  //// --------------------------------------------------------------------
  //// 6. Database
  //// --------------------------------------------------------------------
  describe('🗄️ SQLite Wrapper', () => {
    const ORIGINAL_ENV = { ...process.env };
    const fs = require('fs');

    beforeEach(() => {
      process.env.DB_PATH = './data/test-database.sqlite';
      jest.resetModules();
    });

    afterEach(async () => {
      process.env = { ...ORIGINAL_ENV };
      if (database.isConnected()) await database.disconnect();
    });

    test('connect / disconnect lifecycle', async () => {
      await expect(database.connect()).resolves.toBe(true);
      expect(database.isConnected()).toBe(true);
      await expect(database.disconnect()).resolves.toBeUndefined();
      expect(database.isConnected()).toBe(false);
    });

    test('query helpers', async () => {
      await database.connect();
      await expect(database.query('SELECT 1 as t')).resolves.toEqual({ rows: [{ t: 1 }], rowCount: 1 });
    });

    test('directory creation fails', async () => {
      // Mock fs.existsSync to return false and fs.mkdirSync to throw
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await database.connect();
      expect(result).toBe(false);
      expect(database.isConnected()).toBe(false);

      fs.existsSync.mockRestore();
      fs.mkdirSync.mockRestore();
    });

    test('database connection error in constructor callback', async () => {
      const sqlite3 = require('sqlite3');
      const originalDatabase = sqlite3.Database;
      
      // Mock SQLite Database constructor to call callback with error
      sqlite3.Database = function(_path, callback) {
        process.nextTick(() => callback(new Error('Connection failed')));
        return { close: jest.fn() };
      };

      const result = await database.connect();
      expect(result).toBe(false);
      expect(database.isConnected()).toBe(false);

      sqlite3.Database = originalDatabase;
    });

    test('table initialization error', async () => {
      const sqlite3 = require('sqlite3');
      const mockRun = jest.fn((_sql, callback) => {
        callback(new Error('Table creation error'));
      });
      const mockDb = { run: mockRun, close: jest.fn() };
      
      const originalDatabase = sqlite3.Database;
      sqlite3.Database = function(_path, callback) {
        process.nextTick(() => callback(null));
        return mockDb;
      };

      const result = await database.connect();
      expect(result).toBe(false);

      sqlite3.Database = originalDatabase;
    });

    test('disconnect with close error', async () => {
      await database.connect();
      
      // Mock the close method to trigger an error
      const mockClose = jest.fn((callback) => {
        callback(new Error('Close error'));
      });
      database.db.close = mockClose;

      await expect(database.disconnect()).resolves.toBeUndefined();
      expect(database.isConnected()).toBe(false);
    });

    test('disconnect when db is null', async () => {
      database.db = null;
      database.connected = false;
      
      await expect(database.disconnect()).resolves.toBeUndefined();
    });

    test('query when not connected', async () => {
      database.connected = false;
      database.db = null;
      
      await expect(database.query('SELECT 1')).rejects.toThrow('Database not connected');
    });

    test('query with database error', async () => {
      await database.connect();
      
      // Mock db.all to trigger error
      database.db.all = jest.fn((_sql, _params, callback) => {
        callback(new Error('Query error'));
      });
      
      await expect(database.query('SELECT 1')).rejects.toThrow('Query error');
    });

    test('queryOne when not connected', async () => {
      database.connected = false;
      database.db = null;
      
      await expect(database.queryOne('SELECT 1')).rejects.toThrow('Database not connected');
    });

    test('queryOne with database error', async () => {
      await database.connect();
      
      // Mock db.get to trigger error
      database.db.get = jest.fn((_sql, _params, callback) => {
        callback(new Error('QueryOne error'));
      });
      
      await expect(database.queryOne('SELECT 1')).rejects.toThrow('QueryOne error');
    });

    test('run when not connected', async () => {
      database.connected = false;
      database.db = null;
      
      await expect(database.run('INSERT INTO test VALUES (1)')).rejects.toThrow('Database not connected');
    });

    test('run with database error', async () => {
      await database.connect();
      
      // Mock db.run to trigger error
      database.db.run = jest.fn((_sql, _params, callback) => {
        callback(new Error('Run error'));
      });
      
      await expect(database.run('INSERT INTO test VALUES (1)')).rejects.toThrow('Run error');
    });
  });

  //// --------------------------------------------------------------------
  //// 7. Models: Response Factory & Classes
  //// --------------------------------------------------------------------
  describe('📄 Response Factory', () => {
    test('success response shape', () => {
      expect(ResponseFactory.success('ok', { id: 1 })).toEqual(
        expect.objectContaining({ status: 'success', message: 'ok', data: { id: 1 } })
      );
    });

    test('error helpers', () => {
      const resp = ResponseFactory.validationError('bad');
      expect(resp).toEqual(expect.objectContaining({ status: 'error', error: 'validation_error', statusCode: 400 }));
    });

    test('BaseResponse meta chaining', () => {
      const br = new BaseResponse('msg').addMeta('k', 'v').addPagination(1, 10, 100, 10);
      expect(br.meta).toMatchObject({ k: 'v', pagination: expect.any(Object) });
    });

    test('ErrorResponse details', () => {
      const er = new ErrorResponse('validation_error', 'bad', 400).addValidationErrors([
        { field: 'email', message: 'Invalid' },
      ]);
      expect(er.details.validationErrors).toHaveLength(1);
    });

    test('Enums expose expected values', () => {
      expect(ErrorTypes.INTERNAL).toBe('internal_error');
      expect(StatusCodes.OK).toBe(200);
    });
  });

  //// --------------------------------------------------------------------
  //// 8. Health Controller
  //// --------------------------------------------------------------------
  describe('❤️ Health Controller', () => {
    const healthApp = express();
    healthApp.use(express.json());
    healthApp.get('/health', healthController.checkHealth);
    healthApp.get('/app-info', healthController.getAppInfo);

    test('GET /health', async () => {
      const { body } = await request(healthApp).get('/health').expect(200);
      expect(body).toEqual(expect.objectContaining({ status: 'success', message: expect.any(String) }));
    });

    test('GET /app-info', async () => {
      const { body } = await request(healthApp).get('/app-info').expect(200);
      expect(body.data).toMatchObject({ name: APP_INFO.NAME, version: APP_INFO.VERSION });
    });
  });

  //// --------------------------------------------------------------------
  //// 9. Logger
  //// --------------------------------------------------------------------
  describe('📝 Logger', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    afterAll(() => consoleSpy.mockRestore());

    test('LogLevel enums', () => {
      expect(LogLevel.ERROR).toBe(0);
      expect(LogLevelName[0]).toBe('ERROR');
    });

    test('logger.info', () => {
      logger.info('msg');
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('requestLogger middleware', () => {
      const req = { method: 'GET', url: '/test', ip: '127.0.0.1', get: jest.fn() };
      const res = createMockRes();
      const next = jest.fn();
      requestLogger(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('errorLogger middleware', () => {
      const error = new Error('test');
      const req = { requestId: 'id', method: 'GET', url: '/test', headers: {}, body: {} };
      const res = {};
      const next = jest.fn();
      errorLogger(error, req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('performanceLogger middleware', () => {
      const req = { requestId: 'id', method: 'GET', url: '/test' };
      const res = createMockRes();
      const next = jest.fn();
      performanceLogger(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('databaseLogger slow query', () => {
      databaseLogger('SELECT * FROM test', [], 200);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('securityLogger suspicious request', () => {
      const req = { requestId: 'id', ip: '127.0.0.1', url: '/test?q=<script>', body: {}, query: {}, headers: {} };
      const res = {};
      const next = jest.fn();
      securityLogger(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('logApplicationStart', () => {
      logApplicationStart();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('logApplicationShutdown', () => {
      logApplicationShutdown('SIGTERM');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  //// --------------------------------------------------------------------
  //// 10. Application (app.js) Integration
  //// --------------------------------------------------------------------
  describe('🔧 Application Integration', () => {
    const mainApp = require('../src/app');

    test('app.js trust proxy condition is covered', () => {
      // Directly test the trust proxy setting to cover line 34
      const originalEnv = { ...process.env };
      
      // Force trust proxy to true 
      process.env.TRUST_PROXY = 'true';
      process.env.NODE_ENV = 'development'; // avoid production overrides
      
      // Clear require cache to force reload
      delete require.cache[require.resolve('../src/config/config')];  
      delete require.cache[require.resolve('../src/app')];
      
      const testConfig = require('../src/config/config');
      const testApp = require('../src/app');
      
      // Verify trust proxy is enabled and line 34 was executed
      expect(testConfig.trustProxy).toBe(true);
      expect(testApp.get('trust proxy')).toBe(1);
      
      // Restore environment
      Object.assign(process.env, originalEnv);
      delete require.cache[require.resolve('../src/config/config')];
      delete require.cache[require.resolve('../src/app')];
    });

    test('root endpoint uses health controller', async () => {
      const res = await request(mainApp).get('/').expect(200);
      expect(res.body).toEqual(expect.objectContaining({
        status: 'success',
        data: expect.objectContaining({
          name: expect.any(String),
          version: expect.any(String)
        })
      }));
    });
  });

  //// --------------------------------------------------------------------
  //// 11. HelloWorld Controller & Service
  //// --------------------------------------------------------------------
  describe('🌍 HelloWorld Controller & Service', () => {
    const { HelloWorldController } = require('../src/controllers/helloWorld');
    const helloWorldService = require('../src/services/helloWorldService');
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    afterAll(() => consoleErrorSpy.mockRestore());
    
    describe('Controller Error Handling', () => {
      test('getHelloWorld handles service errors', async () => {
        const controller = new HelloWorldController();
        const req = { query: { name: 'test' } };
        const res = createMockRes();
        
        // Mock service to throw error
        jest.spyOn(helloWorldService, 'getHelloWorldMessage').mockRejectedValueOnce(new Error('Service error'));
        
        await controller.getHelloWorld(req, res);
        
        expect(consoleErrorSpy).toHaveBeenCalledWith('Get Hello World error:', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          status: 'error',
          message: 'Failed to get Hello World message'
        }));
        
        helloWorldService.getHelloWorldMessage.mockRestore();
      });
      
      test('addHelloWorld handles service errors', async () => {
        const controller = new HelloWorldController();
        const req = { validated: { body: { name: 'test', message: 'hello' } } };
        const res = createMockRes();
        
        // Mock service to throw error
        jest.spyOn(helloWorldService, 'addHelloWorldMessage').mockRejectedValueOnce(new Error('Service error'));
        
        await controller.addHelloWorld(req, res);
        
        expect(consoleErrorSpy).toHaveBeenCalledWith('Add Hello World error:', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          status: 'error',
          message: 'Failed to add Hello World message'
        }));
        
        helloWorldService.addHelloWorldMessage.mockRestore();
      });
      
      test('listHelloWorld handles service errors', async () => {
        const controller = new HelloWorldController();
        const req = {};
        const res = createMockRes();
        
        // Mock service to throw error
        jest.spyOn(helloWorldService, 'listHelloWorldMessages').mockRejectedValueOnce(new Error('Service error'));
        
        await controller.listHelloWorld(req, res);
        
        expect(consoleErrorSpy).toHaveBeenCalledWith('List Hello World error:', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          status: 'error',
          message: 'Failed to get Hello World messages'
        }));
        
        helloWorldService.listHelloWorldMessages.mockRestore();
      });
    });
    
    describe('Service Mock Data Fallback', () => {
      beforeEach(() => {
        // Mock database as disconnected
        jest.spyOn(database, 'isConnected').mockReturnValue(false);
      });
      
      afterEach(() => {
        database.isConnected.mockRestore();
      });
      
      test('getHelloWorldMessage uses mock when DB disconnected', async () => {
        const result = await helloWorldService.getHelloWorldMessage('test');
        
        expect(database.isConnected).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
          name: 'test',
          message: expect.stringContaining('test')
        }));
      });
      
      test('addHelloWorldMessage uses mock when DB disconnected', async () => {
        const result = await helloWorldService.addHelloWorldMessage('test', 'custom message');
        
        expect(database.isConnected).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
          name: 'test',
          message: 'custom message'
        }));
      });
      
      test('listHelloWorldMessages uses mock when DB disconnected', async () => {
        const result = await helloWorldService.listHelloWorldMessages();
        
        expect(database.isConnected).toHaveBeenCalled();
        expect(Array.isArray(result)).toBe(true);
      });
    });
    
    describe('Service Error Handling with Mock Fallback', () => {
      beforeEach(() => {
        // Mock database as connected but queries fail
        jest.spyOn(database, 'isConnected').mockReturnValue(true);
        // Reset mock data to ensure clean state
        require('../src/utils/mock').resetMockData();
      });
      
      afterEach(() => {
        database.isConnected.mockRestore();
        if (database.query.mockRestore) database.query.mockRestore();
        if (database.run.mockRestore) database.run.mockRestore();
      });
      
      test('getHelloWorldMessage falls back to mock on database error', async () => {
        jest.spyOn(database, 'query').mockRejectedValueOnce(new Error('DB error'));
        
        const result = await helloWorldService.getHelloWorldMessage('test');
        
        expect(result).toEqual(expect.objectContaining({
          name: 'test',
          message: expect.any(String)
        }));
      });
      
      test('addHelloWorldMessage falls back to mock on database error', async () => {
        jest.spyOn(database, 'run').mockRejectedValueOnce(new Error('DB error'));
        
        const result = await helloWorldService.addHelloWorldMessage('test', 'custom');
        
        expect(result).toEqual(expect.objectContaining({
          name: 'test',
          message: 'custom'
        }));
      });
      
      test('listHelloWorldMessages falls back to mock on database error', async () => {
        jest.spyOn(database, 'query').mockRejectedValueOnce(new Error('DB error'));
        
        const result = await helloWorldService.listHelloWorldMessages();
        
        expect(Array.isArray(result)).toBe(true);
      });
    });
    
    describe('Service Database Initialization', () => {
      test('initializeDatabase when DB connected', async () => {
        jest.spyOn(database, 'isConnected').mockReturnValue(true);
        
        await helloWorldService.initializeDatabase();
        
        expect(database.isConnected).toHaveBeenCalled();
        database.isConnected.mockRestore();
      });
      
      test('initializeDatabase when DB not connected', async () => {
        jest.spyOn(database, 'isConnected').mockReturnValue(false);
        
        await helloWorldService.initializeDatabase();
        
        expect(database.isConnected).toHaveBeenCalled();
        database.isConnected.mockRestore();
      });
      
      test('initializeDatabase handles errors', async () => {
        jest.spyOn(database, 'isConnected').mockImplementation(() => {
          throw new Error('DB initialization error');
        });
        
        await helloWorldService.initializeDatabase();
        
        expect(database.isConnected).toHaveBeenCalled();
        database.isConnected.mockRestore();
      });
    });
  });
});