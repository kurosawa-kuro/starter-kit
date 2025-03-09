import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import app from '../app.js'
import { prisma } from './prisma.js'
import { PrismaClient } from './generated/client/index.js'

describe('User API', () => {
  beforeAll(async () => {
    // テストデータベースのマイグレーション
    const testPrisma = new PrismaClient()
    await testPrisma.$connect()
    await testPrisma.$executeRaw`DROP TABLE IF EXISTS User`
    await testPrisma.$executeRaw`CREATE TABLE User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT NOT NULL,
      password TEXT,
      avatar TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
    await testPrisma.$disconnect()
  })

  // 各テストの前にデータベースをクリーンアップ
  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('GET /users', () => {
    it('should return empty array when no users exist', async () => {
      const res = await app.request('/users')
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should return all users', async () => {
      // テストユーザーを作成
      await prisma.user.create({
        data: {
          name: '田中 太郎',
          email: 'taro@example.com'
        }
      })

      const res = await app.request('/users')
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('田中 太郎')
    })
  })

  describe('POST /users', () => {
    it('should create a new user with minimal data', async () => {
      const userData = { name: '山田 花子' }
      const res = await app.request('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await res.json()
      expect(res.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(userData.name)
    })

    it('should create a user with all fields', async () => {
      const userData = {
        name: '鈴木 一郎',
        email: 'ichiro@example.com',
        password: 'password123',
        avatar: 'https://example.com/avatar.jpg'
      }

      const res = await app.request('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await res.json()
      expect(res.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(userData.name)
      expect(data.data.email).toBe(userData.email)
    })

    it('should return validation error for invalid data', async () => {
      const userData = {
        name: '',  // 空の名前は無効
        email: 'invalid-email'  // 無効なメールアドレス
      }

      const res = await app.request('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await res.json()
      expect(res.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBeDefined()  // errorsの代わりにmessageを検証
    })
  })

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const user = await prisma.user.create({
        data: {
          name: '佐藤 健',
          email: 'ken@example.com'
        }
      })

      const res = await app.request(`/users/${user.id}`)
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('佐藤 健')
    })

    it('should return 404 for non-existent user', async () => {
      const res = await app.request('/users/999')
      const data = await res.json()
      expect(res.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('PUT /users/:id', () => {
    it('should update user data', async () => {
      const user = await prisma.user.create({
        data: {
          name: '高橋 誠',
          email: 'makoto@example.com'
        }
      })

      const updateData = {
        name: '高橋 修'
      }

      const res = await app.request(`/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updateData.name)
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const user = await prisma.user.create({
        data: {
          name: '中村 博',
          email: 'hiroshi@example.com'
        }
      })

      const res = await app.request(`/users/${user.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.success).toBe(true)

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      expect(deletedUser).toBeNull()
    })
  })
}) 