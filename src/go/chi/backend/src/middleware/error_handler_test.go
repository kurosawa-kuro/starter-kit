package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
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
	assert.NoError(t, err)

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラーを実行
	handler.ServeHTTP(rr, req)

	// ステータスコードを確認
	assert.Equal(t, http.StatusInternalServerError, rr.Code)

	// レスポンスボディを確認
	assert.Contains(t, rr.Body.String(), "Internal Server Error")
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
	assert.NoError(t, err)

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラーを実行
	handler.ServeHTTP(rr, req)

	// ステータスコードを確認
	assert.Equal(t, http.StatusOK, rr.Code)

	// レスポンスボディを確認
	assert.Equal(t, "OK", rr.Body.String())
} 