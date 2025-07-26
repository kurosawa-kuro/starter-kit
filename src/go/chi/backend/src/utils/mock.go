package utils

import (
	"backend/models"
	"time"
)

// MockData はモックデータを管理する構造体
type MockData struct{}

// NewMockData は新しいMockDataを作成します
func NewMockData() *MockData {
	return &MockData{}
}

// GetMockHelloWorldMessage はモックのHello Worldメッセージを取得します
func (m *MockData) GetMockHelloWorldMessage(name string) *models.HelloWorldMessage {
	return &models.HelloWorldMessage{
		ID:        1,
		Name:      name,
		Message:   "Hello, " + name + "!",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

// GetMockHelloWorldMessages はモックのHello Worldメッセージリストを取得します
func (m *MockData) GetMockHelloWorldMessages() []models.HelloWorldMessage {
	return []models.HelloWorldMessage{
		{
			ID:        1,
			Name:      "Default User",
			Message:   "Hello, World!",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			ID:        2,
			Name:      "Test User",
			Message:   "Hello, Test User!",
			CreatedAt: time.Now().Add(-1 * time.Hour),
			UpdatedAt: time.Now().Add(-1 * time.Hour),
		},
	}
}

// GetMockHelloWorldMessageByID は指定されたIDのモックメッセージを取得します
func (m *MockData) GetMockHelloWorldMessageByID(id int) *models.HelloWorldMessage {
	if id == 1 {
		return &models.HelloWorldMessage{
			ID:        1,
			Name:      "Default User",
			Message:   "Hello, World!",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
	}
	return nil
} 