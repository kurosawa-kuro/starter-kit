/**
 * ログ出力ミドルウェア
 * 構造化されたログ出力の実装
 */

const config = require('../config/config');

/**
 * ログレベル
 */
const LogLevel = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

/**
 * ログレベル名
 */
const LogLevelName = {
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.DEBUG]: 'DEBUG'
};

/**
 * 現在のログレベルを取得
 */
function getCurrentLogLevel() {
    const levelMap = {
        'error': LogLevel.ERROR,
        'warn': LogLevel.WARN,
        'info': LogLevel.INFO,
        'debug': LogLevel.DEBUG
    };
    
    return levelMap[config.logLevel] || LogLevel.INFO;
}

/**
 * ログ出力関数
 */
function log(level, message, data = null) {
    const currentLevel = getCurrentLogLevel();
    
    if (level > currentLevel) {
        return;
    }
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevelName[level],
        message,
        ...(data && { data })
    };
    
    if (config.logFormat === 'json') {
        console.log(JSON.stringify(logEntry));
    } else {
        const prefix = `[${logEntry.timestamp}] ${logEntry.level}`;
        console.log(`${prefix}: ${logEntry.message}`);
        if (data) {
            console.log(`${prefix}: Data:`, data);
        }
    }
}

/**
 * ログ関数
 */
const logger = {
    error: (message, data) => log(LogLevel.ERROR, message, data),
    warn: (message, data) => log(LogLevel.WARN, message, data),
    info: (message, data) => log(LogLevel.INFO, message, data),
    debug: (message, data) => log(LogLevel.DEBUG, message, data)
};

/**
 * リクエストログミドルウェア
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    // リクエスト情報をログ出力
    logger.info('Incoming request', {
        requestId,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        headers: config.debugMode ? req.headers : undefined
    });
    
    // レスポンス完了時のログ出力
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
        
        log(logLevel, 'Request completed', {
            requestId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length')
        });
    });
    
    // リクエストIDをリクエストオブジェクトに追加
    req.requestId = requestId;
    next();
}

/**
 * エラーログミドルウェア
 */
function errorLogger(err, req, res, next) {
    logger.error('Unhandled error', {
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        error: {
            message: err.message,
            stack: err.stack,
            name: err.name
        },
        headers: config.debugMode ? req.headers : undefined,
        body: config.debugMode ? req.body : undefined
    });
    
    next(err);
}

/**
 * リクエストID生成
 */
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * パフォーマンスログミドルウェア
 */
function performanceLogger(req, res, next) {
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
        const duration = Number(process.hrtime.bigint() - startTime) / 1000000; // ミリ秒
        
        if (duration > 1000) { // 1秒以上
            logger.warn('Slow request detected', {
                requestId: req.requestId,
                method: req.method,
                url: req.url,
                duration: `${duration.toFixed(2)}ms`
            });
        } else if (config.debugMode) {
            logger.debug('Request performance', {
                requestId: req.requestId,
                method: req.method,
                url: req.url,
                duration: `${duration.toFixed(2)}ms`
            });
        }
    });
    
    next();
}

/**
 * データベースログミドルウェア
 */
function databaseLogger(query, params, duration) {
    if (duration > 100) { // 100ms以上
        logger.warn('Slow database query detected', {
            query,
            params,
            duration: `${duration}ms`
        });
    } else if (config.debugMode) {
        logger.debug('Database query executed', {
            query,
            params,
            duration: `${duration}ms`
        });
    }
}

/**
 * セキュリティログミドルウェア
 */
function securityLogger(req, res, next) {
    // 不正なリクエストの検出
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /union\s+select/i,
        /drop\s+table/i
    ];
    
    const requestString = JSON.stringify({
        url: req.url,
        body: req.body,
        query: req.query,
        headers: req.headers
    });
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(requestString)) {
            logger.warn('Suspicious request detected', {
                requestId: req.requestId,
                ip: req.ip,
                pattern: pattern.source,
                url: req.url
            });
            break;
        }
    }
    
    next();
}

/**
 * アプリケーション起動ログ
 */
function logApplicationStart() {
    logger.info('Application starting', {
        version: config.appVersion,
        environment: config.nodeEnv,
        port: config.port,
        host: config.host,
        database: {
            host: config.dbHost,
            port: config.dbPort,
            name: config.dbName,
            ssl: config.dbSSL
        },
        features: {
            rateLimit: config.rateLimitEnabled,
            helmet: config.helmetEnabled,
            swagger: config.swaggerEnabled,
            mockMode: config.mockMode
        }
    });
}

/**
 * アプリケーション終了ログ
 */
function logApplicationShutdown(signal) {
    logger.info('Application shutting down', {
        signal,
        timestamp: new Date().toISOString()
    });
}

module.exports = {
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
}; 