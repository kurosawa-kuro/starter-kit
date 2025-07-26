package utils

import (
	"testing"
)

// TestConstants 定数のテスト
func TestConstants(t *testing.T) {
	// アプリケーション情報のテスト
	if AppName != "Go + Chi Starter Project" {
		t.Errorf("Expected AppName to be 'Go + Chi Starter Project', got '%s'", AppName)
	}

	if AppVersion != "1.0.0" {
		t.Errorf("Expected AppVersion to be '1.0.0', got '%s'", AppVersion)
	}

	// デフォルト設定値のテスト
	if DefaultPort != "8080" {
		t.Errorf("Expected DefaultPort to be '8080', got '%s'", DefaultPort)
	}

	if DefaultHost != "localhost" {
		t.Errorf("Expected DefaultHost to be 'localhost', got '%s'", DefaultHost)
	}

	// データベース設定のテスト
	if DefaultDBHost != "localhost" {
		t.Errorf("Expected DefaultDBHost to be 'localhost', got '%s'", DefaultDBHost)
	}

	if DefaultDBPort != "5432" {
		t.Errorf("Expected DefaultDBPort to be '5432', got '%s'", DefaultDBPort)
	}

	if DefaultDBUser != "sampleuser" {
		t.Errorf("Expected DefaultDBUser to be 'sampleuser', got '%s'", DefaultDBUser)
	}

	if DefaultDBPassword != "samplepass" {
		t.Errorf("Expected DefaultDBPassword to be 'samplepass', got '%s'", DefaultDBPassword)
	}

	if DefaultDBName != "sampledb" {
		t.Errorf("Expected DefaultDBName to be 'sampledb', got '%s'", DefaultDBName)
	}

	// JWT設定のテスト
	if DefaultJWTSecret != "your_jwt_secret" {
		t.Errorf("Expected DefaultJWTSecret to be 'your_jwt_secret', got '%s'", DefaultJWTSecret)
	}

	// タイムアウト設定のテスト
	if DefaultTimeout != 30 {
		t.Errorf("Expected DefaultTimeout to be 30, got %d", DefaultTimeout)
	}

	// ログ設定のテスト
	if LogLevelInfo != "INFO" {
		t.Errorf("Expected LogLevelInfo to be 'INFO', got '%s'", LogLevelInfo)
	}

	if LogLevelWarn != "WARN" {
		t.Errorf("Expected LogLevelWarn to be 'WARN', got '%s'", LogLevelWarn)
	}

	if LogLevelError != "ERROR" {
		t.Errorf("Expected LogLevelError to be 'ERROR', got '%s'", LogLevelError)
	}

	// HTTP設定のテスト
	if MaxRequestSize != 1<<20 {
		t.Errorf("Expected MaxRequestSize to be %d, got %d", 1<<20, MaxRequestSize)
	}

	// エラーメッセージのテスト
	if ErrInvalidRequest != "Invalid request" {
		t.Errorf("Expected ErrInvalidRequest to be 'Invalid request', got '%s'", ErrInvalidRequest)
	}

	if ErrInternalServer != "Internal server error" {
		t.Errorf("Expected ErrInternalServer to be 'Internal server error', got '%s'", ErrInternalServer)
	}

	if ErrDatabaseConnection != "Database connection failed" {
		t.Errorf("Expected ErrDatabaseConnection to be 'Database connection failed', got '%s'", ErrDatabaseConnection)
	}

	if ErrNotFound != "Resource not found" {
		t.Errorf("Expected ErrNotFound to be 'Resource not found', got '%s'", ErrNotFound)
	}

	if ErrValidation != "Validation failed" {
		t.Errorf("Expected ErrValidation to be 'Validation failed', got '%s'", ErrValidation)
	}
}

// TestConstantsConsistency 定数の一貫性テスト
func TestConstantsConsistency(t *testing.T) {
	// バージョン番号の一貫性
	if AppVersion == "" {
		t.Error("AppVersion should not be empty")
	}

	// ポート番号の妥当性
	if DefaultPort == "" {
		t.Error("DefaultPort should not be empty")
	}

	// データベース設定の妥当性
	if DefaultDBHost == "" {
		t.Error("DefaultDBHost should not be empty")
	}

	if DefaultDBPort == "" {
		t.Error("DefaultDBPort should not be empty")
	}

	if DefaultDBUser == "" {
		t.Error("DefaultDBUser should not be empty")
	}

	if DefaultDBPassword == "" {
		t.Error("DefaultDBPassword should not be empty")
	}

	if DefaultDBName == "" {
		t.Error("DefaultDBName should not be empty")
	}

	// タイムアウト値の妥当性
	if DefaultTimeout <= 0 {
		t.Error("DefaultTimeout should be positive")
	}

	// 最大リクエストサイズの妥当性
	if MaxRequestSize <= 0 {
		t.Error("MaxRequestSize should be positive")
	}
} 