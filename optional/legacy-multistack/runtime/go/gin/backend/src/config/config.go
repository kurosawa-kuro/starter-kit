package config

import (
	"backend/utils"
	"os"
	"strconv"
)

// Config はアプリケーションの設定を管理する構造体
type Config struct {
	Port      string
	DBHost    string
	DBPort    string
	DBUser    string
	DBPass    string
	DBName    string
	JWTSecret string
}

// LoadConfig は環境変数から設定を読み込みます
func LoadConfig() *Config {
	return &Config{
		Port:      getEnv("PORT", utils.DefaultPort),
		DBHost:    getEnv("DB_HOST", utils.DefaultDBHost),
		DBPort:    getEnv("DB_PORT", utils.DefaultDBPort),
		DBUser:    getEnv("DB_USER", utils.DefaultDBUser),
		DBPass:    getEnv("DB_PASSWORD", utils.DefaultDBPass),
		DBName:    getEnv("DB_NAME", utils.DefaultDBName),
		JWTSecret: getEnv("JWT_SECRET", utils.DefaultJWTSecret),
	}
}

// LoadTestConfig はテスト用の設定を読み込みます
func LoadTestConfig() *Config {
	config := LoadConfig()
	config.DBPort = getEnv("DB_PORT", "15434")         // テスト用ポート
	config.DBName = getEnv("DB_NAME", "sampledb_test") // テスト用DB
	config.JWTSecret = getEnv("JWT_SECRET", "your_test_jwt_secret")
	return config
}

// getEnv は環境変数を取得し、デフォルト値を返します
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// GetPort はポート番号を取得します
func (c *Config) GetPort() string {
	return ":" + c.Port
}

// GetDBPort はデータベースポート番号を数値で取得します
func (c *Config) GetDBPort() int {
	port, err := strconv.Atoi(c.DBPort)
	if err != nil {
		return 5432
	}
	return port
}
