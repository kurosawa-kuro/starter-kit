package models

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// TestHelloWorldRequestValidation Hello Worldリクエストバリデーションのテスト
func TestHelloWorldRequestValidation(t *testing.T) {
	tests := []struct {
		name    string
		request HelloWorldRequest
		wantErr bool
	}{
		{
			name:    "Valid request",
			request: HelloWorldRequest{Name: "Alice"},
			wantErr: false,
		},
		{
			name:    "Empty name",
			request: HelloWorldRequest{Name: ""},
			wantErr: true,
		},
		{
			name:    "Whitespace name",
			request: HelloWorldRequest{Name: "   "},
			wantErr: false, // 現在のバリデーションは空白文字をチェックしない
		},
		{
			name:    "Long name",
			request: HelloWorldRequest{Name: "VeryLongNameThatExceedsNormalLength"},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.request.Validate()
			if (err != nil) != tt.wantErr {
				t.Errorf("HelloWorldRequest.Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

// TestValidationError ValidationErrorのテスト
func TestValidationError(t *testing.T) {
	tests := []struct {
		name     string
		field    string
		message  string
		expected string
	}{
		{
			name:     "Name validation error",
			field:    "name",
			message:  "Name is required",
			expected: "Name is required",
		},
		{
			name:     "Email validation error",
			field:    "email",
			message:  "Invalid email format",
			expected: "Invalid email format",
		},
		{
			name:     "Empty message",
			field:    "field",
			message:  "",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := &ValidationError{
				Field:   tt.field,
				Message: tt.message,
			}

			if err.Error() != tt.expected {
				t.Errorf("Expected '%s', got '%s'", tt.expected, err.Error())
			}

			if err.Field != tt.field {
				t.Errorf("Expected field '%s', got '%s'", tt.field, err.Field)
			}
		})
	}
}

// TestHelloWorldResponse Hello Worldレスポンスのテスト
func TestHelloWorldResponse(t *testing.T) {
	response := &HelloWorldResponse{
		Message:   "Hello, World!",
		Timestamp: time.Now(),
		Version:   "1.0.0",
	}

	if response.Message != "Hello, World!" {
		t.Errorf("Expected message 'Hello, World!', got '%s'", response.Message)
	}

	if response.Version != "1.0.0" {
		t.Errorf("Expected version '1.0.0', got '%s'", response.Version)
	}

	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestHelloWorldMessage Hello Worldメッセージのテスト
func TestHelloWorldMessage(t *testing.T) {
	now := time.Now()
	message := &HelloWorldMessage{
		ID:        1,
		Name:      "Alice",
		Message:   "Hello, Alice!",
		CreatedAt: now,
		UpdatedAt: now,
	}

	if message.ID != 1 {
		t.Errorf("Expected ID 1, got %d", message.ID)
	}

	if message.Name != "Alice" {
		t.Errorf("Expected name 'Alice', got '%s'", message.Name)
	}

	if message.Message != "Hello, Alice!" {
		t.Errorf("Expected message 'Hello, Alice!', got '%s'", message.Message)
	}

	if !message.CreatedAt.Equal(now) {
		t.Error("Expected CreatedAt to match")
	}

	if !message.UpdatedAt.Equal(now) {
		t.Error("Expected UpdatedAt to match")
	}
}

// TestBaseResponse BaseResponseのテスト
func TestBaseResponse(t *testing.T) {
	response := &BaseResponse{
		Status:    "success",
		Message:   "Test message",
		Timestamp: time.Now(),
	}

	if response.Status != "success" {
		t.Errorf("Expected status 'success', got '%s'", response.Status)
	}

	if response.Message != "Test message" {
		t.Errorf("Expected message 'Test message', got '%s'", response.Message)
	}

	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestSuccessResponse SuccessResponseのテスト
func TestSuccessResponse(t *testing.T) {
	data := map[string]string{"key": "value"}
	response := NewSuccessResponse("Success message", data)

	if response.Status != "success" {
		t.Errorf("Expected status 'success', got '%s'", response.Status)
	}

	if response.Message != "Success message" {
		t.Errorf("Expected message 'Success message', got '%s'", response.Message)
	}

	if response.Data == nil {
		t.Error("Expected data to be set")
	}

	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestErrorResponse ErrorResponseのテスト
func TestErrorResponse(t *testing.T) {
	response := &ErrorResponse{
		Status:    "error",
		Message:   "Error message",
		Timestamp: time.Now(),
	}

	if response.Status != "error" {
		t.Errorf("Expected status 'error', got '%s'", response.Status)
	}

	if response.Message != "Error message" {
		t.Errorf("Expected message 'Error message', got '%s'", response.Message)
	}

	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestSendJSONResponse SendJSONResponseのテスト
func TestSendJSONResponse(t *testing.T) {
	w := httptest.NewRecorder()
	data := map[string]string{"key": "value"}

	SendJSONResponse(w, http.StatusOK, data)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	if w.Header().Get("Content-Type") != "application/json" {
		t.Errorf("Expected Content-Type 'application/json', got '%s'", w.Header().Get("Content-Type"))
	}

	var response map[string]string
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response["key"] != "value" {
		t.Errorf("Expected value 'value', got '%s'", response["key"])
	}
}

// TestSendSuccessResponse SendSuccessResponseのテスト
func TestSendSuccessResponse(t *testing.T) {
	w := httptest.NewRecorder()
	data := map[string]string{"key": "value"}

	SendSuccessResponse(w, "Success message", data)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response SuccessResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "success" {
		t.Errorf("Expected status 'success', got '%s'", response.Status)
	}

	if response.Message != "Success message" {
		t.Errorf("Expected message 'Success message', got '%s'", response.Message)
	}
}

// TestSendErrorResponse SendErrorResponseのテスト
func TestSendErrorResponse(t *testing.T) {
	w := httptest.NewRecorder()

	SendErrorResponse(w, http.StatusBadRequest, "validation", "Error message")

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}

	var response ErrorResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "error" {
		t.Errorf("Expected status 'error', got '%s'", response.Status)
	}

	if response.Message != "Error message" {
		t.Errorf("Expected message 'Error message', got '%s'", response.Message)
	}
}

// TestSendValidationError SendValidationErrorのテスト
func TestSendValidationError(t *testing.T) {
	w := httptest.NewRecorder()

	SendValidationError(w, "Validation error message")

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}

	var response ErrorResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "error" {
		t.Errorf("Expected status 'error', got '%s'", response.Status)
	}

	if response.Message != "Validation error message" {
		t.Errorf("Expected message 'Validation error message', got '%s'", response.Message)
	}
}

// TestSendDatabaseError SendDatabaseErrorのテスト
func TestSendDatabaseError(t *testing.T) {
	w := httptest.NewRecorder()

	SendDatabaseError(w, "Database error message")

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}

	var response ErrorResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "error" {
		t.Errorf("Expected status 'error', got '%s'", response.Status)
	}

	if response.Message != "Database error message" {
		t.Errorf("Expected message 'Database error message', got '%s'", response.Message)
	}
}

// TestSendNotFoundError SendNotFoundErrorのテスト
func TestSendNotFoundError(t *testing.T) {
	w := httptest.NewRecorder()

	SendNotFoundError(w, "Not found message")

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}

	var response ErrorResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "error" {
		t.Errorf("Expected status 'error', got '%s'", response.Status)
	}

	if response.Message != "Not found message" {
		t.Errorf("Expected message 'Not found message', got '%s'", response.Message)
	}
}
