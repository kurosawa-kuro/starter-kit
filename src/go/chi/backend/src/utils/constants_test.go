package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestConstants 定数のテスト
func TestConstants(t *testing.T) {
	// アプリケーション情報のテスト
	assert.Equal(t, "Go + Chi Starter Project", AppName)
	assert.Equal(t, "1.0.0", AppVersion)

	// デフォルト設定値のテスト
	assert.Equal(t, "8080", DefaultPort)
	assert.Equal(t, "localhost", DefaultHost)

	// データベース設定のテスト
	assert.Equal(t, "localhost", DefaultDBHost)
	assert.Equal(t, "5432", DefaultDBPort)
	assert.Equal(t, "sampleuser", DefaultDBUser)
	assert.Equal(t, "samplepass", DefaultDBPassword)
	assert.Equal(t, "sampledb", DefaultDBName)

	// JWT設定のテスト
	assert.Equal(t, "your_jwt_secret", DefaultJWTSecret)

	// タイムアウト設定のテスト
	assert.Equal(t, 30, DefaultTimeout)

	// ログ設定のテスト
	assert.Equal(t, "INFO", LogLevelInfo)
	assert.Equal(t, "WARN", LogLevelWarn)
	assert.Equal(t, "ERROR", LogLevelError)

	// HTTP設定のテスト
	assert.Equal(t, 1<<20, MaxRequestSize)

	// エラーメッセージのテスト
	assert.Equal(t, "Invalid request", ErrInvalidRequest)
	assert.Equal(t, "Internal server error", ErrInternalServer)
	assert.Equal(t, "Database connection failed", ErrDatabaseConnection)
	assert.Equal(t, "Resource not found", ErrNotFound)
	assert.Equal(t, "Validation failed", ErrValidation)
} 