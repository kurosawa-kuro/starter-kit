import type { PaginationParams, SortParams } from '../types/index.js'

/**
 * ページネーションパラメータを処理するヘルパー関数
 */
export const getPaginationParams = (params: Partial<PaginationParams>): Required<PaginationParams> => {
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.max(1, Math.min(100, Number(params.limit) || 10))
  return { page, limit }
}

/**
 * ソートパラメータを処理するヘルパー関数
 */
export const getSortParams = (params: Partial<SortParams>, allowedFields: string[]): Required<SortParams> => {
  const sortBy = allowedFields.includes(params.sortBy || '') ? params.sortBy : allowedFields[0]
  const order = params.order === 'desc' ? 'desc' : 'asc'
  return { sortBy: sortBy!, order }
}

/**
 * オブジェクトから未定義のプロパティを削除
 */
export const removeUndefined = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>
}

/**
 * 日付文字列をフォーマット
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * APIレスポンスを生成
 */
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  errors?: Array<{ path: string; message: string }>
) => {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(errors && { errors })
  }
} 