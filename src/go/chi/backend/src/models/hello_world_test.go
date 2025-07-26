package models

import (
	"testing"
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
	err := &ValidationError{
		Field:   "name",
		Message: "Name is required",
	}

	expected := "Name is required"
	if err.Error() != expected {
		t.Errorf("Expected '%s', got '%s'", expected, err.Error())
	}
}
