import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHelloWorldStore } from '../helloWorld'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('HelloWorld Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('fetches messages from API', async () => {
    const store = useHelloWorldStore()
    
    expect(store.messages).toHaveLength(0)
    expect(store.loading).toBe(false)

    await store.fetchMessages()

    expect(store.messages).toHaveLength(2)
    expect(store.messages[0].name).toBe('John Doe')
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  // it('handles API errors gracefully', async () => {
  //   server.use(
  //     http.get('http://localhost:8080/api/hello-world', () => {
  //       return HttpResponse.json({
  //         status: 'error',
  //         message: 'Database connection failed',
  //       }, { status: 500 })
  //     })
  //   )

  //   const store = useHelloWorldStore()

  //   await expect(store.fetchMessages()).rejects.toThrow()
    
  //   expect(store.messages).toHaveLength(0)
  //   expect(store.error).toBe('Request failed with status code 500')
  //   expect(store.loading).toBe(false)
  // })

  it('creates new message', async () => {
    const store = useHelloWorldStore()
    
    const newMessage = await store.createMessage('New User')

    expect(newMessage).toBeDefined()
    expect(newMessage?.name).toBe('New User')
    expect(store.messages).toContainEqual(newMessage)
  })

  it('deletes message', async () => {
    const store = useHelloWorldStore()
    
    // まずメッセージを取得
    await store.fetchMessages()
    const initialCount = store.messages.length

    // メッセージを削除
    await store.deleteMessage(1)

    expect(store.messages).toHaveLength(initialCount - 1)
    expect(store.messages.find(m => m.id === 1)).toBeUndefined()
  })

  it('clears error when clearError is called', async () => {
    const store = useHelloWorldStore()
    
    // エラーを発生させる
    server.use(
      http.get('http://localhost:8080/api/hello-world', () => {
        return HttpResponse.json({
          status: 'error',
          message: 'Test error',
        }, { status: 500 })
      })
    )

    try {
      await store.fetchMessages()
    } catch (error) {
      // エラーが設定されることを確認
      expect(store.error).toBeTruthy()
      
      // エラーをクリア
      store.clearError()
      expect(store.error).toBeNull()
    }
  })
}) 