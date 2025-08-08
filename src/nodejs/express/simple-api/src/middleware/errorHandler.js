/**
 * エラーハンドリングミドルウェア
 * 統一されたエラーレスポンス処理
 */

const { ResponseFactory } = require('../models/response');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * エラーハンドリングミドルウェア
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    let errorResponse;
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

    // エラータイプに基づいてレスポンスを生成
    switch (err.type) {
        case 'validation_error':
            errorResponse = ResponseFactory.validationError(err.message);
            statusCode = HTTP_STATUS.BAD_REQUEST;
            break;
        case 'database_error':
            errorResponse = ResponseFactory.databaseError(err.message);
            statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            break;
        case 'authentication_error':
            errorResponse = ResponseFactory.authenticationError(err.message);
            statusCode = HTTP_STATUS.UNAUTHORIZED;
            break;
        case 'authorization_error':
            errorResponse = ResponseFactory.authorizationError(err.message);
            statusCode = HTTP_STATUS.FORBIDDEN;
            break;
        case 'not_found':
            errorResponse = ResponseFactory.notFoundError(err.message);
            statusCode = HTTP_STATUS.NOT_FOUND;
            break;
        default:
            errorResponse = ResponseFactory.internalError(
                process.env.NODE_ENV === 'production' 
                    ? 'Internal Server Error' 
                    : err.message
            );
            statusCode = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    }

    res.status(statusCode).json(errorResponse.toJSON());
};

/**
 * 404エラーハンドラー
 */
const notFoundHandler = (req, res) => {
    const errorResponse = ResponseFactory.notFoundError(`Route ${req.originalUrl} not found`);
    res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse.toJSON());
};

/**
 * カスタムエラークラス
 */
class AppError extends Error {
    constructor(message, type = 'internal_error', status = 500) {
        super(message);
        this.type = type;
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * バリデーションエラー
 */
class ValidationError extends AppError {
    constructor(message) {
        super(message, 'validation_error', 400);
    }
}

/**
 * データベースエラー
 */
class DatabaseError extends AppError {
    constructor(message) {
        super(message, 'database_error', 500);
    }
}

/**
 * 認証エラー
 */
class AuthenticationError extends AppError {
    constructor(message) {
        super(message, 'authentication_error', 401);
    }
}

/**
 * 認可エラー
 */
class AuthorizationError extends AppError {
    constructor(message) {
        super(message, 'authorization_error', 403);
    }
}

/**
 * リソース未発見エラー
 */
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 'not_found', 404);
    }
}

module.exports = {
    errorHandler,
    notFoundHandler,
    AppError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError
}; 