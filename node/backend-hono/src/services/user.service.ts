import { UserRepository } from '../repositories/user.repository.js'
import type { User } from '../schemas/user.schema.js'

export class UserService {
  private repository: UserRepository

  constructor() {
    this.repository = new UserRepository()
  }

  async getAllUsers() {
    return await this.repository.findMany()
  }

  async createUser(data: User) {
    return await this.repository.create(data)
  }

  async getUserById(id: number) {
    return await this.repository.findById(id)
  }

  async updateUser(id: number, data: Partial<User>) {
    return await this.repository.update(id, data)
  }

  async deleteUser(id: number) {
    return await this.repository.delete(id)
  }
} 