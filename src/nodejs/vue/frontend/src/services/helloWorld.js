import { apiClient } from './api'
import { API_ENDPOINTS } from '@/utils/constants'

// バリデーション関数
const validateMessageData = (data) => {
  const errors = []
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required')
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// エラーハンドリング関数
const handleServiceError = (error, operation) => {
  console.error(`HelloWorld service ${operation} error:`, error)
  
  if (error.response?.data) {
    return Promise.reject(error.response.data)
  }
  
  return Promise.reject({
    status: 'error',
    message: `Failed to ${operation}`,
    error: 'service_error'
  })
}

export const helloWorldService = {
  // 全件取得
  async getAll() {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.HELLO_WORLD)
      return data
    } catch (error) {
      return handleServiceError(error, 'get all messages')
    }
  },

  // 単一取得
  async getById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Invalid ID provided')
      }
      
      const { data } = await apiClient.get(`${API_ENDPOINTS.HELLO_WORLD}/${id}`)
      return data
    } catch (error) {
      return handleServiceError(error, 'get message by ID')
    }
  },

  // 作成
  async create(request) {
    try {
      // バリデーション
      const validation = validateMessageData(request)
      if (!validation.isValid) {
        return Promise.reject({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors,
          error: 'validation_error'
        })
      }
      
      const { data } = await apiClient.post(API_ENDPOINTS.HELLO_WORLD, request)
      return data
    } catch (error) {
      return handleServiceError(error, 'create message')
    }
  },

  // 更新
  async update(id, request) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Invalid ID provided')
      }
      
      // バリデーション
      const validation = validateMessageData(request)
      if (!validation.isValid) {
        return Promise.reject({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors,
          error: 'validation_error'
        })
      }
      
      const { data } = await apiClient.put(`${API_ENDPOINTS.HELLO_WORLD}/${id}`, request)
      return data
    } catch (error) {
      return handleServiceError(error, 'update message')
    }
  },

  // 削除
  async delete(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Invalid ID provided')
      }
      
      const { data } = await apiClient.delete(`${API_ENDPOINTS.HELLO_WORLD}/${id}`)
      return data
    } catch (error) {
      return handleServiceError(error, 'delete message')
    }
  },
} 