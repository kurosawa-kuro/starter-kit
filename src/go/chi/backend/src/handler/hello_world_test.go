package handler

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
	"backend/models"
)

// setupTestDB テスト用DB接続を設定
func setupTestDB(t *testing.T) *sql.DB {
	dsn := "host=localhost port=15434 user=sampleuser password=samplepass dbname=sampledb_test sslmode=disable"
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		t.Fatalf("DB接続失敗: %v", err)
	}
	// DB起動待ち
	for i := 0; i < 10; i++ {
		if err := db.Ping(); err == nil {
			return db
		}
		time.Sleep(1 * time.Second)
	}
	t.Fatal("DB起動待ちタイムアウト")
	return nil
}

// MockHelloWorldService モックサービス構造体
type MockHelloWorldService struct {
	shouldError bool
	messages    []models.HelloWorldMessage
	nextID      int
}

// GetHelloWorld モックGetHelloWorldメソッド
func (m *MockHelloWorldService) GetHelloWorld() *models.HelloWorldResponse {
	return &models.HelloWorldResponse{
		Message: "Hello, World!",
		Version: "1.0.0",
	}
}

// CreateHelloWorld モックCreateHelloWorldメソッド
func (m *MockHelloWorldService) CreateHelloWorld(request *models.HelloWorldRequest) (*models.HelloWorldMessage, error) {
	if m.shouldError {
		return nil, &models.ValidationError{Field: "name", Message: "Name is required"}
	}

	if request.Name == "" {
		return nil, &models.ValidationError{Field: "name", Message: "Name is required"}
	}

	return &models.HelloWorldMessage{
		ID:      m.nextID,
		Name:    request.Name,
		Message: "Hello, " + request.Name + "!",
	}, nil
}

// GetHelloWorldMessages モックGetHelloWorldMessagesメソッド
func (m *MockHelloWorldService) GetHelloWorldMessages() ([]models.HelloWorldMessage, error) {
	if m.shouldError {
		return nil, sql.ErrConnDone
	}
	return m.messages, nil
}

// GetHelloWorldMessageByID モックGetHelloWorldMessageByIDメソッド
func (m *MockHelloWorldService) GetHelloWorldMessageByID(id int) (*models.HelloWorldMessage, error) {
	if m.shouldError {
		return nil, sql.ErrConnDone
	}

	if id <= 0 {
		return nil, &models.ValidationError{Field: "id", Message: "Invalid ID"}
	}

	// モックメッセージを返す
	return &models.HelloWorldMessage{
		ID:      id,
		Name:    "Test User",
		Message: "Hello, Test User!",
	}, nil
}

// TestNewHelloWorldHandler ハンドラー作成のテスト
func TestNewHelloWorldHandler(t *testing.T) {
	db := &sql.DB{}
	handler := NewHelloWorldHandler(db)

	if handler == nil {
		t.Error("Expected handler to be created, got nil")
	}

	if handler.service == nil {
		t.Error("Expected service to be created")
	}
}

