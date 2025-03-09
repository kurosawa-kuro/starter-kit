import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './routes/userRoutes.js'

const app = new Hono()

// ルートの登録
app.route('/', userRoutes)

// サーバーの起動
serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
) 