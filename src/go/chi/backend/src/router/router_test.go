package router

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/handler"
	"github.com/stretchr/testify/assert"
)

// TestNewRouter ルーター作成のテスト
func TestNewRouter(t *testing.T) {
	// ハンドラーを作成
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを作成
	r := NewRouter(healthHandler, helloWorldHandler)

	// ルーターがnilでないことを確認
	assert.NotNil(t, r)
}

// TestRouterEndpoints ルーターのエンドポイントテスト
func TestRouterEndpoints(t *testing.T) {
	// ハンドラーを作成
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを作成
	r := NewRouter(healthHandler, helloWorldHandler)

	// テストケース
	testCases := []struct {
		name     string
		method   string
		path     string
		expected int
	}{
		{"Root endpoint", "GET", "/", http.StatusOK},
		{"Health check", "GET", "/api/health", http.StatusOK},
		{"Hello World GET", "GET", "/api/hello-world", http.StatusOK},
		{"Not found", "GET", "/api/nonexistent", http.StatusNotFound},
		{"Method not allowed", "PUT", "/api/hello-world", http.StatusMethodNotAllowed},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// リクエストを作成
			req, err := http.NewRequest(tc.method, tc.path, nil)
			assert.NoError(t, err)

			// レスポンスレコーダーを作成
			rr := httptest.NewRecorder()

			// ルーターにリクエストを送信
			r.ServeHTTP(rr, req)

			// ステータスコードを確認
			assert.Equal(t, tc.expected, rr.Code)
		})
	}
}

// TestRouterMiddleware ルーターのミドルウェアテスト
func TestRouterMiddleware(t *testing.T) {
	// ハンドラーを作成
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを作成
	r := NewRouter(healthHandler, helloWorldHandler)

	// テストリクエストを作成
	req, err := http.NewRequest("GET", "/api/health", nil)
	assert.NoError(t, err)

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ルーターにリクエストを送信
	r.ServeHTTP(rr, req)

	// レスポンスヘッダーを確認（ミドルウェアが適用されていることを確認）
	assert.Equal(t, http.StatusOK, rr.Code)
	assert.NotEmpty(t, rr.Header().Get("Content-Type"))
} 