package test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/handler"
	"backend/router"
	httpExpect "github.com/gavv/httpexpect/v2"
)

// TestHealthCheckIntegration ヘルスチェックエンドポイントの統合テスト
func TestHealthCheckIntegration(t *testing.T) {
	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// テストサーバーを作成
	server := httptest.NewServer(r)
	defer server.Close()

	// HTTPExpectを使用してテスト
	e := httpExpect.New(t, server.URL)

	// ヘルスチェックエンドポイントをテスト
	e.GET("/api/health").
		Expect().
		Status(http.StatusOK).
		JSON().Object().
		ValueEqual("status", "healthy").
		ContainsKey("timestamp")
}

// TestHelloWorldIntegration Hello Worldエンドポイントの統合テスト
func TestHelloWorldIntegration(t *testing.T) {
	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// テストサーバーを作成
	server := httptest.NewServer(r)
	defer server.Close()

	// HTTPExpectを使用してテスト
	e := httpExpect.New(t, server.URL)

	// GET /api/hello-world をテスト
	e.GET("/api/hello-world").
		Expect().
		Status(http.StatusOK).
		JSON().Object().
		ValueEqual("status", "success").
		ValueEqual("message", "Hello World message retrieved successfully").
		ContainsKey("timestamp").
		ContainsKey("data")
}

// TestHelloWorldMessagesIntegration Hello Worldメッセージエンドポイントの統合テスト
func TestHelloWorldMessagesIntegration(t *testing.T) {
	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// テストサーバーを作成
	server := httptest.NewServer(r)
	defer server.Close()

	// HTTPExpectを使用してテスト
	e := httpExpect.New(t, server.URL)

	// GET /api/hello-world/messages をテスト（データベースエラーを期待）
	e.GET("/api/hello-world/messages").
		Expect().
		Status(http.StatusInternalServerError)
}

// TestNotFoundIntegration 404エンドポイントの統合テスト
func TestNotFoundIntegration(t *testing.T) {
	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// テストサーバーを作成
	server := httptest.NewServer(r)
	defer server.Close()

	// HTTPExpectを使用してテスト
	e := httpExpect.New(t, server.URL)

	// 存在しないエンドポイントをテスト
	e.GET("/api/nonexistent").
		Expect().
		Status(http.StatusNotFound)
}

// TestMethodNotAllowedIntegration 405エンドポイントの統合テスト
func TestMethodNotAllowedIntegration(t *testing.T) {
	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// テストサーバーを作成
	server := httptest.NewServer(r)
	defer server.Close()

	// HTTPExpectを使用してテスト
	e := httpExpect.New(t, server.URL)

	// 許可されていないメソッドをテスト
	e.PUT("/api/hello-world").
		Expect().
		Status(http.StatusMethodNotAllowed)
}

// TestRootEndpointIntegration ルートエンドポイントの統合テスト
func TestRootEndpointIntegration(t *testing.T) {
	// ハンドラー初期化
	healthHandler := handler.NewHealthHandler(nil)
	helloWorldHandler := handler.NewHelloWorldHandler(nil)

	// ルーターを設定
	r := router.NewRouter(healthHandler, helloWorldHandler)

	// テストサーバーを作成
	server := httptest.NewServer(r)
	defer server.Close()

	// HTTPExpectを使用してテスト
	e := httpExpect.New(t, server.URL)

	// ルートエンドポイントをテスト
	e.GET("/").
		Expect().
		Status(http.StatusOK).
		JSON().Object().
		ValueEqual("status", "success").
		ValueEqual("message", "Go + Chi Starter Project API").
		ContainsKey("timestamp")
} 