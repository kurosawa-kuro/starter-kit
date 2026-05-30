package main

import (
	"backend/config"
	"backend/router"
	"log"
	"os"

	_ "backend/docs" // Swagger docs

	"github.com/gin-gonic/gin"
)

// @title Hello World API
// @version 1.0
// @description Go + Gin スタータープロジェクトのAPI仕様書
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
	// 本番環境ではGinのリリースモードを使用
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 設定の読み込み
	cfg := config.LoadConfig()

	// データベース接続の初期化
	db, err := config.NewDatabase(cfg)
	if err != nil {
		log.Printf("⚠️  Database connection failed: %v", err)
		log.Println("📝 Running in mock mode without database")
		db = nil // データベースなしでモックモードで実行
	} else {
		defer func() {
			if err := db.Close(); err != nil {
				log.Printf("❌ Error closing database connection: %v", err)
			}
		}()
		log.Println("✅ Database connection established successfully")
	}

	// ルーターの設定
	r := router.SetupRouter(db)

	log.Printf("🚀 Hello World API starting on port %s", cfg.Port)
	log.Printf("📖 API Documentation: http://localhost%s/swagger/index.html", cfg.GetPort())
	log.Printf("🔗 Health Check: http://localhost%s/api/health", cfg.GetPort())

	if err := r.Run(cfg.GetPort()); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
