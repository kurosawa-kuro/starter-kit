import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prisma } from './database/client.js'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/users', async (c) => {
  const users = await prisma.user.findMany()
  return c.json(users)
})

app.post('/users', async (c) => {
  const { name } = await c.req.json()
  const user = await prisma.user.create({ data: { name } })
  return c.json(user)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
