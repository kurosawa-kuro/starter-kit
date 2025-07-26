package models

import (
	"time"
)

// HelloWorldRequest Hello World作成リクエスト構造体
type HelloWorldRequest struct {
	Name string `json:"name"`
}

// HelloWorldMessage Hello Worldメッセージ構造体
type HelloWorldMessage struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// HelloWorldResponse Hello Worldレスポンス構造体
type HelloWorldResponse struct {
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version"`
}

// Validate Hello Worldリクエストのバリデーション
func (h *HelloWorldRequest) Validate() error {
	if h.Name == "" {
		return &ValidationError{Field: "name", Message: "Name is required"}
	}
	return nil
}

// ValidationError バリデーションエラー構造体
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// Error エラーメッセージを返す
func (v *ValidationError) Error() string {
	return v.Message
}
