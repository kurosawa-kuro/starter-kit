// ページネーション関連
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const

// ユーザーロール
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  READ_ONLY_ADMIN: 'read-only-admin'
} as const

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

// エラーメッセージ
export const ERROR_MESSAGES = {
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセス権限がありません',
  NOT_FOUND: 'リソースが見つかりません',
  INTERNAL_SERVER_ERROR: '内部サーバーエラーが発生しました',
  VALIDATION_ERROR: 'バリデーションエラーが発生しました'
} as const

// 日付フォーマット
export const DATE_FORMAT = {
  DEFAULT: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss'
} as const 