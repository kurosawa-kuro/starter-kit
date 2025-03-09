import { PrismaClient } from '@prisma/client'

/**
 * グローバルでのPrismaClientインスタンスの型定義
 */
declare global {
  var prisma: PrismaClient | undefined
}

/**
 * PrismaClientのシングルトンインスタンスを提供します
 * 開発環境でのホットリロード時に複数のインスタンスが作成されることを防ぎます
 */
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// 開発環境でのみグローバル変数にPrismaClientを保存
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

/**
 * データベース操作時のエラーハンドリングのためのラッパー関数
 */
export async function withPrisma<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await operation(prisma)
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  } finally {
    // 必要に応じてここにクリーンアップ処理を追加
  }
}

// デフォルトエクスポートとしてPrismaClientインスタンスを提供
export default prisma 