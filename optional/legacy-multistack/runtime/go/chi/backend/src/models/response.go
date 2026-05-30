package models

import (
	"encoding/json"
	"net/http"
	"time"
)

// BaseResponse 基本レスポンス構造体
type BaseResponse struct {
	Status    string    `json:"status"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// SuccessResponse 成功レスポンス構造体
type SuccessResponse struct {
	BaseResponse
	Data interface{} `json:"data,omitempty"`
}

// ErrorResponse エラーレスポンス構造体
type ErrorResponse struct {
	Status    string    `json:"status"`
	Error     string    `json:"error"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// NewSuccessResponse 成功レスポンスを新規作成
func NewSuccessResponse(message string, data interface{}) *SuccessResponse {
	return &SuccessResponse{
		BaseResponse: BaseResponse{
			Status:    "success",
			Message:   message,
			Timestamp: time.Now(),
		},
		Data: data,
	}
}

// NewErrorResponse エラーレスポンスを新規作成
func NewErrorResponse(errorType, message string) *ErrorResponse {
	return &ErrorResponse{
		Status:    "error",
		Error:     errorType,
		Message:   message,
		Timestamp: time.Now(),
	}
}

// SendJSONResponse JSONレスポンスを送信
func SendJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

// SendSuccessResponse 成功レスポンスを送信
func SendSuccessResponse(w http.ResponseWriter, message string, data interface{}) {
	response := NewSuccessResponse(message, data)
	SendJSONResponse(w, http.StatusOK, response)
}

// SendErrorResponse エラーレスポンスを送信
func SendErrorResponse(w http.ResponseWriter, statusCode int, errorType, message string) {
	response := NewErrorResponse(errorType, message)
	SendJSONResponse(w, statusCode, response)
}

// SendValidationError バリデーションエラーレスポンスを送信
func SendValidationError(w http.ResponseWriter, message string) {
	SendErrorResponse(w, http.StatusBadRequest, "validation_error", message)
}

// SendNotFoundError リソース未発見エラーレスポンスを送信
func SendNotFoundError(w http.ResponseWriter, message string) {
	SendErrorResponse(w, http.StatusNotFound, "not_found", message)
}

// SendInternalError 内部サーバーエラーレスポンスを送信
func SendInternalError(w http.ResponseWriter, message string) {
	SendErrorResponse(w, http.StatusInternalServerError, "internal_error", message)
}

// SendDatabaseError データベースエラーレスポンスを送信
func SendDatabaseError(w http.ResponseWriter, message string) {
	SendErrorResponse(w, http.StatusInternalServerError, "database_error", message)
}
