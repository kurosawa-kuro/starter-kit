/**
 * アプリケーション設定
 * 環境変数ベースの設定管理
 */

const config = {
    // サーバー設定
    port: parseInt(process.env.PORT) || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.HOST || '0.0.0.0',
    
    // データベース設定
    dbPath: process.env.DB_PATH || './data/database.sqlite',
    dbMode: process.env.DB_MODE || 'sqlite',
    
    // JWT設定
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    
    // アプリケーション設定
    appName: 'Hello World API',
    appVersion: '1.0.0',
    appDescription: 'JavaScript + Express スタータープロジェクト - クリーンアーキテクチャ実装',
    
    // ログ設定
    logLevel: process.env.LOG_LEVEL || 'info',
    logFormat: process.env.LOG_FORMAT || 'json',
    
    // CORS設定
    corsOrigin: process.env.CORS_ORIGIN || '*',
    corsCredentials: process.env.CORS_CREDENTIALS === 'true',
    corsMethods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS',
    corsHeaders: process.env.CORS_HEADERS || 'Content-Type,Authorization',
    
    // レート制限設定
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // リクエスト数
    rateLimitMessage: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP',
    
    // セキュリティ設定
    helmetEnabled: process.env.HELMET_ENABLED !== 'false',
    trustProxy: process.env.TRUST_PROXY === 'true',
    requestSizeLimit: process.env.REQUEST_SIZE_LIMIT || '10mb',
    
    // API設定
    apiPrefix: process.env.API_PREFIX || '/api',
    apiVersion: process.env.API_VERSION || 'v1',
    
    // ヘルスチェック設定
    healthCheckPath: process.env.HEALTH_CHECK_PATH || '/api/health',
    healthCheckTimeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 5000,
    

    
    // 開発設定
    mockMode: process.env.MOCK_MODE === 'true',
    debugMode: process.env.DEBUG_MODE === 'true'
};

/**
 * 設定の検証
 */
function validateConfig() {
    const requiredFields = ['port', 'dbPath'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
    }
    
    // ポート番号の検証
    if (config.port < 1 || config.port > 65535) {
        throw new Error('Invalid port number. Must be between 1 and 65535');
    }
    
    return true;
}

/**
 * 環境別設定の取得
 */
function getEnvironmentConfig() {
    const envConfig = {
        development: {
            logLevel: 'debug',
            debugMode: true,
            mockMode: true
        },
        test: {
            logLevel: 'error',
            debugMode: false,
            mockMode: true
        },
        production: {
            logLevel: 'info',
            debugMode: false,
            mockMode: false,
            helmetEnabled: true,
            rateLimitEnabled: true
        }
    };
    
    return envConfig[config.nodeEnv] || envConfig.development;
}

// 環境別設定の適用
const envConfig = getEnvironmentConfig();
Object.assign(config, envConfig);

// 設定の検証
try {
    validateConfig();
} catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    process.exit(1);
}

module.exports = config; 