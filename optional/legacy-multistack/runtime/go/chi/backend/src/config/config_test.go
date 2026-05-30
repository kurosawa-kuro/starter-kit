package config

import (
	"os"
	"testing"
)

// TestLoadConfig 設定読み込みのテスト
func TestLoadConfig(t *testing.T) {
	// テスト用の環境変数を設定
	os.Setenv("PORT", "9090")
	os.Setenv("DB_HOST", "test-host")
	os.Setenv("DB_PORT", "5433")
	os.Setenv("DB_USER", "test-user")
	os.Setenv("DB_PASSWORD", "test-pass")
	os.Setenv("DB_NAME", "test-db")
	os.Setenv("JWT_SECRET", "test-secret")

	// 設定を読み込み
	cfg := LoadConfig()

	// 設定値を確認
	if cfg.GetPort() != 9090 {
		t.Errorf("Expected port 9090, got %d", cfg.GetPort())
	}

	if cfg.DBHost != "test-host" {
		t.Errorf("Expected DBHost 'test-host', got '%s'", cfg.DBHost)
	}

	if cfg.DBPort != "5433" {
		t.Errorf("Expected DBPort '5433', got '%s'", cfg.DBPort)
	}

	if cfg.DBUser != "test-user" {
		t.Errorf("Expected DBUser 'test-user', got '%s'", cfg.DBUser)
	}

	if cfg.DBPass != "test-pass" {
		t.Errorf("Expected DBPass 'test-pass', got '%s'", cfg.DBPass)
	}

	if cfg.DBName != "test-db" {
		t.Errorf("Expected DBName 'test-db', got '%s'", cfg.DBName)
	}

	if cfg.JWTSecret != "test-secret" {
		t.Errorf("Expected JWTSecret 'test-secret', got '%s'", cfg.JWTSecret)
	}

	// 環境変数をクリーンアップ
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("DB_USER")
	os.Unsetenv("DB_PASSWORD")
	os.Unsetenv("DB_NAME")
	os.Unsetenv("JWT_SECRET")
}

// TestLoadConfigDefaults デフォルト値のテスト
func TestLoadConfigDefaults(t *testing.T) {
	// 環境変数をクリア
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("DB_USER")
	os.Unsetenv("DB_PASSWORD")
	os.Unsetenv("DB_NAME")
	os.Unsetenv("JWT_SECRET")

	// 設定を読み込み
	cfg := LoadConfig()

	// デフォルト値を確認
	if cfg.GetPort() != 8080 {
		t.Errorf("Expected port 8080, got %d", cfg.GetPort())
	}

	if cfg.DBHost != "localhost" {
		t.Errorf("Expected DBHost 'localhost', got '%s'", cfg.DBHost)
	}

	if cfg.DBPort != "5432" {
		t.Errorf("Expected DBPort '5432', got '%s'", cfg.DBPort)
	}

	if cfg.DBUser != "sampleuser" {
		t.Errorf("Expected DBUser 'sampleuser', got '%s'", cfg.DBUser)
	}

	if cfg.DBPass != "samplepass" {
		t.Errorf("Expected DBPass 'samplepass', got '%s'", cfg.DBPass)
	}

	if cfg.DBName != "sampledb" {
		t.Errorf("Expected DBName 'sampledb', got '%s'", cfg.DBName)
	}

	if cfg.JWTSecret != "your_jwt_secret" {
		t.Errorf("Expected JWTSecret 'your_jwt_secret', got '%s'", cfg.JWTSecret)
	}
}

