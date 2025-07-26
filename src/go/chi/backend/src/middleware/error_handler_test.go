package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestErrorHandler エラーハンドラーミドルウェアのテスト
func TestErrorHandler(t *testing.T) {
	// テスト用のハンドラー（パニックを起こす）
	panicHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("test panic")
	})

	// エラーハンドラーミドルウェアを適用
	handler := ErrorHandler(panicHandler)

	// テストリクエストを作成
	req, err := http.NewRequest("GET", "/test", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラーを実行
	handler.ServeHTTP(rr, req)

	// ステータスコードを確認
	if rr.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", rr.Code)
	}

	// レスポンスボディを確認
	if !contains(rr.Body.String(), "Internal Server Error") {
		t.Errorf("Expected response to contain 'Internal Server Error', got '%s'", rr.Body.String())
	}
}

// TestErrorHandlerNormalRequest 通常のリクエストのテスト
func TestErrorHandlerNormalRequest(t *testing.T) {
	// テスト用のハンドラー（正常に動作）
	normalHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// エラーハンドラーミドルウェアを適用
	handler := ErrorHandler(normalHandler)

	// テストリクエストを作成
	req, err := http.NewRequest("GET", "/test", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラーを実行
	handler.ServeHTTP(rr, req)

	// ステータスコードを確認
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
	}

	// レスポンスボディを確認
	if rr.Body.String() != "OK" {
		t.Errorf("Expected response 'OK', got '%s'", rr.Body.String())
	}
}

// TestErrorHandlerWithDifferentPanicTypes 異なるパニックタイプのテスト
func TestErrorHandlerWithDifferentPanicTypes(t *testing.T) {
	tests := []struct {
		name           string
		panicValue     interface{}
		expectedStatus int
	}{
		{
			name:           "String panic",
			panicValue:     "string panic",
			expectedStatus: http.StatusInternalServerError,
		},
		{
			name:           "Error panic",
			panicValue:     http.ErrServerClosed,
			expectedStatus: http.StatusInternalServerError,
		},
		{
			name:           "Int panic",
			panicValue:     42,
			expectedStatus: http.StatusInternalServerError,
		},
		{
			name:           "Nil panic",
			panicValue:     nil,
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// テスト用のハンドラー（指定されたパニックを起こす）
			panicHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				panic(tt.panicValue)
			})

			// エラーハンドラーミドルウェアを適用
			handler := ErrorHandler(panicHandler)

			// テストリクエストを作成
			req, err := http.NewRequest("GET", "/test", nil)
			if err != nil {
				t.Fatalf("Failed to create request: %v", err)
			}

			// レスポンスレコーダーを作成
			rr := httptest.NewRecorder()

			// ハンドラーを実行
			handler.ServeHTTP(rr, req)

			// ステータスコードを確認
			if rr.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, rr.Code)
			}

			// レスポンスがJSON形式であることを確認
			var response map[string]interface{}
			if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
				t.Errorf("Expected JSON response, got error: %v", err)
			}

			// エラーレスポンスの構造を確認
			if response["status"] != "error" {
				t.Errorf("Expected status 'error', got '%v'", response["status"])
			}

			if response["message"] == nil {
				t.Error("Expected message field to be present")
			}
		})
	}
}

// TestErrorHandlerWithHeaders ヘッダー設定のテスト
func TestErrorHandlerWithHeaders(t *testing.T) {
	// テスト用のハンドラー（パニックを起こす）
	panicHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("test panic")
	})

	// エラーハンドラーミドルウェアを適用
	handler := ErrorHandler(panicHandler)

	// テストリクエストを作成
	req, err := http.NewRequest("GET", "/test", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラーを実行
	handler.ServeHTTP(rr, req)

	// Content-Typeヘッダーを確認
	contentType := rr.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf("Expected Content-Type 'application/json', got '%s'", contentType)
	}
}

// TestErrorHandlerWithDifferentMethods 異なるHTTPメソッドのテスト
func TestErrorHandlerWithDifferentMethods(t *testing.T) {
	methods := []string{"GET", "POST", "PUT", "DELETE", "PATCH"}

	for _, method := range methods {
		t.Run(method, func(t *testing.T) {
			// テスト用のハンドラー（パニックを起こす）
			panicHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				panic("test panic")
			})

			// エラーハンドラーミドルウェアを適用
			handler := ErrorHandler(panicHandler)

			// テストリクエストを作成
			req, err := http.NewRequest(method, "/test", nil)
			if err != nil {
				t.Fatalf("Failed to create request: %v", err)
			}

			// レスポンスレコーダーを作成
			rr := httptest.NewRecorder()

			// ハンドラーを実行
			handler.ServeHTTP(rr, req)

			// ステータスコードを確認
			if rr.Code != http.StatusInternalServerError {
				t.Errorf("Expected status 500, got %d", rr.Code)
			}
		})
	}
}

// contains 文字列が含まれているかチェックするヘルパー関数
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 || 
		(len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || 
		func() bool {
			for i := 1; i <= len(s)-len(substr); i++ {
				if s[i:i+len(substr)] == substr {
					return true
				}
			}
			return false
		}())))
} 