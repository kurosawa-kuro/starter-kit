package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"backend/models"
	"backend/services"

	"github.com/go-chi/chi/v5"
)

// HelloWorldHandler Hello Worldハンドラー構造体
type HelloWorldHandler struct {
	service *services.HelloWorldService
}

// NewHelloWorldHandler Hello Worldハンドラーを新規作成
func NewHelloWorldHandler(db *sql.DB) *HelloWorldHandler {
	return &HelloWorldHandler{
		service: services.NewHelloWorldService(db),
	}
}

// RootHandler ルートエンドポイント
// @Summary ルートエンドポイント
// @Description アプリケーション情報を取得
// @Tags root
// @Accept json
// @Produce json
// @Success 200 {object} models.BaseResponse
// @Router / [get]
func (h *HelloWorldHandler) RootHandler(w http.ResponseWriter, r *http.Request) {
	response := models.BaseResponse{
		Status:    "success",
		Message:   "Go + Chi Starter Project API",
		Timestamp: time.Now(),
	}

	models.SendJSONResponse(w, http.StatusOK, response)
}

// GetHelloWorldHandler Hello Worldメッセージ取得
// @Summary Hello World取得
// @Description Hello Worldメッセージを取得
// @Tags hello-world
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=models.HelloWorldResponse}
// @Router /api/hello-world [get]
func (h *HelloWorldHandler) GetHelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	response := h.service.GetHelloWorld()
	models.SendSuccessResponse(w, "Hello World message retrieved successfully", response)
}

// CreateHelloWorldHandler Hello Worldメッセージ作成
// @Summary Hello World作成
// @Description Hello Worldメッセージを作成
// @Tags hello-world
// @Accept json
// @Produce json
// @Param request body models.HelloWorldRequest true "Hello World Request"
// @Success 201 {object} models.SuccessResponse{data=models.HelloWorldMessage}
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/hello-world [post]
func (h *HelloWorldHandler) CreateHelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	var request models.HelloWorldRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		models.SendValidationError(w, "Invalid request body")
		return
	}

	message, err := h.service.CreateHelloWorld(&request)
	if err != nil {
		if _, ok := err.(*models.ValidationError); ok {
			models.SendValidationError(w, err.Error())
			return
		}
		models.SendDatabaseError(w, "Failed to create hello world message")
		return
	}

	models.SendJSONResponse(w, http.StatusCreated, models.NewSuccessResponse("Hello World message created successfully", message))
}

// GetHelloWorldMessagesHandler 全てのHello Worldメッセージ取得
// @Summary Hello Worldメッセージ一覧取得
// @Description 全てのHello Worldメッセージを取得
// @Tags hello-world
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.HelloWorldMessage}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/hello-world/messages [get]
func (h *HelloWorldHandler) GetHelloWorldMessagesHandler(w http.ResponseWriter, r *http.Request) {
	messages, err := h.service.GetHelloWorldMessages()
	if err != nil {
		models.SendDatabaseError(w, "Failed to retrieve hello world messages")
		return
	}

	models.SendSuccessResponse(w, "Hello World messages retrieved successfully", messages)
}

// GetHelloWorldMessageByIDHandler IDでHello Worldメッセージ取得
// @Summary Hello Worldメッセージ取得（ID指定）
// @Description 指定されたIDのHello Worldメッセージを取得
// @Tags hello-world
// @Accept json
// @Produce json
// @Param id path int true "Message ID"
// @Success 200 {object} models.SuccessResponse{data=models.HelloWorldMessage}
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/hello-world/messages/{id} [get]
func (h *HelloWorldHandler) GetHelloWorldMessageByIDHandler(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		models.SendValidationError(w, "Invalid ID format")
		return
	}

	message, err := h.service.GetHelloWorldMessageByID(id)
	if err != nil {
		if err.Error() == "hello world message not found" {
			models.SendNotFoundError(w, "Hello World message not found")
			return
		}
		models.SendDatabaseError(w, "Failed to retrieve hello world message")
		return
	}

	models.SendSuccessResponse(w, "Hello World message retrieved successfully", message)
}
