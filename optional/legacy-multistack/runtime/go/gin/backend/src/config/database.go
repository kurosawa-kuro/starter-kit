package config

import (
	"backend/utils"
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// Database はデータベース接続を管理する構造体
type Database struct {
	DB *sql.DB
}

// NewDatabase は新しいデータベース接続を作成します
func NewDatabase(cfg *Config) (*Database, error) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPass, cfg.DBName)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// 接続テスト（タイムアウト付き）
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(utils.DBPingTimeout)*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// 接続プール設定
	db.SetMaxOpenConns(utils.MaxOpenConns)
	db.SetMaxIdleConns(utils.MaxIdleConns)
	db.SetConnMaxLifetime(time.Duration(utils.ConnMaxLifetime) * time.Minute)

	log.Println("✅ Database connection established successfully")

	return &Database{DB: db}, nil
}

// Close はデータベース接続を閉じます
func (d *Database) Close() error {
	if d.DB != nil {
		return d.DB.Close()
	}
	return nil
}
