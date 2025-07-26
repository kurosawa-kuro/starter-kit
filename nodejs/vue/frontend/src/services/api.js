import axios from 'axios'
import { config } from '@/utils/config'
import { HTTP_STATUS } from '@/utils/constants'

// ログレベル設定
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const currentLogLevel = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO

// ログユーティリティ
const logger = {
  debug: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(`🔧 [DEBUG] ${message}`, ...args)
    }
  },
  info: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.log(`ℹ️ [INFO] ${message}`, ...args)
    }
  },
  warn: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(`⚠️ [WARN] ${message}`, ...args)
    }
  },
  error: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(`❌ [ERROR] ${message}`, ...args)
    }
  },
}

// ベースURL設定
const getBaseURL = () => {
  if (config.msw.enabled && import.meta.env.DEV) {
    logger.info('Using MSW mode - setting baseURL to /api')
    return '/api'
  }
  return config.api.baseUrl
}

// 認証トークン管理
const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

// エラーハンドリング
const handleApiError = (error) => {
  const { response, request, message } = error
  
  if (response) {
    // サーバーからのレスポンスがある場合
    const { status, data } = response
    logger.error(`API Error ${status}:`, data?.message || message)
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        setAuthToken(null)
        // TODO: ログインページへのリダイレクト
        break
      case HTTP_STATUS.NOT_FOUND:
        logger.warn('Resource not found')
        break
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        logger.error('Internal server error')
        break
      default:
        logger.error(`Unexpected error: ${status}`)
    }
  } else if (request) {
    // リクエストは送信されたがレスポンスがない場合
    logger.error('Network error - no response received')
  } else {
    // リクエスト設定エラー
    logger.error('Request configuration error:', message)
  }
  
  return Promise.reject(error)
}

// Axiosインスタンスの作成
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    const { method, url, baseURL } = config
    const fullUrl = `${baseURL}${url}`
    
    logger.debug(`API Request: ${method?.toUpperCase()} ${url}`)
    logger.debug(`Full URL: ${fullUrl}`)
    logger.debug(`MSW Mode: ${import.meta.env.VITE_ENABLE_MSW === 'true'}`)
    
    // 認証トークンの追加
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      logger.debug('Auth token added to request')
    }
    
    return config
  },
  (error) => {
    logger.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    const { status, config: { url } } = response
    logger.debug(`API Response: ${status} ${url}`)
    
    // レスポンスデータの検証
    if (response.data && typeof response.data === 'object') {
      if (response.data.status === 'error') {
        logger.warn('API returned error status:', response.data.message)
      }
    }
    
    return response
  },
  handleApiError
)

// APIクライアントの設定情報をログ出力
logger.info('API Client configured:', {
  baseURL: getBaseURL(),
  timeout: config.api.timeout,
  enableMocking: config.msw.enabled,
  environment: import.meta.env.DEV ? 'development' : 'production',
}) 