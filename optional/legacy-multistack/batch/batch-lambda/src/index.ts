import { randomUUID } from 'crypto'
import type {
  Handler,
  Context,
  ScheduledEvent,
  S3Event,
} from 'aws-lambda'
import { logger } from './utils/logger'
import { saveBatchResult, BatchResultDocument } from './utils/mongo'

// バッチ処理結果の型定義
interface BatchResult {
  batchId: string
  status: 'success' | 'error'
  message: string
  processedAt: string
  eventType: string
  resources?: string[]
  details?: Record<string, unknown>
}

// イベントタイプを判定
function detectEventType(event: unknown): string {
  if (!event || typeof event !== 'object') {
    return 'manual'
  }

  const e = event as Record<string, unknown>

  // EventBridge / CloudWatch Events
  if (e['detail-type'] && e.source) {
    return 'eventbridge'
  }

  // S3 Event
  if (e.Records && Array.isArray(e.Records)) {
    const firstRecord = e.Records[0] as Record<string, unknown> | undefined
    if (firstRecord?.eventSource === 'aws:s3') {
      return 's3'
    }
    if (firstRecord?.eventSource === 'aws:sqs') {
      return 'sqs'
    }
  }

  return 'manual'
}

// EventBridge イベント処理
function processEventBridge(event: ScheduledEvent): {
  details: Record<string, unknown>
  resources: string[]
} {
  return {
    details: {
      source: event.source,
      detailType: event['detail-type'],
      time: event.time,
      region: event.region,
      account: event.account,
      detail: event.detail,
    },
    resources: event.resources ?? [],
  }
}

// S3 イベント処理
function processS3Event(event: S3Event): Record<string, unknown> {
  const records = event.Records.map((record) => ({
    bucket: record.s3.bucket.name,
    key: record.s3.object.key,
    size: record.s3.object.size,
    eventName: record.eventName,
    eventTime: record.eventTime,
  }))
  return { records, totalRecords: records.length }
}

// メインのバッチ処理ロジック
async function processBatch(event: unknown, batchId: string): Promise<BatchResult> {
  const eventType = detectEventType(event)
  const processedAt = new Date().toISOString()

  logger.info('Starting batch processing', {
    batchId,
    eventType,
    processedAt,
  })

  let details: Record<string, unknown> = {}
  let resources: string[] | undefined

  switch (eventType) {
    case 'eventbridge': {
      const processed = processEventBridge(event as ScheduledEvent)
      details = processed.details
      resources = processed.resources
      break
    }
    case 's3':
      details = processS3Event(event as S3Event)
      break
    case 'sqs':
      details = { message: 'SQS event received' }
      break
    default:
      details = { event }
  }

  // ここにバッチ処理ロジックを追加
  logger.info('Processing batch job', { batchId })

  const result: BatchResult = {
    batchId,
    status: 'success',
    message: 'Hello World from Lambda Batch!',
    processedAt,
    eventType,
    ...(resources && resources.length > 0 && { resources }),
    details,
  }

  // MongoDB に保存（MONGODB_URI が設定されている場合のみ）
  if (process.env.MONGODB_URI) {
    await saveBatchResult(result as Omit<BatchResultDocument, 'createdAt'>)
  }

  return result
}

// Lambda ハンドラー
export const handler: Handler = async (
  event: unknown,
  context: Context
): Promise<BatchResult> => {
  const batchId = randomUUID()

  logger.info('Lambda invoked', {
    batchId,
    requestId: context.awsRequestId,
    functionName: context.functionName,
    remainingTime: context.getRemainingTimeInMillis(),
  })

  try {
    const result = await processBatch(event, batchId)

    logger.info('Batch processing completed', {
      batchId,
      status: result.status,
    })

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    logger.error('Batch processing failed', {
      batchId,
      error: errorMessage,
    })

    const errorResult: BatchResult = {
      batchId,
      status: 'error',
      message: errorMessage,
      processedAt: new Date().toISOString(),
      eventType: 'unknown',
    }

    // エラー結果も MongoDB に保存
    if (process.env.MONGODB_URI) {
      await saveBatchResult(errorResult as Omit<BatchResultDocument, 'createdAt'>)
    }

    return errorResult
  }
}
