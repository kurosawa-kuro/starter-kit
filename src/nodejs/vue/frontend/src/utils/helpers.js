import { APP_CONSTANTS, ERROR_CODES } from './constants'

// バリデーション関数
export const validators = {
  // 名前のバリデーション
  isValidName: (name) => {
    if (!name || typeof name !== 'string') return false
    const trimmedName = name.trim()
    return trimmedName.length > 0 && trimmedName.length <= APP_CONSTANTS.MAX_NAME_LENGTH
  },
  
  // メッセージのバリデーション
  isValidMessage: (message) => {
    if (!message || typeof message !== 'string') return false
    return message.length <= APP_CONSTANTS.MAX_MESSAGE_LENGTH
  },
  
  // IDのバリデーション
  isValidId: (id) => {
    const numId = parseInt(id)
    return !isNaN(numId) && numId > 0
  },
  
  // メールアドレスのバリデーション
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  // パスワードのバリデーション
  isValidPassword: (password) => {
    return password && password.length >= APP_CONSTANTS.MIN_PASSWORD_LENGTH
  },
}

// 文字列ユーティリティ
export const stringUtils = {
  // 文字列の切り詰め
  truncate: (str, maxLength = 50, suffix = '...') => {
    if (!str || str.length <= maxLength) return str
    return str.substring(0, maxLength - suffix.length) + suffix
  },
  
  // キャピタライズ
  capitalize: (str) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },
  
  // キャメルケースからケバブケース
  toKebabCase: (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
  },
  
  // スネークケースからキャメルケース
  toCamelCase: (str) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  },
}

// 日付ユーティリティ
export const dateUtils = {
  // ISO文字列から表示用フォーマット
  formatDate: (isoString, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!isoString) return ''
    
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },
  
  // 相対時間の表示
  getRelativeTime: (isoString) => {
    if (!isoString) return ''
    
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 1) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return dateUtils.formatDate(isoString, 'MM/DD/YYYY')
  },
}

// エラーハンドリングユーティリティ
export const errorUtils = {
  // エラーメッセージの取得
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error
    
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.message) {
      return error.message
    }
    
    return 'An unexpected error occurred'
  },
  
  // エラーコードの取得
  getErrorCode: (error) => {
    if (error?.response?.data?.error) {
      return error.response.data.error
    }
    
    if (error?.code) {
      return error.code
    }
    
    return ERROR_CODES.INTERNAL_ERROR
  },
  
  // エラーの分類
  categorizeError: (error) => {
    const code = errorUtils.getErrorCode(error)
    
    switch (code) {
      case ERROR_CODES.VALIDATION_ERROR:
        return 'validation'
      case ERROR_CODES.AUTHENTICATION_ERROR:
        return 'authentication'
      case ERROR_CODES.AUTHORIZATION_ERROR:
        return 'authorization'
      case ERROR_CODES.NOT_FOUND_ERROR:
        return 'not_found'
      case ERROR_CODES.NETWORK_ERROR:
        return 'network'
      case ERROR_CODES.TIMEOUT_ERROR:
        return 'timeout'
      default:
        return 'internal'
    }
  },
}

// ローカルストレージユーティリティ
export const storageUtils = {
  // 安全な取得
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error)
      return defaultValue
    }
  },
  
  // 安全な設定
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error)
      return false
    }
  },
  
  // 安全な削除
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error)
      return false
    }
  },
  
  // 全クリア
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage', error)
      return false
    }
  },
}

// デバウンス関数
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// スロットル関数
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
} 