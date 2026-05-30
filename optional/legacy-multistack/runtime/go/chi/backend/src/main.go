package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend/config"
	_ "backend/docs" // Swagger docs
	"backend/handler"
	"backend/router"
)

// @title Go + Chi Starter Project API
// @version 1.0
// @description Go + Chi スタータープロジェクトのAPI仕様書
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /
// @schemes http https
func main() {
	// 設定読み込み
	cfg := config.LoadConfig()

	// データベース接続
	var db *sql.DB
	var err error

	dbConfig := config.NewDatabaseConfig(cfg)
	db, err = dbConfig.Connect()
	if err != nil {
		log.Printf("⚠️  Database connection failed: %v", err)
		log.Println("⚠️  Running without database...")
		db = nil
	}
	defer dbConfig.Close(db)

	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(db)
	helloWorldHandler := handler.NewHelloWorldHandler(db)

	// ルーター設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// サーバー設定
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.GetPort()),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// グレースフルシャットダウン用のチャネル
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	// サーバー起動
	go func() {
		log.Printf("🚀 Go + Chi Starter Project starting on port %d", cfg.GetPort())
		log.Printf("📖 API Documentation: http://localhost:%d/swagger/index.html", cfg.GetPort())
		log.Printf("🔗 Health Check: http://localhost:%d/api/health", cfg.GetPort())

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("❌ Failed to start server: %v", err)
		}
	}()

	// シグナル待機
	<-done
	log.Println("🛑 Shutting down server...")

	// グレースフルシャットダウン
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("❌ Server forced to shutdown: %v", err)
	}

	log.Println("✅ Server exited")
}
