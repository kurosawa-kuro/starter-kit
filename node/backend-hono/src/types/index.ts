import type { Context } from 'hono'

// APIレスポンスの基本型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{
    path: string
    message: string
  }>
}

// ページネーション用の型
export interface PaginationParams {
  page?: number
  limit?: number
}

// ソート用の型
export interface SortParams {
  sortBy?: string
  order?: 'asc' | 'desc'
}

// カスタムコンテキスト型
export interface CustomContext extends Context {
  user?: {
    id: number
    role: string
  }
}

// エラー型
export interface ApiError {
  code: string
  message: string
  status: number
} 