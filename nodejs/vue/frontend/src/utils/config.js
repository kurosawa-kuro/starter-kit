// 環境変数の検証
const validateEnvironment = () => {
  const requiredVars = []
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars)
  }
}

// デフォルト値の設定
const getDefaultApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/api'
  }
  return 'http://localhost:8080/api'
}

// 設定管理
export const config = {
  // API設定
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl(),
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  },
  
  // MSW設定
  msw: {
    enabled: import.meta.env.VITE_ENABLE_MSW === 'true',
    debug: import.meta.env.VITE_MSW_DEBUG === 'true',
  },
  
  // アプリケーション設定
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Vue Starter App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // 開発設定
  development: {
    enableLogging: import.meta.env.DEV,
    enableDebugTools: import.meta.env.VITE_ENABLE_DEBUG_TOOLS === 'true',
  },
}

// 後方互換性のためのエイリアス
export const apiBaseUrl = config.api.baseUrl
export const enableMocking = config.msw.enabled
export const apiTimeout = config.api.timeout

// 環境変数の検証を実行
validateEnvironment()

// デバッグ情報（開発環境のみ）
if (config.development.enableLogging) {
  console.log('🔧 Config loaded:', {
    api: config.api,
    msw: config.msw,
    app: config.app,
    environment: config.app.environment,
  })
} 