// TestNewDatabaseConfig データベース設定のテスト
func TestNewDatabaseConfig(t *testing.T) {
	// テスト用の設定を作成
	cfg := &Config{
		Port:      "8080",
		DBHost:    "test-host",
		DBPort:    "5433",
		DBUser:    "test-user",
		DBPass:    "test-pass",
		DBName:    "test-db",
		JWTSecret: "test-secret",
	}

	// データベース設定を作成
	dbConfig := NewDatabaseConfig(cfg)

	// 設定値を確認
	if dbConfig.Host != "test-host" {
		t.Errorf("Expected Host 'test-host', got '%s'", dbConfig.Host)
	}

	if dbConfig.Port != "5433" {
		t.Errorf("Expected Port '5433', got '%s'", dbConfig.Port)
	}

	if dbConfig.User != "test-user" {
		t.Errorf("Expected User 'test-user', got '%s'", dbConfig.User)
	}

	if dbConfig.Password != "test-pass" {
		t.Errorf("Expected Password 'test-pass', got '%s'", dbConfig.Password)
	}

	if dbConfig.DBName != "test-db" {
		t.Errorf("Expected DBName 'test-db', got '%s'", dbConfig.DBName)
	}
}

// TestGetPort ポート取得のテスト
func TestGetPort(t *testing.T) {
	tests := []struct {
		name     string
		port     string
		expected int
	}{
		{
			name:     "Valid port",
			port:     "8080",
			expected: 8080,
		},
		{
			name:     "Empty port",
			port:     "",
			expected: 8080, // デフォルト値
		},
		{
			name:     "Invalid port",
			port:     "invalid",
			expected: 8080, // デフォルト値
		},
		{
			name:     "Zero port",
			port:     "0",
			expected: 0,
		},
		{
			name:     "High port",
			port:     "65535",
			expected: 65535,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := &Config{Port: tt.port}
			result := cfg.GetPort()

			if result != tt.expected {
				t.Errorf("Expected port %d, got %d", tt.expected, result)
			}
		})
	}
}

// TestConfigWithPartialEnvironment 部分的な環境変数のテスト
func TestConfigWithPartialEnvironment(t *testing.T) {
	// 一部の環境変数のみ設定
	os.Setenv("PORT", "9090")
	os.Setenv("DB_HOST", "test-host")
	// 他の環境変数は設定しない

	// 設定を読み込み
	cfg := LoadConfig()

	// 設定された値を確認
	if cfg.GetPort() != 9090 {
		t.Errorf("Expected port 9090, got %d", cfg.GetPort())
	}

	if cfg.DBHost != "test-host" {
		t.Errorf("Expected DBHost 'test-host', got '%s'", cfg.DBHost)
	}

	// デフォルト値が使用されることを確認
	if cfg.DBPort != "5432" {
		t.Errorf("Expected DBPort '5432', got '%s'", cfg.DBPort)
	}

	if cfg.DBUser != "sampleuser" {
		t.Errorf("Expected DBUser 'sampleuser', got '%s'", cfg.DBUser)
	}

	// 環境変数をクリーンアップ
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")
}

// TestDatabaseConfigWithNilConfig nil設定でのデータベース設定テスト
func TestDatabaseConfigWithNilConfig(t *testing.T) {
	// nil設定でデータベース設定を作成するとパニックすることを確認
	defer func() {
		if r := recover(); r == nil {
			t.Error("Expected panic for nil config")
		}
	}()
	
	NewDatabaseConfig(nil)
}

// TestConfigConsistency 設定の一貫性テスト
func TestConfigConsistency(t *testing.T) {
	// 設定を読み込み
	cfg := LoadConfig()

	// 設定がnilでないことを確認
	if cfg == nil {
		t.Error("Expected config to be not nil")
	}

	// 必須フィールドが空でないことを確認
	if cfg.DBHost == "" {
		t.Error("Expected DBHost to be not empty")
	}

	if cfg.DBPort == "" {
		t.Error("Expected DBPort to be not empty")
	}

	if cfg.DBUser == "" {
		t.Error("Expected DBUser to be not empty")
	}

	if cfg.DBPass == "" {
		t.Error("Expected DBPass to be not empty")
	}

	if cfg.DBName == "" {
		t.Error("Expected DBName to be not empty")
	}

	if cfg.JWTSecret == "" {
		t.Error("Expected JWTSecret to be not empty")
	}

	// ポート番号が妥当な範囲内であることを確認
	port := cfg.GetPort()
	if port < 0 || port > 65535 {
		t.Errorf("Expected port to be between 0 and 65535, got %d", port)
	}
} 