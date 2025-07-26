package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
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
	assert.Equal(t, 9090, cfg.GetPort())
	assert.Equal(t, "test-host", cfg.DBHost)
	assert.Equal(t, "5433", cfg.DBPort)
	assert.Equal(t, "test-user", cfg.DBUser)
	assert.Equal(t, "test-pass", cfg.DBPass)
	assert.Equal(t, "test-db", cfg.DBName)
	assert.Equal(t, "test-secret", cfg.JWTSecret)

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
	assert.Equal(t, 8080, cfg.GetPort())
	assert.Equal(t, "localhost", cfg.DBHost)
	assert.Equal(t, "5432", cfg.DBPort)
	assert.Equal(t, "sampleuser", cfg.DBUser)
	assert.Equal(t, "samplepass", cfg.DBPass)
	assert.Equal(t, "sampledb", cfg.DBName)
	assert.Equal(t, "your_jwt_secret", cfg.JWTSecret)
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
	assert.Equal(t, "test-host", dbConfig.Host)
	assert.Equal(t, "5433", dbConfig.Port)
	assert.Equal(t, "test-user", dbConfig.User)
	assert.Equal(t, "test-pass", dbConfig.Password)
	assert.Equal(t, "test-db", dbConfig.DBName)
} 