// TestGetHelloWorldHandler Hello World取得ハンドラーのテスト
func TestGetHelloWorldHandler(t *testing.T) {
	handler := NewHelloWorldHandler(nil)

	req := httptest.NewRequest("GET", "/api/hello-world", nil)
	w := httptest.NewRecorder()

	handler.GetHelloWorldHandler(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response models.SuccessResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "success" {
		t.Errorf("Expected status 'success', got '%s'", response.Status)
	}
}

// TestRootHandler ルートハンドラーのテスト
func TestRootHandler(t *testing.T) {
	handler := NewHelloWorldHandler(nil)

	req := httptest.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()

	handler.RootHandler(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response models.BaseResponse
	if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Status != "success" {
		t.Errorf("Expected status 'success', got '%s'", response.Status)
	}

	if response.Message != "Go + Chi Starter Project API" {
		t.Errorf("Expected message 'Go + Chi Starter Project API', got '%s'", response.Message)
	}
}

// TestCreateHelloWorldHandler Hello World作成ハンドラーのテスト
func TestCreateHelloWorldHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    interface{}
		expectedStatus int
		shouldError    bool
	}{
		{
			name:           "Empty name",
			requestBody:    models.HelloWorldRequest{Name: ""},
			expectedStatus: http.StatusBadRequest,
			shouldError:    true,
		},
		{
			name:           "Invalid JSON",
			requestBody:    "invalid json",
			expectedStatus: http.StatusBadRequest,
			shouldError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler := NewHelloWorldHandler(nil)

			var body []byte
			var err error

			if str, ok := tt.requestBody.(string); ok {
				body = []byte(str)
			} else {
				body, err = json.Marshal(tt.requestBody)
				if err != nil {
					t.Fatalf("Failed to marshal request body: %v", err)
				}
			}

			req := httptest.NewRequest("POST", "/api/hello-world", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			handler.CreateHelloWorldHandler(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

// TestCreateHelloWorldHandlerWithDatabase データベースありでのHello World作成ハンドラーテスト
func TestCreateHelloWorldHandlerWithDatabase(t *testing.T) {
	// このテストは実際のデータベースが必要なため、スキップ
	t.Skip("Skipping database test - requires actual database connection")
}

// TestGetHelloWorldMessagesHandler Hello Worldメッセージ一覧取得ハンドラーのテスト
func TestGetHelloWorldMessagesHandler(t *testing.T) {
	// 統合テストとして実行
	db := setupTestDB(t)
	defer db.Close()
	
	handler := NewHelloWorldHandler(db)
	
	// テストデータを作成
	req := &models.HelloWorldRequest{Name: "TestHandlerMessage"}
	reqBody, _ := json.Marshal(req)
	createReq := httptest.NewRequest("POST", "/api/hello-world", bytes.NewBuffer(reqBody))
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	handler.CreateHelloWorldHandler(createW, createReq)
	
	if createW.Code != http.StatusCreated {
		t.Fatalf("テストデータ作成失敗: status %d", createW.Code)
	}
	
	// ハンドラーをテスト
	httpReq := httptest.NewRequest("GET", "/api/hello-world/messages", nil)
	w := httptest.NewRecorder()
	
	handler.GetHelloWorldMessagesHandler(w, httpReq)
	
	// 結果を検証
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
	
	// レスポンスボディを解析
	var response models.SuccessResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("レスポンス解析失敗: %v", err)
	}
	
	// メッセージが含まれているか確認
	if response.Data == nil {
		t.Error("レスポンスにデータが含まれていません")
	}
}

// TestGetHelloWorldMessageByIDHandler IDでHello Worldメッセージ取得ハンドラーのテスト
func TestGetHelloWorldMessageByIDHandler(t *testing.T) {
	// 統合テストとして実行
	db := setupTestDB(t)
	defer db.Close()
	
	handler := NewHelloWorldHandler(db)
	
	// テストデータを作成
	req := &models.HelloWorldRequest{Name: "TestHandlerMessageByID"}
	reqBody, _ := json.Marshal(req)
	createReq := httptest.NewRequest("POST", "/api/hello-world", bytes.NewBuffer(reqBody))
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	handler.CreateHelloWorldHandler(createW, createReq)
	
	if createW.Code != http.StatusCreated {
		t.Fatalf("テストデータ作成失敗: status %d", createW.Code)
	}
	
	// 作成されたメッセージのIDを取得（実際のテストでは固定値を使用）
	createdMsgID := 1 // 簡略化のため固定値を使用
	
	tests := []struct {
		name           string
		id             string
		expectedStatus int
	}{
		{
			name:           "Valid ID",
			id:             strconv.Itoa(createdMsgID),
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Invalid ID",
			id:             "invalid",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Empty ID",
			id:             "",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Non-existent ID",
			id:             "99999",
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			httpReq := httptest.NewRequest("GET", "/api/hello-world/messages/"+tt.id, nil)
			w := httptest.NewRecorder()

			// chiコンテキストを設定
			rctx := chi.NewRouteContext()
			rctx.URLParams.Add("id", tt.id)
			httpReq = httpReq.WithContext(context.WithValue(httpReq.Context(), chi.RouteCtxKey, rctx))

			handler.GetHelloWorldMessageByIDHandler(w, httpReq)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}
