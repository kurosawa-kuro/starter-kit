package utils

import (
	"testing"
)

// TestNewMockData MockData作成のテスト
func TestNewMockData(t *testing.T) {
	mockData := NewMockData()
	if mockData == nil {
		t.Error("NewMockData() returned nil")
	}
}

// TestGetMockHelloWorldMessage モックHello Worldメッセージ取得のテスト
func TestGetMockHelloWorldMessage(t *testing.T) {
	mockData := NewMockData()

	// 正常なケース
	message := mockData.GetMockHelloWorldMessage("TestUser")
	if message == nil {
		t.Fatal("GetMockHelloWorldMessage() returned nil")
	}

	// フィールドの検証
	if message.ID != 1 {
		t.Errorf("Expected ID 1, got %d", message.ID)
	}
	if message.Name != "TestUser" {
		t.Errorf("Expected Name 'TestUser', got %s", message.Name)
	}
	if message.Message != "Hello, TestUser!" {
		t.Errorf("Expected Message 'Hello, TestUser!', got %s", message.Message)
	}
	if message.CreatedAt.IsZero() {
		t.Error("Expected CreatedAt to be set")
	}
	if message.UpdatedAt.IsZero() {
		t.Error("Expected UpdatedAt to be set")
	}

	// 空文字列のケース
	emptyMessage := mockData.GetMockHelloWorldMessage("")
	if emptyMessage == nil {
		t.Fatal("GetMockHelloWorldMessage() with empty name returned nil")
	}
	if emptyMessage.Name != "" {
		t.Errorf("Expected empty name, got %s", emptyMessage.Name)
	}
	if emptyMessage.Message != "Hello, !" {
		t.Errorf("Expected Message 'Hello, !', got %s", emptyMessage.Message)
	}
}

// TestGetMockHelloWorldMessages モックHello Worldメッセージリスト取得のテスト
func TestGetMockHelloWorldMessages(t *testing.T) {
	mockData := NewMockData()

	messages := mockData.GetMockHelloWorldMessages()
	if messages == nil {
		t.Fatal("GetMockHelloWorldMessages() returned nil")
	}

	// メッセージ数の検証
	if len(messages) != 2 {
		t.Errorf("Expected 2 messages, got %d", len(messages))
	}

	// 1つ目のメッセージの検証
	if messages[0].ID != 1 {
		t.Errorf("Expected first message ID 1, got %d", messages[0].ID)
	}
	if messages[0].Name != "Default User" {
		t.Errorf("Expected first message name 'Default User', got %s", messages[0].Name)
	}
	if messages[0].Message != "Hello, World!" {
		t.Errorf("Expected first message 'Hello, World!', got %s", messages[0].Message)
	}

	// 2つ目のメッセージの検証
	if messages[1].ID != 2 {
		t.Errorf("Expected second message ID 2, got %d", messages[1].ID)
	}
	if messages[1].Name != "Test User" {
		t.Errorf("Expected second message name 'Test User', got %s", messages[1].Name)
	}
	if messages[1].Message != "Hello, Test User!" {
		t.Errorf("Expected second message 'Hello, Test User!', got %s", messages[1].Message)
	}

	// タイムスタンプの検証
	for i, msg := range messages {
		if msg.CreatedAt.IsZero() {
			t.Errorf("Message %d CreatedAt is zero", i)
		}
		if msg.UpdatedAt.IsZero() {
			t.Errorf("Message %d UpdatedAt is zero", i)
		}
	}
}

// TestGetMockHelloWorldMessageByID ID指定でのモックメッセージ取得のテスト
func TestGetMockHelloWorldMessageByID(t *testing.T) {
	mockData := NewMockData()

	// 存在するIDのテスト
	message := mockData.GetMockHelloWorldMessageByID(1)
	if message == nil {
		t.Fatal("GetMockHelloWorldMessageByID(1) returned nil")
	}
	if message.ID != 1 {
		t.Errorf("Expected ID 1, got %d", message.ID)
	}
	if message.Name != "Default User" {
		t.Errorf("Expected Name 'Default User', got %s", message.Name)
	}
	if message.Message != "Hello, World!" {
		t.Errorf("Expected Message 'Hello, World!', got %s", message.Message)
	}

	// 存在しないIDのテスト
	nonExistentMessage := mockData.GetMockHelloWorldMessageByID(999)
	if nonExistentMessage != nil {
		t.Errorf("Expected nil for non-existent ID, got %+v", nonExistentMessage)
	}

	// ゼロIDのテスト
	zeroMessage := mockData.GetMockHelloWorldMessageByID(0)
	if zeroMessage != nil {
		t.Errorf("Expected nil for zero ID, got %+v", zeroMessage)
	}

	// 負のIDのテスト
	negativeMessage := mockData.GetMockHelloWorldMessageByID(-1)
	if negativeMessage != nil {
		t.Errorf("Expected nil for negative ID, got %+v", negativeMessage)
	}
}

// TestMockDataConsistency モックデータの一貫性テスト
func TestMockDataConsistency(t *testing.T) {
	mockData := NewMockData()

	// 同じIDで複数回取得しても同じ結果になることを確認
	message1 := mockData.GetMockHelloWorldMessageByID(1)
	message2 := mockData.GetMockHelloWorldMessageByID(1)

	if message1.ID != message2.ID {
		t.Error("Inconsistent ID between multiple calls")
	}
	if message1.Name != message2.Name {
		t.Error("Inconsistent Name between multiple calls")
	}
	if message1.Message != message2.Message {
		t.Error("Inconsistent Message between multiple calls")
	}
}
