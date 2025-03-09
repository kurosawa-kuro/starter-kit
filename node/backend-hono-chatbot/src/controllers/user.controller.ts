import type { Context as HonoContext } from 'hono'
import { Hono } from 'hono'
import { UserService } from '../services/user.service.js'
import { userSchema } from '../schemas/user.schema.js'
import { createApiResponse } from '../utils/helpers.js'
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js'

export class UserController {
  private service: UserService
  public router: Hono

  constructor() {
    this.service = new UserService()
    this.router = new Hono()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.router.get('/', this.getUsers.bind(this))
    this.router.post('/', this.createUser.bind(this))
    this.router.get('/:id', this.getUserById.bind(this))
    this.router.put('/:id', this.updateUser.bind(this))
    this.router.delete('/:id', this.deleteUser.bind(this))
  }

  private async getUsers(c: HonoContext) {
    const users = await this.service.getAllUsers()
    return c.json(createApiResponse(true, users))
  }

  private async createUser(c: HonoContext) {
    try {
      const body = await c.req.json()
      const data = userSchema.parse(body)
      const user = await this.service.createUser(data)
      return c.json(createApiResponse(true, user), HTTP_STATUS.CREATED)
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createApiResponse(false, null, error.message), HTTP_STATUS.BAD_REQUEST)
      }
      throw error
    }
  }

  private async getUserById(c: HonoContext) {
    const id = Number(c.req.param('id'))
    const user = await this.service.getUserById(id)
    if (!user) {
      return c.json(
        createApiResponse(false, null, ERROR_MESSAGES.NOT_FOUND),
        HTTP_STATUS.NOT_FOUND
      )
    }
    return c.json(createApiResponse(true, user))
  }

  private async updateUser(c: HonoContext) {
    try {
      const id = Number(c.req.param('id'))
      const body = await c.req.json()
      const data = userSchema.partial().parse(body)
      const user = await this.service.updateUser(id, data)
      return c.json(createApiResponse(true, user))
    } catch (error) {
      if (error instanceof Error) {
        return c.json(
          createApiResponse(false, null, error.message),
          HTTP_STATUS.BAD_REQUEST
        )
      }
      throw error
    }
  }

  private async deleteUser(c: HonoContext) {
    const id = Number(c.req.param('id'))
    await this.service.deleteUser(id)
    return c.json(
      createApiResponse(true, null, 'ユーザーを削除しました')
    )
  }
} 