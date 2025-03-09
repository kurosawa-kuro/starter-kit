import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import * as ejs from 'ejs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const prisma = new PrismaClient()

// Honoアプリケーションを作成
const app = new Hono()

// EJSテンプレートのレンダリング関数
const renderEjs = async (template: string, data: object) => {
  const templatePath = join(__dirname, 'views', template)
  return await ejs.renderFile(templatePath, data)
}

// ユーザー一覧表示（List All）
app.get('/', async (c) => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const html = await renderEjs('index.ejs', {
    title: 'ユーザー管理',
    users: users
  })
  return c.html(html)
})

// ユーザー作成（Create One）
app.post('/users', async (c) => {
  try {
    const { name } = await c.req.json()
    
    if (!name || typeof name !== 'string') {
      return c.json({ error: 'Invalid name' }, 400)
    }

    const user = await prisma.user.create({
      data: { name }
    })

    return c.json(user, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// サーバを起動
serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
) 