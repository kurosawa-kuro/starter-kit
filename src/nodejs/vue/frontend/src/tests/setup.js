import '@testing-library/jest-dom'
import { server } from '@/mocks/server'
import { resetMessages } from '@/mocks/handlers'
import { cleanup } from '@testing-library/vue'
import { afterAll, afterEach, beforeAll } from 'vitest'

// テスト環境でMSWを有効化
process.env.VITE_ENABLE_MSW = 'true'
process.env.NODE_ENV = 'test'
process.env.VITE_API_BASE_URL = '/api'

// グローバルエラーハンドラーを設定
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('MSW') ||
       args[0].includes('onUnhandledRequest') ||
       args[0].includes('Request failed with status code 500') ||
       args[0].includes('AxiosError') ||
       args[0].includes('Network Error') ||
       args[0].includes('Failed to execute `setupWorker`') ||
       args[0].includes('ERR_NETWORK') ||
       args[0].includes('ERR_BAD_RESPONSE') ||
       args[0].includes('Unhandled error during execution of mounted hook'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

// MSW サーバーの起動
beforeAll(async () => {
  server.listen({ 
    onUnhandledRequest: 'bypass' // 未処理のリクエストを無視
  })
})

// 各テスト後のクリーンアップ
afterEach(() => {
  server.resetHandlers()
  resetMessages() // メッセージ状態をリセット
  cleanup()
})

// 全テスト終了後のクリーンアップ
afterAll(async () => {
  await server.close()
  console.error = originalError
}) 