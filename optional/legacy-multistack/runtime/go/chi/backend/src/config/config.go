package config

import (
	"os"
	"strconv"
)

// Config アプリケーション設定構造体
type Config struct {
	Port      string // サーバーポート
	DBHost    string // データベースホスト
	DBPort    string // データベースポート
	DBUser    string // データベースユーザー
	DBPass    string // データベースパスワード
	DBName    string // データベース名
	JWTSecret string // JWT秘密鍵
}

// LoadConfig 環境変数から設定を読み込み
func LoadConfig() *Config {
	return &Config{
		Port:      getEnv("PORT", "8080"),
		DBHost:    getEnv("DB_HOST", "localhost"),
		DBPort:    getEnv("DB_PORT", "5432"),
		DBUser:    getEnv("DB_USER", "sampleuser"),
		DBPass:    getEnv("DB_PASSWORD", "samplepass"),
		DBName:    getEnv("DB_NAME", "sampledb"),
		JWTSecret: getEnv("JWT_SECRET", "your_jwt_secret"),
	}
}

// getEnv 環境変数を取得し、デフォルト値を設定
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// GetPort ポート番号を数値で取得
func (c *Config) GetPort() int {
	port, err := strconv.Atoi(c.Port)
	if err != nil {
		return 8080
	}
	return port
}
