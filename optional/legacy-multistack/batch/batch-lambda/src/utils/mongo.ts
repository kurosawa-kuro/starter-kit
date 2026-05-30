import { MongoClient, Db } from 'mongodb'
import { logger } from './logger'

// Lambda warm start 対応: グローバルスコープで接続を保持
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = 'starter'
const COLLECTION_NAME = 'batch_results'

export interface BatchResultDocument {
  batchId: string
  status: 'success' | 'error'
  message: string
  processedAt: string
  eventType: string
  resources?: string[]
  details?: Record<string, unknown>
  createdAt: Date
}

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    logger.debug('Using cached database connection')
    return cachedDb
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  logger.info('Creating new database connection')

  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  cachedClient = client
  cachedDb = client.db(DB_NAME)

  logger.info('Database connection established', { database: DB_NAME })

  return cachedDb
}

export async function saveBatchResult(result: Omit<BatchResultDocument, 'createdAt'>): Promise<void> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection<BatchResultDocument>(COLLECTION_NAME)

    const document: BatchResultDocument = {
      ...result,
      createdAt: new Date(),
    }

    await collection.insertOne(document)

    logger.info('Batch result saved to MongoDB', {
      batchId: result.batchId,
      collection: COLLECTION_NAME,
    })
  } catch (error) {
    logger.error('Failed to save batch result to MongoDB', {
      error: error instanceof Error ? error.message : 'Unknown error',
      batchId: result.batchId,
    })
    // MongoDB保存失敗はバッチ処理全体を失敗させない
    // 必要に応じてここで再スローする
  }
}

export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
    logger.info('Database connection closed')
  }
}
