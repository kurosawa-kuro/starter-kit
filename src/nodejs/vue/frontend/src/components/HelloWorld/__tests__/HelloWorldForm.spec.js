import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createPinia, setActivePinia } from 'pinia'
import HelloWorldForm from '../HelloWorldForm.vue'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('HelloWorldForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('renders form and displays messages', async () => {
    render(HelloWorldForm)

    // フォーム要素の確認
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()

    // メッセージ一覧が表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('creates a new message when form is submitted', async () => {
    const user = userEvent.setup()
    render(HelloWorldForm)

    // フォームに入力
    const nameInput = screen.getByLabelText(/name/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    await user.type(nameInput, 'Test User')
    await user.click(submitButton)

    // 新しいメッセージが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    // フォームがクリアされていることを確認
    expect(nameInput).toHaveValue('')
  })
}) 