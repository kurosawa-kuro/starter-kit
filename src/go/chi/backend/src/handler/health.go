package handler

import (
	"database/sql"
	"net/http"
	"time"

	"backend/models"
)

// HealthHandler ヘルスチェックハンドラー構造体
type HealthHandler struct {
	db *sql.DB
}

// NewHealthHandler ヘルスチェックハンドラーを新規作成
func NewHealthHandler(db *sql.DB) *HealthHandler {
	return &HealthHandler{db: db}
}

// HealthCheckHandler ヘルスチェックエンドポイント
// @Summary ヘルスチェック
// @Description アプリケーションの状態を確認
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} models.BaseResponse
// @Router /api/health [get]
func (h *HealthHandler) HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	status := "healthy"
	message := "Application is running"

	// データベース接続チェック
	if h.db != nil {
		if err := h.db.Ping(); err != nil {
			status = "unhealthy"
			message = "Database connection failed"
		}
	}

	response := models.BaseResponse{
		Status:    status,
		Message:   message,
		Timestamp: time.Now(),
	}

	models.SendJSONResponse(w, http.StatusOK, response)
}
