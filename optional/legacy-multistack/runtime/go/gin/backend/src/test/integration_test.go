package test

import (
	"backend/config"
	"backend/router"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// setupIntegrationTestRouter は統合テスト用のルーターを設定します
func setupIntegrationTestRouter() *gin.Engine {
	// テスト用の設定
	cfg := config.LoadTestConfig()

	// 実際のDB接続
	db, err := config.NewDatabase(cfg)
	if err != nil {
		// DB接続に失敗した場合はログを出力してスキップ
		fmt.Printf("Database connection failed: %v\n", err)
		return nil
	}

	// ルーターを設定
	return router.SetupRouter(db)
}

// TestIntegrationHelloWorldPostEndpoint は実際のDBを使用したPOST /api/hello-worldエンドポイントの統合テスト
func TestIntegrationHelloWorldPostEndpoint(t *testing.T) {
	// テストモードに設定
	gin.SetMode(gin.TestMode)

	// ルーターを設定
	r := setupIntegrationTestRouter()
	if r == nil {
		t.Skip("Skipping integration test: Database connection failed")
	}

	// テストデータ
	testData := `{"name": "Integration Test User"}`

	// テストリクエストを作成
	req, err := http.NewRequest("POST", "/api/hello-world", strings.NewReader(testData))
	req.Header.Set("Content-Type", "application/json")
	assert.NoError(t, err)

	// レスポンスレコーダーを作成
	w := httptest.NewRecorder()

	// リクエストを実行
	r.ServeHTTP(w, req)

	// ステータスコードを確認
	assert.Equal(t, http.StatusOK, w.Code)

	// レスポンスボディを解析
	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	// レスポンスの内容を確認
	assert.Equal(t, "Integration Test User", response["name"])
	assert.Equal(t, "Hello, Integration Test User!", response["message"])
	assert.NotNil(t, response["id"])
	assert.NotNil(t, response["created_at"])
	assert.NotNil(t, response["updated_at"])
}

// TestIntegrationHelloWorldPostEndpointMultiple は複数のPOSTリクエストの統合テスト
func TestIntegrationHelloWorldPostEndpointMultiple(t *testing.T) {
	// テストモードに設定
	gin.SetMode(gin.TestMode)

	// ルーターを設定
	r := setupIntegrationTestRouter()
	if r == nil {
		t.Skip("Skipping integration test: Database connection failed")
	}

	// 複数のテストデータ
	testNames := []string{"Alice", "Bob", "Charlie"}

	for _, name := range testNames {
		t.Run("Test_"+name, func(t *testing.T) {
			testData := `{"name": "` + name + `"}`

			// テストリクエストを作成
			req, err := http.NewRequest("POST", "/api/hello-world", strings.NewReader(testData))
			req.Header.Set("Content-Type", "application/json")
			assert.NoError(t, err)

			// レスポンスレコーダーを作成
			w := httptest.NewRecorder()

			// リクエストを実行
			r.ServeHTTP(w, req)

			// ステータスコードを確認
			assert.Equal(t, http.StatusOK, w.Code)

			// レスポンスボディを解析
			var response map[string]interface{}
			err = json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)

			// レスポンスの内容を確認
			assert.Equal(t, name, response["name"])
			assert.Equal(t, "Hello, "+name+"!", response["message"])
		})
	}
}

// TestIntegrationDatabaseConnection はデータベース接続の統合テスト
func TestIntegrationDatabaseConnection(t *testing.T) {
	// テスト用の設定
	cfg := config.LoadTestConfig()

	// 実際のDB接続
	db, err := config.NewDatabase(cfg)
	if err != nil {
		t.Skip("Skipping database connection test: Database connection failed")
	}
	defer db.Close()

	// 接続テスト
	err = db.DB.Ping()
	assert.NoError(t, err, "Database ping should succeed")
}

// TestIntegrationDatabaseQuery はデータベースクエリの統合テスト
func TestIntegrationDatabaseQuery(t *testing.T) {
	// テスト用の設定
	cfg := config.LoadTestConfig()

	// 実際のDB接続
	db, err := config.NewDatabase(cfg)
	if err != nil {
		t.Skip("Skipping database query test: Database connection failed")
	}
	defer db.Close()

	// テーブル存在確認クエリ
	query := `SELECT EXISTS (
		SELECT FROM information_schema.tables 
		WHERE table_schema = 'public' 
		AND table_name = 'hello_world_messages'
	)`

	var exists bool
	err = db.DB.QueryRow(query).Scan(&exists)
	assert.NoError(t, err, "Table existence query should succeed")
	assert.True(t, exists, "hello_world_messages table should exist")
}

// TestIntegrationFullWorkflow は完全なワークフローの統合テスト
func TestIntegrationFullWorkflow(t *testing.T) {
	// テストモードに設定
	gin.SetMode(gin.TestMode)

	// ルーターを設定
	r := setupIntegrationTestRouter()
	if r == nil {
		t.Skip("Skipping integration test: Database connection failed")
	}

	// 1. ヘルスチェック
	t.Run("Health_Check", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/api/health", nil)
		assert.NoError(t, err)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	// 2. Hello World GET
	t.Run("Hello_World_GET", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/api/hello-world", nil)
		assert.NoError(t, err)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	// 3. Hello World POST
	t.Run("Hello_World_POST", func(t *testing.T) {
		testData := `{"name": "Workflow Test User"}`
		req, err := http.NewRequest("POST", "/api/hello-world", strings.NewReader(testData))
		req.Header.Set("Content-Type", "application/json")
		assert.NoError(t, err)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err = json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Workflow Test User", response["name"])
	})

	// 4. Swagger UI
	t.Run("Swagger_UI", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/swagger/index.html", nil)
		assert.NoError(t, err)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		// Swaggerが生成されていない場合は404を期待
		if w.Code == http.StatusNotFound {
			t.Skip("Skipping test: Swagger documentation not generated")
		}

		assert.Equal(t, http.StatusOK, w.Code)
	})
}
