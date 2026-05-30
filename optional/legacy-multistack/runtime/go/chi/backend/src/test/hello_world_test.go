package test

import (
	"testing"

	"backend/models"
	"backend/services"
)

// MockDatabase モックデータベース構造体
type MockDatabase struct{}

// TestGetHelloWorld Hello World取得のテスト
func TestGetHelloWorld(t *testing.T) {
	service := services.NewHelloWorldService(nil)

	response := service.GetHelloWorld()

	if response.Message != "Hello, World!" {
		t.Errorf("Expected 'Hello, World!', got '%s'", response.Message)
	}

	if response.Version != "1.0.0" {
		t.Errorf("Expected '1.0.0', got '%s'", response.Version)
	}
}

// TestHelloWorldRequestValidation Hello Worldリクエストバリデーションのテスト
func TestHelloWorldRequestValidation(t *testing.T) {
	tests := []struct {
		name    string
		request models.HelloWorldRequest
		wantErr bool
	}{
		{
			name:    "Valid request",
			request: models.HelloWorldRequest{Name: "Alice"},
			wantErr: false,
		},
		{
			name:    "Empty name",
			request: models.HelloWorldRequest{Name: ""},
			wantErr: true,
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
	err := &models.ValidationError{
		Field:   "name",
		Message: "Name is required",
	}

	expected := "Name is required"
	if err.Error() != expected {
		t.Errorf("Expected '%s', got '%s'", expected, err.Error())
	}
}
