import { User } from '../schemas/user.schema'

// データベースモデルの型定義
declare global {
  namespace Database {
    type UserModel = User & {
      id: number
      createdAt: Date
      updatedAt?: Date
    }

    interface Transaction {
      commit(): Promise<void>
      rollback(): Promise<void>
    }

    interface QueryResult<T> {
      rows: T[]
      count: number
    }
  }
} 