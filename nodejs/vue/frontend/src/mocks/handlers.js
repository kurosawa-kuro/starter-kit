import { http, HttpResponse } from 'msw'

// ベースURL設定（MSWでは常に相対パスを使用）
const BASE_URL = '/api'

// レスポンス形式の統一
const createSuccessResponse = (data, message = 'Success') => ({
  status: 'success',
  message,
  timestamp: new Date().toISOString(),
  data,
})

const createErrorResponse = (error, message, status = 500) => ({
  status: 'error',
  error,
  message,
  timestamp: new Date().toISOString(),
})

// メッセージの状態管理（テスト用）
let messages = [
  {
    id: 1,
    name: 'John Doe',
    message: 'Hello, John Doe!',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    message: 'Hello, Jane Smith!',
    created_at: '2025-01-20T11:00:00Z',
    updated_at: '2025-01-20T11:00:00Z',
  },
]

// メッセージ状態をリセットする関数
export const resetMessages = () => {
  messages = [
    {
      id: 1,
      name: 'John Doe',
      message: 'Hello, John Doe!',
      created_at: '2025-01-20T10:00:00Z',
      updated_at: '2025-01-20T10:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      message: 'Hello, Jane Smith!',
      created_at: '2025-01-20T11:00:00Z',
      updated_at: '2025-01-20T11:00:00Z',
    },
  ]
}

// バリデーション関数
const validateMessageRequest = (body) => {
  if (!body.name || body.name.trim() === '') {
    return { isValid: false, error: 'Name is required' }
  }
  if (body.name.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' }
  }
  return { isValid: true }
}

// メッセージ関連のハンドラー
const messageHandlers = [
  // Hello World 一覧取得
  http.get(`${BASE_URL}/hello-world`, ({ request }) => {
    console.log('🎭 MSW intercepted GET request:', request.url)
    return HttpResponse.json(
      createSuccessResponse(messages, 'Messages retrieved successfully')
    )
  }),

  // Hello World 作成
  http.post(`${BASE_URL}/hello-world`, async ({ request }) => {
    console.log('🎭 MSW intercepted POST request:', request.url)
    try {
      const body = await request.json()
      
      // バリデーション
      const validation = validateMessageRequest(body)
      if (!validation.isValid) {
        return HttpResponse.json(
          createErrorResponse('validation_error', validation.error),
          { status: 400 }
        )
      }

      const newMessage = {
        id: Math.max(...messages.map(m => m.id), 0) + 1,
        name: body.name.trim(),
        message: `Hello, ${body.name.trim()}!`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      messages.push(newMessage)
      
      return HttpResponse.json(
        createSuccessResponse(newMessage, 'Message created successfully'),
        { status: 201 }
      )
    } catch (error) {
      console.error('MSW POST error:', error)
      return HttpResponse.json(
        createErrorResponse('internal_error', 'Failed to create message'),
        { status: 500 }
      )
    }
  }),

  // Hello World 削除
  http.delete(`${BASE_URL}/hello-world/:id`, ({ params, request }) => {
    console.log('🎭 MSW intercepted DELETE request:', request.url)
    try {
      const id = parseInt(params.id)
      
      if (isNaN(id)) {
        return HttpResponse.json(
          createErrorResponse('validation_error', 'Invalid ID format'),
          { status: 400 }
        )
      }

      const messageIndex = messages.findIndex(msg => msg.id === id)
      
      if (messageIndex === -1) {
        return HttpResponse.json(
          createErrorResponse('not_found', `Message ${id} not found`),
          { status: 404 }
        )
      }

      const deletedMessage = messages[messageIndex]
      messages.splice(messageIndex, 1)
      
      return HttpResponse.json(
        createSuccessResponse(deletedMessage, `Message ${id} deleted successfully`)
      )
    } catch (error) {
      console.error('MSW DELETE error:', error)
      return HttpResponse.json(
        createErrorResponse('internal_error', 'Failed to delete message'),
        { status: 500 }
      )
    }
  }),
]

// システム関連のハンドラー
const systemHandlers = [
  // ヘルスチェック
  http.get(`${BASE_URL}/health`, ({ request }) => {
    console.log('🎭 MSW intercepted health check:', request.url)
    return HttpResponse.json(
      createSuccessResponse(
        { 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        'API is healthy'
      )
    )
  }),
]

// フォールバックハンドラー（デバッグ用）
const fallbackHandler = http.all('*', ({ request }) => {
  console.log('🎭 MSW intercepted unhandled request:', request.method, request.url)
  
  // APIエンドポイント以外のリクエストは無視
  if (!request.url.includes('/api/')) {
    return
  }
  
  return HttpResponse.json(
    createErrorResponse('not_found', 'No handler found for this request'),
    { status: 404 }
  )
})

// 全ハンドラーをエクスポート
export const handlers = [
  ...messageHandlers,
  ...systemHandlers,
  fallbackHandler,
] 