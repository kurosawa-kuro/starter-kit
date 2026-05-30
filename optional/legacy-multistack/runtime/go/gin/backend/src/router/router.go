package router

import (
	"backend/config"
	"backend/handler"
	"backend/middleware"
	"backend/models"
	"backend/services"
	"backend/utils"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// SetupRouter はGinルーターを設定します
func SetupRouter(db *config.Database) *gin.Engine {
	r := gin.Default()

	// 基本的なミドルウェア
	r.Use(gin.Logger())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.ValidationErrorHandler())

	// サービスの初期化
	helloWorldService := services.NewHelloWorldService(db)

	// ハンドラーの初期化
	helloWorldHandler := handler.NewHelloWorldHandler(helloWorldService)
	healthHandler := handler.NewHealthHandler()

	// ルートエンドポイント
	r.GET("/", func(c *gin.Context) {
		response := models.BaseResponse{
			Status:    utils.StatusSuccess,
			Message:   "Welcome to Hello World API!",
			Timestamp: models.NewSuccessResponse("").Timestamp,
		}
		c.JSON(200, gin.H{
			"status":    response.Status,
			"message":   response.Message,
			"timestamp": response.Timestamp,
			"version":   utils.APIVersion,
			"endpoints": gin.H{
				"health":      "/api/health",
				"hello-world": "/api/hello-world",
				"swagger":     "/swagger/index.html",
			},
		})
	})

	// APIグループの作成
	api := r.Group("/api")
	{
		// ヘルスチェック
		api.GET("/health", healthHandler.GetHealth)

		// Hello World エンドポイント
		api.GET("/hello-world", helloWorldHandler.GetHelloWorld)
		api.POST("/hello-world", helloWorldHandler.PostHelloWorld)
	}

	// Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 404ハンドラー
	r.NoRoute(func(c *gin.Context) {
		errorResponse := models.NewErrorResponse(utils.StatusError, "not_found", utils.ErrNotFound)
		c.JSON(404, gin.H{
			"status":    errorResponse.Status,
			"error":     errorResponse.Error,
			"message":   errorResponse.Message,
			"timestamp": errorResponse.Timestamp,
			"suggestions": []string{
				"Try /api/health",
				"Try /api/hello-world",
				"Check /swagger/index.html for API documentation",
			},
		})
	})

	return r
} 