import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createPinia, setActivePinia } from 'pinia'
import HelloWorldForm from '@/components/HelloWorld/HelloWorldForm.vue'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('HelloWorld Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('displays messages and allows form submission', async () => {
    const user = userEvent.setup()
    
    render(HelloWorldForm)

    // 初期メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 5000 })

    // フォームが表示されることを確認
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('creates a new message', async () => {
    const user = userEvent.setup()
    
    render(HelloWorldForm)

    // フォームに入力して送信
    const nameInput = screen.getByLabelText(/name/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    await user.type(nameInput, 'Test User')
    await user.click(submitButton)

    // 新しいメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    }, { timeout: 5000 })

    // フォームがクリアされていることを確認
    expect(nameInput).toHaveValue('')
  })

  // it('handles API errors', async () => {
  //   // エラーレスポンスをモック
  //   server.use(
  //     http.get('http://localhost:8080/api/hello-world', () => {
  //       return HttpResponse.json({
  //         status: 'error',
  //         message: 'API Error',
  //       }, { status: 500 })
  //     })
  //   )

  //   render(HelloWorldForm)

  //   // エラーメッセージが表示されることを確認
  //   await waitFor(() => {
  //     expect(screen.getByText(/error/i)).toBeInTheDocument()
  //   }, { timeout: 5000 })
  // })
}) 