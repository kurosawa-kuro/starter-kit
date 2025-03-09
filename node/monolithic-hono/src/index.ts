import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as ejs from 'ejs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Honoアプリケーションを作成
const app = new Hono()

// EJSテンプレートのレンダリング関数
const renderEjs = async (template: string, data: object) => {
  const templatePath = join(__dirname, 'views', template)
  return await ejs.renderFile(templatePath, data)
}

// ルートハンドラ（テンプレートを描画）
app.get('/', async (c) => {
  const html = await renderEjs('index.ejs', {
    title: 'EJS Sample',
    name: 'Hono',
    currentTime: new Date().toLocaleString()
  })
  return c.html(html)
})

// サーバを起動
serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info: { port: number }) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
) 