import { prisma } from '../database/client.js'
import { beforeAll, afterAll, afterEach } from 'vitest'

beforeAll(async () => {
  // テスト用DBの準備
  try {
    await prisma.$connect()
    // テストデータベースの初期化
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
  } catch (error) {
    console.error('データベース接続エラー:', error)
    throw error
  }
})

afterAll(async () => {
  // テスト終了後のクリーンアップ
  await prisma.$disconnect()
})

afterEach(async () => {
  // 各テスト後にDBをクリーンアップ
  const tables = ['User']
  try {
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`)
      await prisma.$executeRawUnsafe(`DELETE FROM "sqlite_sequence" WHERE name = '${table}';`)
    }
  } catch (error) {
    console.error('テストクリーンアップエラー:', error)
    throw error
  }
}) 