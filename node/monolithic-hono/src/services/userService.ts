import { prisma } from '../config/database'
import type { User } from '../models/userModel'

export class UserService {
  static async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async create(name: string): Promise<User> {
    return await prisma.user.create({
      data: { name }
    })
  }
} 