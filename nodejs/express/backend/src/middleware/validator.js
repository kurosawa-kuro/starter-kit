/**
 * 入力検証ミドルウェア
 * リクエストデータの検証とサニタイゼーション
 */

const { ResponseFactory } = require('../models/response');

/**
 * 基本的な文字列検証
 */
function validateString(value, fieldName, options = {}) {
    const {
        required = true,
        minLength = 0,
        maxLength = 255,
        pattern = null,
        trim = true
    } = options;

    // 必須チェック
    if (required && (value === undefined || value === null || value === '')) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }

    // 非必須で値が空の場合はスキップ
    if (!required && (value === undefined || value === null || value === '')) {
        return { isValid: true, value: '' };
    }

    // 文字列型チェック
    if (typeof value !== 'string') {
        return {
            isValid: false,
            error: `${fieldName} must be a string`
        };
    }

    // トリム処理
    if (trim) {
        value = value.trim();
    }

    // 長さチェック
    if (value.length < minLength) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${minLength} characters long`
        };
    }

    if (value.length > maxLength) {
        return {
            isValid: false,
            error: `${fieldName} must be no more than ${maxLength} characters long`
        };
    }

    // パターンチェック
    if (pattern && !pattern.test(value)) {
        return {
            isValid: false,
            error: `${fieldName} format is invalid`
        };
    }

    return { isValid: true, value };
}

/**
 * 数値検証
 */
function validateNumber(value, fieldName, options = {}) {
    const {
        required = true,
        min = null,
        max = null,
        integer = false
    } = options;

    // 必須チェック
    if (required && (value === undefined || value === null || value === '')) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }

    // 非必須で値が空の場合はスキップ
    if (!required && (value === undefined || value === null || value === '')) {
        return { isValid: true, value: null };
    }

    // 数値変換
    const numValue = Number(value);

    // 数値型チェック
    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} must be a valid number`
        };
    }

    // 整数チェック
    if (integer && !Number.isInteger(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} must be an integer`
        };
    }

    // 範囲チェック
    if (min !== null && numValue < min) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${min}`
        };
    }

    if (max !== null && numValue > max) {
        return {
            isValid: false,
            error: `${fieldName} must be no more than ${max}`
        };
    }

    return { isValid: true, value: numValue };
}

/**
 * メールアドレス検証
 */
function validateEmail(value, fieldName, options = {}) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return validateString(value, fieldName, {
        ...options,
        pattern: emailPattern,
        maxLength: 254
    });
}

/**
 * URL検証
 */
function validateURL(value, fieldName, options = {}) {
    const urlPattern = /^https?:\/\/.+/;
    
    return validateString(value, fieldName, {
        ...options,
        pattern: urlPattern
    });
}

/**
 * 配列検証
 */
function validateArray(value, fieldName, options = {}) {
    const {
        required = true,
        minLength = 0,
        maxLength = null,
        itemValidator = null
    } = options;

    // 必須チェック
    if (required && (value === undefined || value === null)) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }

    // 非必須で値が空の場合はスキップ
    if (!required && (value === undefined || value === null)) {
        return { isValid: true, value: [] };
    }

    // 配列型チェック
    if (!Array.isArray(value)) {
        return {
            isValid: false,
            error: `${fieldName} must be an array`
        };
    }

    // 長さチェック
    if (value.length < minLength) {
        return {
            isValid: false,
            error: `${fieldName} must have at least ${minLength} items`
        };
    }

    if (maxLength !== null && value.length > maxLength) {
        return {
            isValid: false,
            error: `${fieldName} must have no more than ${maxLength} items`
        };
    }

    // アイテム検証
    if (itemValidator) {
        for (let i = 0; i < value.length; i++) {
            const itemResult = itemValidator(value[i], `${fieldName}[${i}]`);
            if (!itemResult.isValid) {
                return itemResult;
            }
        }
    }

    return { isValid: true, value };
}

/**
 * オブジェクト検証
 */
function validateObject(value, fieldName, options = {}) {
    const {
        required = true,
        schema = {},
        allowUnknown = false
    } = options;

    // 必須チェック
    if (required && (value === undefined || value === null)) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }

    // 非必須で値が空の場合はスキップ
    if (!required && (value === undefined || value === null)) {
        return { isValid: true, value: {} };
    }

    // オブジェクト型チェック
    if (typeof value !== 'object' || Array.isArray(value)) {
        return {
            isValid: false,
            error: `${fieldName} must be an object`
        };
    }

    const validatedValue = {};
    const errors = [];

    // スキーマに基づく検証
    for (const [key, validator] of Object.entries(schema)) {
        const result = validator(value[key], key);
        if (!result.isValid) {
            errors.push(result.error);
        } else {
            validatedValue[key] = result.value;
        }
    }

    // 未知のプロパティチェック
    if (!allowUnknown) {
        for (const key of Object.keys(value)) {
            if (!schema.hasOwnProperty(key)) {
                errors.push(`Unknown property: ${key}`);
            }
        }
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            error: errors.join(', ')
        };
    }

    return { isValid: true, value: validatedValue };
}

/**
 * 検証ミドルウェアファクトリー
 */
function createValidator(schema) {
    return function validatorMiddleware(req, res, next) {
        const errors = [];
        const validatedData = {};

        // リクエストボディの検証
        if (schema.body) {
            const bodyResult = validateObject(req.body, 'body', {
                schema: schema.body,
                allowUnknown: false
            });
            
            if (!bodyResult.isValid) {
                errors.push(bodyResult.error);
            } else {
                validatedData.body = bodyResult.value;
            }
        }

        // クエリパラメータの検証
        if (schema.query) {
            const queryResult = validateObject(req.query, 'query', {
                schema: schema.query,
                allowUnknown: true
            });
            
            if (!queryResult.isValid) {
                errors.push(queryResult.error);
            } else {
                validatedData.query = queryResult.value;
            }
        }

        // パラメータの検証
        if (schema.params) {
            const paramsResult = validateObject(req.params, 'params', {
                schema: schema.params,
                allowUnknown: true
            });
            
            if (!paramsResult.isValid) {
                errors.push(paramsResult.error);
            } else {
                validatedData.params = paramsResult.value;
            }
        }

        // エラーがある場合はレスポンスを返す
        if (errors.length > 0) {
            const errorResponse = ResponseFactory.validationError(
                'Validation failed',
                { errors }
            );
            return res.status(400).json(errorResponse.toJSON());
        }

        // 検証済みデータをリクエストオブジェクトに追加
        req.validated = validatedData;
        next();
    };
}

/**
 * 一般的な検証スキーマ
 */
const commonSchemas = {
    pagination: {
        page: (value) => validateNumber(value, 'page', { min: 1, integer: true }),
        limit: (value) => validateNumber(value, 'limit', { min: 1, max: 100, integer: true })
    },
    
    id: (value) => validateNumber(value, 'id', { min: 1, integer: true }),
    
    email: (value) => validateEmail(value, 'email'),
    
    name: (value) => validateString(value, 'name', { minLength: 1, maxLength: 100 }),
    
    message: (value) => validateString(value, 'message', { minLength: 1, maxLength: 1000 })
};

module.exports = {
    validateString,
    validateNumber,
    validateEmail,
    validateURL,
    validateArray,
    validateObject,
    createValidator,
    commonSchemas
}; 