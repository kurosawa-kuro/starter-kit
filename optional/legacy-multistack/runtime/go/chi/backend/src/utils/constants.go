package utils

// アプリケーション定数
const (
	// アプリケーション情報
	AppName    = "Go + Chi Starter Project"
	AppVersion = "1.0.0"

	// デフォルト設定値
	DefaultPort = "8080"
	DefaultHost = "localhost"

	// データベース設定
	DefaultDBHost     = "localhost"
	DefaultDBPort     = "5432"
	DefaultDBUser     = "sampleuser"
	DefaultDBPassword = "samplepass"
	DefaultDBName     = "sampledb"

	// JWT設定
	DefaultJWTSecret = "your_jwt_secret"

	// タイムアウト設定
	DefaultTimeout = 30

	// ログ設定
	LogLevelInfo  = "INFO"
	LogLevelWarn  = "WARN"
	LogLevelError = "ERROR"

	// HTTP設定
	MaxRequestSize = 1 << 20 // 1MB

	// エラーメッセージ
	ErrInvalidRequest     = "Invalid request"
	ErrInternalServer     = "Internal server error"
	ErrDatabaseConnection = "Database connection failed"
	ErrNotFound           = "Resource not found"
	ErrValidation         = "Validation failed"
)
