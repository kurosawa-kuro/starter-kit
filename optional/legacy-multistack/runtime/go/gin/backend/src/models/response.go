package models

import (
	"time"
)

// BaseResponse は基本的なAPIレスポンスの構造体
type BaseResponse struct {
	Status    string    `json:"status"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// ErrorResponse はエラーレスポンスの構造体
type ErrorResponse struct {
	Status    string    `json:"status"`
	Error     string    `json:"error"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// HelloWorldResponse は挨拶レスポンスの構造体
type HelloWorldResponse struct {
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version"`
}

// HelloWorldRequest は挨拶リクエストの構造体
type HelloWorldRequest struct {
	Name string `json:"name" binding:"required"`
}

// HelloWorldMessage はHello Worldメッセージの構造体
type HelloWorldMessage struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// HealthResponse はヘルスチェックレスポンスの構造体
type HealthResponse struct {
	Status    string    `json:"status"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// NewErrorResponse は新しいエラーレスポンスを作成します
func NewErrorResponse(status, error, message string) ErrorResponse {
	return ErrorResponse{
		Status:    status,
		Error:     error,
		Message:   message,
		Timestamp: time.Now(),
	}
}

// NewSuccessResponse は新しい成功レスポンスを作成します
func NewSuccessResponse(message string) BaseResponse {
	return BaseResponse{
		Status:    "success",
		Message:   message,
		Timestamp: time.Now(),
	}
}
