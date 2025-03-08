import type { Context, Next } from 'hono'
import { z } from 'zod'
import type { ApiResponse } from '../types'

export const errorHandler = async (err: Error, c: Context) => {
  console.error('エラーが発生しました:', err)

  if (err instanceof z.ZodError) {
    const response: ApiResponse<null> = {
      success: false,
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    }
    return c.json(response, 400)
  }

  const response: ApiResponse<null> = {
    success: false,
    message: '内部サーバーエラーが発生しました'
  }
  return c.json(response, 500)
}

export const logger = async (c: Context, next: Next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  const time = end - start
  console.log(`[${c.req.method}] ${c.req.url} - ${time}ms`)
} 