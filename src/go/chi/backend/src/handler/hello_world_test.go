package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestGetHelloWorldHandler Hello Worldハンドラーのテスト
func TestGetHelloWorldHandler(t *testing.T) {
	// テスト用のハンドラーを作成
	handler := &HelloWorldHandler{}

	// テスト用のリクエストを作成
	req, err := http.NewRequest("GET", "/api/hello-world", nil)
	assert.NoError(t, err)

	// レスポンスレコーダーを作成
	rr := httptest.NewRecorder()

	// ハンドラーを実行
	handler.GetHelloWorldHandler(rr, req)

	// ステータスコードを確認
	assert.Equal(t, http.StatusOK, rr.Code)

	// レスポンスボディを確認（タイムスタンプは動的なので除外）
	var response map[string]interface{}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	assert.NoError(t, err)

	// 基本的なフィールドを確認
	assert.Equal(t, "success", response["status"])
	assert.Equal(t, "Hello World message retrieved successfully", response["message"])
	assert.NotNil(t, response["timestamp"])

	// dataフィールドを確認
	data, ok := response["data"].(map[string]interface{})
	assert.True(t, ok)
	assert.Equal(t, "Hello, World!", data["message"])
	assert.Equal(t, "1.0.0", data["version"])
	assert.NotNil(t, data["timestamp"])
}
