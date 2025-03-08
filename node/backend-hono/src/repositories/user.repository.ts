import { prisma } from '../database/client.js'
import type { User } from '../schemas/user.schema.js'

export class UserRepository {
  async findMany() {
    return await prisma.user.findMany()
  }

  async create(data: User) {
    return await prisma.user.create({ data })
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id }
    })
  }

  async update(id: number, data: Partial<User>) {
    return await prisma.user.update({
      where: { id },
      data
    })
  }

  async delete(id: number) {
    return await prisma.user.delete({
      where: { id }
    })
  }
} 