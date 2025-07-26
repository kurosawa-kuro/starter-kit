package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/models"
)

// TestNewHealthHandler ヘルスチェックハンドラー作成のテスト
func TestNewHealthHandler(t *testing.T) {
	// nil DBでのテスト
	handler := NewHealthHandler(nil)
	if handler == nil {
		t.Error("NewHealthHandler() returned nil")
	}
	if handler.db != nil {
		t.Error("Expected db to be nil")
	}

	// 実際のDBでのテスト（統合テスト）
	db := setupTestDB(t)
	defer db.Close()

	handlerWithDB := NewHealthHandler(db)
	if handlerWithDB == nil {
		t.Error("NewHealthHandler() with DB returned nil")
	}
	if handlerWithDB.db == nil {
		t.Error("Expected db to be set")
	}
}

// TestHealthCheckHandler ヘルスチェックハンドラーのテスト
func TestHealthCheckHandler(t *testing.T) {
	// nil DBでのテスト
	handler := NewHealthHandler(nil)

	req := httptest.NewRequest("GET", "/api/health", nil)
	w := httptest.NewRecorder()

	handler.HealthCheckHandler(w, req)

	// レスポンスの検証
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// レスポンスボディの解析
	var response models.BaseResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("レスポンス解析失敗: %v", err)
	}

	// フィールドの検証
	if response.Status != "healthy" {
		t.Errorf("Expected status 'healthy', got %s", response.Status)
	}
	if response.Message != "Application is running" {
		t.Errorf("Expected message 'Application is running', got %s", response.Message)
	}
	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestHealthCheckHandlerWithDatabase データベースありでのヘルスチェックテスト
func TestHealthCheckHandlerWithDatabase(t *testing.T) {
	// 統合テストとして実行
	db := setupTestDB(t)
	defer db.Close()

	handler := NewHealthHandler(db)

	req := httptest.NewRequest("GET", "/api/health", nil)
	w := httptest.NewRecorder()

	handler.HealthCheckHandler(w, req)

	// レスポンスの検証
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// レスポンスボディの解析
	var response models.BaseResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("レスポンス解析失敗: %v", err)
	}

	// データベースが正常な場合の検証
	if response.Status != "healthy" {
		t.Errorf("Expected status 'healthy', got %s", response.Status)
	}
	if response.Message != "Application is running" {
		t.Errorf("Expected message 'Application is running', got %s", response.Message)
	}
	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestHealthCheckHandlerWithDatabaseError データベースエラー時のテスト
func TestHealthCheckHandlerWithDatabaseError(t *testing.T) {
	// 無効なDB接続を作成
	invalidDB, err := sql.Open("postgres", "host=invalid port=5432 user=invalid password=invalid dbname=invalid sslmode=disable")
	if err != nil {
		t.Fatalf("無効なDB接続作成失敗: %v", err)
	}
	defer invalidDB.Close()

	handler := NewHealthHandler(invalidDB)

	req := httptest.NewRequest("GET", "/api/health", nil)
	w := httptest.NewRecorder()

	handler.HealthCheckHandler(w, req)

	// レスポンスの検証
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// レスポンスボディの解析
	var response models.BaseResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("レスポンス解析失敗: %v", err)
	}

	// データベースエラーの場合の検証
	if response.Status != "unhealthy" {
		t.Errorf("Expected status 'unhealthy', got %s", response.Status)
	}
	if response.Message != "Database connection failed" {
		t.Errorf("Expected message 'Database connection failed', got %s", response.Message)
	}
	if response.Timestamp.IsZero() {
		t.Error("Expected timestamp to be set")
	}
}

// TestHealthCheckHandlerWithDifferentMethods 異なるHTTPメソッドでのテスト
func TestHealthCheckHandlerWithDifferentMethods(t *testing.T) {
	handler := NewHealthHandler(nil)

	methods := []string{"GET", "POST", "PUT", "DELETE", "PATCH"}

	for _, method := range methods {
		t.Run(method, func(t *testing.T) {
			req := httptest.NewRequest(method, "/api/health", nil)
			w := httptest.NewRecorder()

			handler.HealthCheckHandler(w, req)

			// どのメソッドでも200を返すことを確認
			if w.Code != http.StatusOK {
				t.Errorf("Expected status 200 for %s, got %d", method, w.Code)
			}
		})
	}
}

// TestHealthCheckHandlerResponseConsistency レスポンスの一貫性テスト
func TestHealthCheckHandlerResponseConsistency(t *testing.T) {
	handler := NewHealthHandler(nil)

	// 複数回実行してレスポンスの一貫性を確認
	for i := 0; i < 3; i++ {
		req := httptest.NewRequest("GET", "/api/health", nil)
		w := httptest.NewRecorder()

		handler.HealthCheckHandler(w, req)

		var response models.BaseResponse
		if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
			t.Fatalf("レスポンス解析失敗: %v", err)
		}

		if response.Status != "healthy" {
			t.Errorf("Iteration %d: Expected status 'healthy', got %s", i, response.Status)
		}
		if response.Message != "Application is running" {
			t.Errorf("Iteration %d: Expected message 'Application is running', got %s", i, response.Message)
		}
		if response.Timestamp.IsZero() {
			t.Errorf("Iteration %d: Expected timestamp to be set", i)
		}
	}
}
