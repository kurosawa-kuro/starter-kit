package config

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// DatabaseConfig データベース設定構造体
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// NewDatabaseConfig データベース設定を新規作成
func NewDatabaseConfig(config *Config) *DatabaseConfig {
	return &DatabaseConfig{
		Host:     config.DBHost,
		Port:     config.DBPort,
		User:     config.DBUser,
		Password: config.DBPass,
		DBName:   config.DBName,
		SSLMode:  "disable", // 開発環境ではSSL無効
	}
}

// GetConnectionString データベース接続文字列を取得
func (dc *DatabaseConfig) GetConnectionString() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dc.Host, dc.Port, dc.User, dc.Password, dc.DBName, dc.SSLMode)
}

// Connect データベースに接続
func (dc *DatabaseConfig) Connect() (*sql.DB, error) {
	db, err := sql.Open("postgres", dc.GetConnectionString())
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// 接続プール設定
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// 接続テスト
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("✅ Database connected successfully")
	return db, nil
}

// Close データベース接続を閉じる
func (dc *DatabaseConfig) Close(db *sql.DB) {
	if db != nil {
		if err := db.Close(); err != nil {
			log.Printf("❌ Error closing database: %v", err)
		} else {
			log.Println("✅ Database connection closed")
		}
	}
}
