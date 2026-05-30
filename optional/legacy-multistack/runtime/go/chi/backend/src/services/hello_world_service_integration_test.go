package services

import (
	"database/sql"
	"testing"
	"time"

	"backend/models"

	_ "github.com/lib/pq"
)

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

func TestCreateAndGetHelloWorldIntegration(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	service := NewHelloWorldService(db)

	// 1. Create
	req := &models.HelloWorldRequest{Name: "IntegrationTest"}
	msg, err := service.CreateHelloWorld(req)
	if err != nil {
		t.Fatalf("CreateHelloWorld失敗: %v", err)
	}
	if msg.Name != "IntegrationTest" {
		t.Errorf("Name不一致: got %s", msg.Name)
	}

	// 2. GetAll
	messages, err := service.GetHelloWorldMessages()
	if err != nil {
		t.Fatalf("GetHelloWorldMessages失敗: %v", err)
	}
	found := false
	for _, m := range messages {
		if m.ID == msg.ID {
			found = true
			break
		}
	}
	if !found {
		t.Error("作成したメッセージが一覧に存在しない")
	}

	// 3. GetByID
	got, err := service.GetHelloWorldMessageByID(msg.ID)
	if err != nil {
		t.Fatalf("GetHelloWorldMessageByID失敗: %v", err)
	}
	if got.Name != "IntegrationTest" {
		t.Errorf("GetByIDのName不一致: got %s", got.Name)
	}

	// 4. 後始末
	_, err = db.Exec("DELETE FROM hello_world_messages WHERE id = $1", msg.ID)
	if err != nil {
		t.Errorf("テストデータ削除失敗: %v", err)
	}
}
