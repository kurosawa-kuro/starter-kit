package config

import (
	"testing"
)

// TestDatabaseConfigMethods データベース設定メソッドのテスト
func TestDatabaseConfigMethods(t *testing.T) {
	// テスト用設定
	config := &Config{
		DBHost: "localhost",
		DBPort: "5432",
		DBUser: "testuser",
		DBPass: "testpass",
		DBName: "testdb",
	}

	dbConfig := NewDatabaseConfig(config)

	// GetConnectionStringのテスト
	connStr := dbConfig.GetConnectionString()
	expected := "host=localhost port=5432 user=testuser password=testpass dbname=testdb sslmode=disable"
	if connStr != expected {
		t.Errorf("Expected connection string '%s', got '%s'", expected, connStr)
	}

	// フィールドの検証
	if dbConfig.Host != "localhost" {
		t.Errorf("Expected Host 'localhost', got '%s'", dbConfig.Host)
	}
	if dbConfig.Port != "5432" {
		t.Errorf("Expected Port '5432', got '%s'", dbConfig.Port)
	}
	if dbConfig.User != "testuser" {
		t.Errorf("Expected User 'testuser', got '%s'", dbConfig.User)
	}
	if dbConfig.Password != "testpass" {
		t.Errorf("Expected Password 'testpass', got '%s'", dbConfig.Password)
	}
	if dbConfig.DBName != "testdb" {
		t.Errorf("Expected DBName 'testdb', got '%s'", dbConfig.DBName)
	}
	if dbConfig.SSLMode != "disable" {
		t.Errorf("Expected SSLMode 'disable', got '%s'", dbConfig.SSLMode)
	}
}

// TestDatabaseConfigConnect データベース接続のテスト
func TestDatabaseConfigConnect(t *testing.T) {
	// 統合テストとして実行
	config := &Config{
		DBHost: "localhost",
		DBPort: "15434", // テストDBのポート
		DBUser: "sampleuser",
		DBPass: "samplepass",
		DBName: "sampledb_test",
	}

	dbConfig := NewDatabaseConfig(config)

	// 接続テスト
	db, err := dbConfig.Connect()
	if err != nil {
		t.Fatalf("Database connection failed: %v", err)
	}
	defer dbConfig.Close(db)

	// 接続が有効かテスト
	if err := db.Ping(); err != nil {
		t.Errorf("Database ping failed: %v", err)
	}

	// 接続プール設定の確認
	stats := db.Stats()
	if stats.MaxOpenConnections != 25 {
		t.Errorf("Expected MaxOpenConnections 25, got %d", stats.MaxOpenConnections)
	}
}

// TestDatabaseConfigConnectError 接続エラーのテスト
func TestDatabaseConfigConnectError(t *testing.T) {
	// 無効な設定
	config := &Config{
		DBHost: "invalid-host",
		DBPort: "5432",
		DBUser: "invalid-user",
		DBPass: "invalid-pass",
		DBName: "invalid-db",
	}

	dbConfig := NewDatabaseConfig(config)

	// 接続エラーのテスト
	_, err := dbConfig.Connect()
	if err == nil {
		t.Error("Expected connection error, got nil")
	}
}

// TestDatabaseConfigClose データベース接続クローズのテスト
func TestDatabaseConfigClose(t *testing.T) {
	config := &Config{
		DBHost: "localhost",
		DBPort: "15434",
		DBUser: "sampleuser",
		DBPass: "samplepass",
		DBName: "sampledb_test",
	}

	dbConfig := NewDatabaseConfig(config)

	// 正常な接続を閉じる
	db, err := dbConfig.Connect()
	if err != nil {
		t.Fatalf("Database connection failed: %v", err)
	}

	// 接続を閉じる
	dbConfig.Close(db)

	// 既に閉じられた接続を再度閉じる（エラーハンドリングのテスト）
	dbConfig.Close(db)
}

// TestDatabaseConfigCloseNil  nil接続を閉じるテスト
func TestDatabaseConfigCloseNil(t *testing.T) {
	config := &Config{
		DBHost: "localhost",
		DBPort: "5432",
		DBUser: "testuser",
		DBPass: "testpass",
		DBName: "testdb",
	}

	dbConfig := NewDatabaseConfig(config)

	// nil接続を閉じる（パニックしないことを確認）
	dbConfig.Close(nil)
}

// TestDatabaseConfigConnectionStringVariations 接続文字列のバリエーションテスト
func TestDatabaseConfigConnectionStringVariations(t *testing.T) {
	tests := []struct {
		name     string
		config   *Config
		expected string
	}{
		{
			name: "Standard configuration",
			config: &Config{
				DBHost: "localhost",
				DBPort: "5432",
				DBUser: "user",
				DBPass: "pass",
				DBName: "db",
			},
			expected: "host=localhost port=5432 user=user password=pass dbname=db sslmode=disable",
		},
		{
			name: "Empty values",
			config: &Config{
				DBHost: "",
				DBPort: "",
				DBUser: "",
				DBPass: "",
				DBName: "",
			},
			expected: "host= port= user= password= dbname= sslmode=disable",
		},
		{
			name: "Special characters in password",
			config: &Config{
				DBHost: "localhost",
				DBPort: "5432",
				DBUser: "user",
				DBPass: "pass@word!",
				DBName: "db",
			},
			expected: "host=localhost port=5432 user=user password=pass@word! dbname=db sslmode=disable",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			dbConfig := NewDatabaseConfig(tt.config)
			connStr := dbConfig.GetConnectionString()
			if connStr != tt.expected {
				t.Errorf("Expected '%s', got '%s'", tt.expected, connStr)
			}
		})
	}
}

// TestDatabaseConfigConsistency 設定の一貫性テスト
func TestDatabaseConfigConsistency(t *testing.T) {
	config := &Config{
		DBHost: "localhost",
		DBPort: "5432",
		DBUser: "testuser",
		DBPass: "testpass",
		DBName: "testdb",
	}

	// 複数回作成して一貫性を確認
	dbConfig1 := NewDatabaseConfig(config)
	dbConfig2 := NewDatabaseConfig(config)

	connStr1 := dbConfig1.GetConnectionString()
	connStr2 := dbConfig2.GetConnectionString()

	if connStr1 != connStr2 {
		t.Error("Connection strings are not consistent between multiple instances")
	}

	if dbConfig1.SSLMode != dbConfig2.SSLMode {
		t.Error("SSLMode is not consistent between multiple instances")
	}
}
