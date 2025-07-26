/**
 * 統一レスポンス構造体
 * 成功・エラーレスポンスの標準化
 */

/**
 * 成功レスポンスクラス
 */
class BaseResponse {
    constructor(message, data = null, meta = null) {
        this.status = 'success';
        this.message = message;
        this.timestamp = new Date().toISOString();
        if (data) this.data = data;
        if (meta) this.meta = meta;
    }

    /**
     * JSONレスポンスを生成
     */
    toJSON() {
        const response = {
            status: this.status,
            message: this.message,
            timestamp: this.timestamp
        };
        
        if (this.data) {
            response.data = this.data;
        }
        
        if (this.meta) {
            response.meta = this.meta;
        }
        
        return response;
    }

    /**
     * メタデータを追加
     */
    addMeta(key, value) {
        if (!this.meta) {
            this.meta = {};
        }
        this.meta[key] = value;
        return this;
    }

    /**
     * ページネーション情報を追加
     */
    addPagination(page, limit, total, totalPages) {
        this.addMeta('pagination', {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            totalPages: parseInt(totalPages)
        });
        return this;
    }
}

/**
 * エラーレスポンスクラス
 */
class ErrorResponse {
    constructor(error, message, statusCode = 500, details = null) {
        this.status = 'error';
        this.error = error;
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.statusCode = statusCode;
        if (details) this.details = details;
    }

    /**
     * JSONレスポンスを生成
     */
    toJSON() {
        const response = {
            status: this.status,
            error: this.error,
            message: this.message,
            timestamp: this.timestamp
        };
        
        if (this.details) {
            response.details = this.details;
        }
        
        return response;
    }

    /**
     * エラー詳細を追加
     */
    addDetails(details) {
        this.details = details;
        return this;
    }

    /**
     * バリデーションエラー詳細を追加
     */
    addValidationErrors(errors) {
        this.details = {
            validationErrors: errors
        };
        return this;
    }
}

/**
 * レスポンスファクトリー
 */
class ResponseFactory {
    /**
     * 成功レスポンスを生成
     */
    static success(message, data = null, meta = null) {
        return new BaseResponse(message, data, meta);
    }

    /**
     * エラーレスポンスを生成
     */
    static error(error, message, statusCode = 500, details = null) {
        return new ErrorResponse(error, message, statusCode, details);
    }

    /**
     * バリデーションエラーレスポンスを生成
     */
    static validationError(message, details = null) {
        return new ErrorResponse('validation_error', message, 400, details);
    }

    /**
     * データベースエラーレスポンスを生成
     */
    static databaseError(message, details = null) {
        return new ErrorResponse('database_error', message, 500, details);
    }

    /**
     * 認証エラーレスポンスを生成
     */
    static authenticationError(message, details = null) {
        return new ErrorResponse('authentication_error', message, 401, details);
    }

    /**
     * 認可エラーレスポンスを生成
     */
    static authorizationError(message, details = null) {
        return new ErrorResponse('authorization_error', message, 403, details);
    }

    /**
     * リソース未発見エラーレスポンスを生成
     */
    static notFoundError(message, details = null) {
        return new ErrorResponse('not_found', message, 404, details);
    }

    /**
     * 内部サーバーエラーレスポンスを生成
     */
    static internalError(message, details = null) {
        return new ErrorResponse('internal_error', message, 500, details);
    }

    /**
     * レート制限エラーレスポンスを生成
     */
    static rateLimitError(message, details = null) {
        return new ErrorResponse('rate_limit_exceeded', message, 429, details);
    }

    /**
     * メソッド非許可エラーレスポンスを生成
     */
    static methodNotAllowedError(message, details = null) {
        return new ErrorResponse('method_not_allowed', message, 405, details);
    }

    /**
     * サービス利用不可エラーレスポンスを生成
     */
    static serviceUnavailableError(message, details = null) {
        return new ErrorResponse('service_unavailable', message, 503, details);
    }

    /**
     * ゲートウェイタイムアウトエラーレスポンスを生成
     */
    static gatewayTimeoutError(message, details = null) {
        return new ErrorResponse('gateway_timeout', message, 504, details);
    }

    /**
     * バリデーションエラー詳細を生成
     */
    static createValidationErrors(fieldErrors) {
        return {
            validationErrors: fieldErrors.map(error => ({
                field: error.field,
                message: error.message,
                value: error.value
            }))
        };
    }
}

/**
 * エラー種別の定数
 */
const ErrorTypes = {
    VALIDATION: 'validation_error',
    DATABASE: 'database_error',
    AUTHENTICATION: 'authentication_error',
    AUTHORIZATION: 'authorization_error',
    NOT_FOUND: 'not_found',
    INTERNAL: 'internal_error',
    RATE_LIMIT: 'rate_limit_exceeded',
    METHOD_NOT_ALLOWED: 'method_not_allowed',
    SERVICE_UNAVAILABLE: 'service_unavailable',
    GATEWAY_TIMEOUT: 'gateway_timeout'
};

/**
 * HTTPステータスコードの定数
 */
const StatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

module.exports = {
    BaseResponse,
    ErrorResponse,
    ResponseFactory,
    ErrorTypes,
    StatusCodes
}; 