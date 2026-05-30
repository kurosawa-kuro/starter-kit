package handler

import (
	"backend/models"
	"backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler はヘルスチェックエンドポイントのハンドラー
type HealthHandler struct{}

// NewHealthHandler は新しいHealthHandlerを作成します
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// GetHealth godoc
// @Summary ヘルスチェック
// @Description アプリケーションの健康状態を確認します
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} models.HealthResponse
// @Router /api/health [get]
func (h *HealthHandler) GetHealth(c *gin.Context) {
	response := models.HealthResponse{
		Status:    utils.StatusOK,
		Message:   utils.DefaultHealthMessage,
		Timestamp: time.Now(),
	}
	c.JSON(http.StatusOK, response)
} 