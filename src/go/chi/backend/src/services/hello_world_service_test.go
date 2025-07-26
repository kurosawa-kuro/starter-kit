package services

import (
	"testing"
)

// TestGetHelloWorld Hello World取得のテスト
func TestGetHelloWorld(t *testing.T) {
	service := NewHelloWorldService(nil)

	response := service.GetHelloWorld()

	if response.Message != "Hello, World!" {
		t.Errorf("Expected 'Hello, World!', got '%s'", response.Message)
	}

	if response.Version != "1.0.0" {
		t.Errorf("Expected '1.0.0', got '%s'", response.Version)
	}
}
