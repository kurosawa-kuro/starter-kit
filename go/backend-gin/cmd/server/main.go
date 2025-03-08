package main

import (
	"backend-gin/internal/controllers"
	"backend-gin/internal/repositories"
	"backend-gin/internal/services"
	"backend-gin/pkg/database"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// データベース接続
	db, err := database.InitDB("db/app.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 依存関係の初期化
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	// Ginルーターの設定
	r := gin.Default()

	// ルートハンドラー
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello Gin with Go 1.22!",
		})
	})

	// ユーザー関連のルート登録
	userController.RegisterRoutes(r)

	// サーバー起動
	r.Run(":8080")
}
