/**
 * レート制限ミドルウェア
 * IPアドレスベースのレート制限
 */

const { ResponseFactory } = require('../models/response');
const config = require('../config/config');

// メモリベースのレート制限ストア
const rateLimitStore = new Map();

/**
 * レート制限ミドルウェア
 */
function rateLimiter(req, res, next) {
    // レート制限が無効の場合はスキップ
    if (!config.rateLimitEnabled) {
        return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `rate_limit:${clientIP}`;
    const now = Date.now();
    const windowMs = config.rateLimitWindowMs;
    const maxRequests = config.rateLimitMax;

    // クライアントデータの取得または初期化
    let clientData = rateLimitStore.get(key);
    
    if (!clientData) {
        clientData = {
            requests: [],
            resetTime: now + windowMs
        };
        rateLimitStore.set(key, clientData);
    }

    // ウィンドウがリセットされている場合
    if (now > clientData.resetTime) {
        clientData.requests = [];
        clientData.resetTime = now + windowMs;
    }

    // 現在のウィンドウ内のリクエスト数をカウント
    const currentRequests = clientData.requests.filter(
        timestamp => now - timestamp < windowMs
    );

    if (currentRequests.length >= maxRequests) {
        const resetTime = new Date(clientData.resetTime);
        const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);

        const errorResponse = ResponseFactory.rateLimitError(
            'Rate limit exceeded for this endpoint',
            {
                retryAfter,
                resetTime: resetTime.toISOString(),
                limit: maxRequests,
                windowMs
            }
        );

        res.set({
            'X-RateLimit-Limit': maxRequests,
            'X-RateLimit-Remaining': 0,
            'X-RateLimit-Reset': resetTime.toISOString(),
            'Retry-After': retryAfter
        });

        return res.status(429).json(errorResponse.toJSON());
    }

    currentRequests.push(now);
    clientData.requests = currentRequests;
    rateLimitStore.set(key, clientData);

    const remaining = maxRequests - currentRequests.length;
    res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
    });

    next();
}

/**
 * カスタムレート制限ミドルウェアファクトリー
 */
function createCustomRateLimiter(maxRequests, windowMs) {
    return function customRateLimiter(req, res, next) {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `custom_rate_limit:${clientIP}`;
        const now = Date.now();

        // クライアントデータの取得または初期化
        let clientData = rateLimitStore.get(key);
        
        if (!clientData) {
            clientData = {
                requests: [],
                resetTime: now + windowMs
            };
            rateLimitStore.set(key, clientData);
        }

        // ウィンドウがリセットされている場合
        if (now > clientData.resetTime) {
            clientData.requests = [];
            clientData.resetTime = now + windowMs;
        }

        // 現在のウィンドウ内のリクエスト数をカウント
        const currentRequests = clientData.requests.filter(
            timestamp => now - timestamp < windowMs
        );

        if (currentRequests.length >= maxRequests) {
            const resetTime = new Date(clientData.resetTime);
            const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);

            const errorResponse = ResponseFactory.rateLimitError(
                'Rate limit exceeded for this endpoint',
                {
                    retryAfter,
                    resetTime: resetTime.toISOString(),
                    limit: maxRequests,
                    windowMs
                }
            );

            res.set({
                'X-RateLimit-Limit': maxRequests,
                'X-RateLimit-Remaining': 0,
                'X-RateLimit-Reset': resetTime.toISOString(),
                'Retry-After': retryAfter
            });

            return res.status(429).json(errorResponse.toJSON());
        }

        currentRequests.push(now);
        clientData.requests = currentRequests;
        rateLimitStore.set(key, clientData);

        const remaining = maxRequests - currentRequests.length;
        res.set({
            'X-RateLimit-Limit': maxRequests,
            'X-RateLimit-Remaining': remaining,
            'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
        });

        next();
    };
}

/**
 * レート制限ストアのクリーンアップ
 */
function cleanupRateLimitStore() {
    const now = Date.now();
    const windowMs = config.rateLimitWindowMs;

    for (const [key, clientData] of rateLimitStore.entries()) {
        // 古いエントリを削除
        clientData.requests = clientData.requests.filter(
            timestamp => now - timestamp < windowMs
        );

        // リクエストが空で、リセット時間が過ぎている場合は削除
        if (clientData.requests.length === 0 && now > clientData.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// テスト環境以外でのみ定期的なクリーンアップを実行
if (process.env.NODE_ENV !== 'test') {
    setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
}

/**
 * レート制限統計の取得
 */
function getRateLimitStats() {
    const stats = {
        totalClients: rateLimitStore.size,
        totalRequests: 0,
        activeClients: 0
    };

    const now = Date.now();
    const windowMs = config.rateLimitWindowMs;

    for (const clientData of rateLimitStore.values()) {
        const activeRequests = clientData.requests.filter(
            timestamp => now - timestamp < windowMs
        );
        
        stats.totalRequests += clientData.requests.length;
        
        if (activeRequests.length > 0) {
            stats.activeClients++;
        }
    }

    return stats;
}

module.exports = {
    rateLimiter,
    createCustomRateLimiter,
    getRateLimitStats,
    cleanupRateLimitStore
}; 