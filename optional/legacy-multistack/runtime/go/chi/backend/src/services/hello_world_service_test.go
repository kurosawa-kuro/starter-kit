package services

import (
	"database/sql"
	"testing"

	"backend/models"
)

// MockDatabase モックデータベース構造体
type MockDatabase struct {
	shouldError bool
	messages    []models.HelloWorldMessage
	nextID      int
}

// QueryRow モックQueryRowメソッド
func (m *MockDatabase) QueryRow(query string, args ...interface{}) *sql.Row {
	if m.shouldError {
		return &sql.Row{}
	}
	// モック実装
	return &sql.Row{}
}

// Query モックQueryメソッド
func (m *MockDatabase) Query(query string, args ...interface{}) (*sql.Rows, error) {
	if m.shouldError {
		return nil, sql.ErrConnDone
	}
	// モック実装
	return &sql.Rows{}, nil
}

// TestNewHelloWorldService サービス作成のテスト
func TestNewHelloWorldService(t *testing.T) {
	db := &sql.DB{}
	service := NewHelloWorldService(db)
	
	if service == nil {
		t.Error("Expected service to be created, got nil")
	}
	
	if service.db != db {
		t.Error("Expected database to be set correctly")
	}
}

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

	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestCreateHelloWorld Hello World作成のテスト
func TestCreateHelloWorld(t *testing.T) {
	tests := []struct {
		name        string
		request     *models.HelloWorldRequest
		shouldError bool
	}{
		{
			name:        "Empty name",
			request:     &models.HelloWorldRequest{Name: ""},
			shouldError: true,
		},
		{
			name:        "Nil request",
			request:     nil,
			shouldError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			service := NewHelloWorldService(nil)
			
			if tt.request == nil {
				// nilリクエストの場合はパニックをテスト
				defer func() {
					if r := recover(); r == nil {
						t.Error("Expected panic for nil request")
					}
				}()
				service.CreateHelloWorld(tt.request)
				return
			}
			
			_, err := service.CreateHelloWorld(tt.request)
			if (err != nil) != tt.shouldError {
				t.Errorf("CreateHelloWorld() error = %v, wantErr %v", err, tt.shouldError)
			}
		})
	}
}

// TestCreateHelloWorldWithDatabase データベースありでのHello World作成テスト
func TestCreateHelloWorldWithDatabase(t *testing.T) {
	// このテストは実際のデータベースが必要なため、スキップ
	t.Skip("Skipping database test - requires actual database connection")
}

// TestGetHelloWorldMessages Hello Worldメッセージ一覧取得のテスト
func TestGetHelloWorldMessages(t *testing.T) {
	// 統合テストとして実行
	db := setupTestDB(t)
	defer db.Close()
	
	service := NewHelloWorldService(db)
	
	// テストデータを作成
	req := &models.HelloWorldRequest{Name: "TestMessage"}
	_, err := service.CreateHelloWorld(req)
	if err != nil {
		t.Fatalf("テストデータ作成失敗: %v", err)
	}
	
	// メッセージ一覧を取得
	messages, err := service.GetHelloWorldMessages()
	if err != nil {
		t.Fatalf("GetHelloWorldMessages失敗: %v", err)
	}
	
	// 結果を検証
	if len(messages) == 0 {
		t.Error("メッセージが取得できませんでした")
	}
	
	// 作成したメッセージが含まれているか確認
	found := false
	for _, msg := range messages {
		if msg.Name == "TestMessage" {
			found = true
			break
		}
	}
	if !found {
		t.Error("作成したテストメッセージが一覧に含まれていません")
	}
}

// TestGetHelloWorldMessageByID IDでHello Worldメッセージ取得のテスト
func TestGetHelloWorldMessageByID(t *testing.T) {
	// 統合テストとして実行
	db := setupTestDB(t)
	defer db.Close()
	
	service := NewHelloWorldService(db)
	
	// テストデータを作成
	req := &models.HelloWorldRequest{Name: "TestMessageByID"}
	createdMsg, err := service.CreateHelloWorld(req)
	if err != nil {
		t.Fatalf("テストデータ作成失敗: %v", err)
	}
	
	// 作成したメッセージをIDで取得
	retrievedMsg, err := service.GetHelloWorldMessageByID(createdMsg.ID)
	if err != nil {
		t.Fatalf("GetHelloWorldMessageByID失敗: %v", err)
	}
	
	// 結果を検証
	if retrievedMsg.ID != createdMsg.ID {
		t.Errorf("ID不一致: expected %d, got %d", createdMsg.ID, retrievedMsg.ID)
	}
	if retrievedMsg.Name != "TestMessageByID" {
		t.Errorf("Name不一致: expected %s, got %s", "TestMessageByID", retrievedMsg.Name)
	}
	
	// 存在しないIDでテスト
	_, err = service.GetHelloWorldMessageByID(99999)
	if err == nil {
		t.Error("存在しないIDでエラーが発生しませんでした")
	}
}
