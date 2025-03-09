import { Context } from 'hono'
import { UserService } from '../services/userService.js'
import { join } from 'path'
import { fileURLToPath } from 'url'
import * as ejs from 'ejs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const renderEjs = async (template: string, data: object) => {
  const templatePath = join(__dirname, '../views', template)
  return await ejs.renderFile(templatePath, data)
}

export class UserController {
  static async index(c: Context) {
    const users = await UserService.findAll()
    const html = await renderEjs('index.ejs', {
      title: 'ユーザー管理',
      users: users
    })
    return c.html(html)
  }

  static async create(c: Context) {
    try {
      const { name } = await c.req.json()
      
      if (!name || typeof name !== 'string') {
        return c.json({ error: 'Invalid name' }, 400)
      }

      const user = await UserService.create(name)
      return c.json(user, 201)
    } catch (error) {
      console.error('Error creating user:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
} 