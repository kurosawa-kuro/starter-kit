package handler

import (
	"backend/models"
	"backend/services"
	"backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HelloWorldHandler はhello-worldエンドポイントのハンドラー
type HelloWorldHandler struct {
	service *services.HelloWorldService
}

// NewHelloWorldHandler は新しいHelloWorldHandlerを作成します
func NewHelloWorldHandler(service *services.HelloWorldService) *HelloWorldHandler {
	return &HelloWorldHandler{service: service}
}

// GetHelloWorld godoc
// @Summary Hello Worldを取得
// @Description 「Hello, World!」メッセージを返します
// @Tags hello-world
// @Accept json
// @Produce json
// @Success 200 {object} models.HelloWorldResponse
// @Router /api/hello-world [get]
func (h *HelloWorldHandler) GetHelloWorld(c *gin.Context) {
	response := models.HelloWorldResponse{
		Message:   utils.DefaultHelloMessage,
		Timestamp: time.Now(),
		Version:   utils.APIVersion,
	}
	c.JSON(http.StatusOK, response)
}

// PostHelloWorld godoc
// @Summary JSONを受け取り、DBに保存して返す
// @Description リクエストボディのJSONを受け取り、DBに保存してそのまま返します
// @Tags hello-world
// @Accept json
// @Produce json
// @Param request body models.HelloWorldRequest true "リクエストボディ"
// @Success 200 {object} models.HelloWorldMessage
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/hello-world [post]
func (h *HelloWorldHandler) PostHelloWorld(c *gin.Context) {
	var request models.HelloWorldRequest
	
	if err := c.ShouldBindJSON(&request); err != nil {
		errorResponse := models.NewErrorResponse(utils.StatusError, "validation_error", utils.ErrValidationFailed)
		c.JSON(http.StatusBadRequest, errorResponse)
		return
	}

	// DBに保存
	message, err := h.service.CreateHelloWorldMessage(request.Name)
	if err != nil {
		errorResponse := models.NewErrorResponse(utils.StatusError, "database_error", utils.ErrDatabaseConnection)
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}

	c.JSON(http.StatusOK, message)
} 