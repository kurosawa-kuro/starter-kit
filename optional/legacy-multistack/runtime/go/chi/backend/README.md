# Go + Chi スタータープロジェクト

Go + Chi フレームワークを使用したRESTful APIスタータープロジェクトです。

## 🚀 機能

- **RESTful API**: 基本的なCRUD操作
- **ヘルスチェック**: アプリケーション状態監視
- **エラーハンドリング**: 統一されたエラーレスポンス
- **環境設定**: 柔軟な環境変数管理
- **ログ出力**: 構造化されたログ
- **API文書**: Swagger/OpenAPI自動生成
- **データベース**: PostgreSQL対応（オプション）
- **テスト**: 単体・統合テスト対応

## 📋 必要条件

- Go 1.21.4+
- Docker 20.10+
- Docker Compose 2.0+

## 🛠️ セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd my-study/starter-project/src/go/chi/backend
```

### 2. 依存関係のインストール

```bash
cd src
go mod download
```

### 3. 環境変数の設定

```bash
# 開発環境用の環境変数ファイルを生成
make env-init ENV=development

# または、手動で.envファイルを作成
cat > .env << EOF
PORT=8080
DB_HOST=db
DB_PORT=5432
DB_USER=sampleuser
DB_PASSWORD=samplepass
DB_NAME=sampledb
JWT_SECRET=your_jwt_secret
EOF
```

### 4. Docker Composeで起動

```bash
# アプリケーションとデータベースを起動
make docker

# または、バックグラウンドで起動
make docker-bg
```

### 5. アプリケーションの確認

```bash
# ヘルスチェック
curl http://localhost:8080/api/health

# Hello World API
curl http://localhost:8080/api/hello-world
```

## 📚 API仕様

### エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/` | ルートエンドポイント |
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/hello-world` | Hello World取得 |
| POST | `/api/hello-world` | Hello World作成 |
| GET | `/api/hello-world/messages` | Hello Worldメッセージ一覧 |
| GET | `/api/hello-world/messages/{id}` | Hello Worldメッセージ取得（ID指定） |
| GET | `/swagger/*` | Swagger UI |

### レスポンス形式

#### 成功レスポンス
```json
{
  "status": "success",
  "message": "操作が成功しました",
  "timestamp": "2025-07-26T01:55:51.425125974+09:00",
  "data": { ... }
}
```

#### エラーレスポンス
```json
{
  "status": "error",
  "error": "validation_error",
  "message": "Validation failed",
  "timestamp": "2025-07-26T01:55:51.425125974+09:00"
}
```

## 🧪 テスト

### テスト支援ライブラリ

本プロジェクトでは、以下のテスト支援ライブラリを導入しています。

- **github.com/stretchr/testify**: 定番のアサーションライブラリ。直感的なassert文でテストが書けます。
- **github.com/gavv/httpexpect/v2**: HTTP E2Eテストを表現的に記述できます。APIのリクエスト・レスポンス検証に便利です。
- **github.com/steinfletcher/apitest**: OpenAPI仕様に準拠したAPIテストが可能です。

#### 依存追加方法

```bash
cd src
# 依存追加（既に導入済み）
go get github.com/stretchr/testify github.com/gavv/httpexpect/v2 github.com/steinfletcher/apitest
```

#### テスト実行方法

```bash
# 初回セットアップ（テスト用DBを起動）
make test-setup

# テスト実行（DBが起動していない場合は自動起動）
make test

# テストのみ実行（DBの起動・停止なし、高速）
make test-only

# テスト用DBの状態確認
make test-db-status

# テスト用DBを手動で起動
make test-db-up

# テスト用DBを手動で停止
make test-db-down

# 手動でテスト実行（srcディレクトリで）
cd src
go test ./...

# カバレッジ付きテスト実行
make test-coverage

# カバレッジレポート生成
make test-coverage-report

# HTMLカバレッジレポート生成
make test-coverage-html

#### サンプルコード

- **testify（アサーション）**

```go
package test

import (
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestAssertBasic(t *testing.T) {
    assert := assert.New(t)
    assert.Equal(123, 123, "数値が一致すること")
    assert.NotEqual(123, 456, "数値が異なること")
    assert.True(1 < 2, "1は2より小さい")
    assert.False(2 < 1, "2は1より小さくない")
    assert.Nil(nil, "nilであること")
    assert.NotNil(t, "tはnilではない")
}
```

- **httpexpect（HTTP E2Eテスト）**

```go
package test

import (
    "net/http"
    "net/http/httptest"
    "testing"
    httpExpect "github.com/gavv/httpexpect/v2"
)

func TestHelloWorldAPI(t *testing.T) {
    handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"message":"Hello, World!"}`))
    })
    srv := httptest.NewServer(handler)
    defer srv.Close()

    e := httpExpect.New(t, srv.URL)
    e.GET("/").
        Expect().
        Status(http.StatusOK).
        JSON().Object().
        ValueEqual("message", "Hello, World!")
}
```

- **apitest（OpenAPI準拠テスト）**

```go
package test

import (
    "net/http"
    "testing"
    "github.com/steinfletcher/apitest"
)

func TestHelloWorldOpenAPI(t *testing.T) {
    apitest.New().
        HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"message":"Hello, World!"}`))
        }).
        Get("/").
        Expect(t).
        Status(http.StatusOK).
        Body(`{"message":"Hello, World!"}`).
        End()
}
```

#### 既存APIに合わせたテスト実装例

- `src/test/hello_world_test.go` には、Hello World APIの単体テスト例が実装されています。
- 各APIエンドポイントに対して、上記サンプルを参考にテストを追加してください。

---

## 🐳 Docker

### Docker Composeでの起動

```bash
# アプリケーションとデータベースを起動
make docker

# バックグラウンドで起動
make docker-bg

# 停止
make docker-down
```

### 個別のDockerイメージビルド

```bash
docker build -t go-chi-starter .
```

### 個別のDockerコンテナ起動

```bash
docker run -p 8080:8080 go-chi-starter
```

## 📁 プロジェクト構造

```
src/
├── config/           # 設定管理
│   ├── config.go     # アプリケーション設定
│   └── database.go   # データベース設定
├── handler/          # HTTPハンドラー（Controller層）
│   ├── health.go     # ヘルスチェック
│   └── hello_world.go # Hello World API
├── middleware/       # ミドルウェア
│   └── error_handler.go # エラーハンドリング
├── models/           # データモデル
│   ├── response.go   # レスポンス構造体
│   └── hello_world.go # Hello Worldモデル
├── router/           # ルーティング
│   └── router.go     # ルーター設定
├── services/         # ビジネスロジック（Service層）
│   └── hello_world_service.go # Hello Worldサービス
├── utils/            # ユーティリティ
│   └── constants.go  # 定数定義
├── test/             # テスト
│   └── hello_world_test.go # Hello Worldテスト
├── db/               # データベース
│   ├── init.sql      # データベース初期化スクリプト
│   ├── migrations/   # マイグレーションファイル
│   └── queries/      # SQLクエリファイル
├── docs/             # Swagger文書（自動生成）
├── main.go           # アプリケーションエントリーポイント
├── go.mod            # Goモジュール定義
└── go.sum            # 依存関係チェックサム
```

## 🔧 開発

### 開発サーバーの起動

```bash
# Docker Composeで開発環境を起動
make docker

# ホットリロード（air使用、ローカル開発時）
make dev

# 通常起動（ローカル開発時）
make run
```

### Swagger文書の生成

```bash
# Swagger文書生成
swag init -g main.go

# Swagger UIアクセス
# http://localhost:8080/swagger/index.html
```

## 🚀 デプロイメント

### 本番ビルド

```bash
# Linux用バイナリ作成
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app main.go
```

### 環境変数設定

```bash
export PORT=8080
export DB_HOST=your-db-host
export DB_PORT=5432
export DB_USER=your-db-user
export DB_PASSWORD=your-db-password
export DB_NAME=your-db-name
export JWT_SECRET=your-secret-key
```

## 📊 パフォーマンス

- **レスポンス時間**: < 5ms（データベースなし）
- **メモリ使用量**: < 50MB
- **CPU使用率**: 低使用率

## 🔒 セキュリティ

- 入力バリデーション
- SQLインジェクション対策
- XSS対策
- CORS設定
- レート制限（将来実装予定）

## 🤝 貢献

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🐳 Docker前提の構成について

このプロジェクトは、Docker Composeを前提とした構成になっています。

### 主な特徴

- **PostgreSQL**: Dockerコンテナで提供
- **pgAdmin**: Webベースのデータベース管理ツール
- **環境分離**: 開発・テスト・本番環境の完全分離
- **簡単セットアップ**: `make docker` でアプリケーションとデータベースが同時起動

### 利用可能なサービス

| サービス | ポート | 説明 |
|---------|--------|------|
| Backend API | 8080 | メインアプリケーション |
| PostgreSQL | 15432 | データベース（WSL PostgreSQLと競合回避） |
| pgAdmin | 5050 | データベース管理ツール |

### テスト環境

テスト用のPostgreSQLコンテナ（ポート15434）は、初回セットアップ時に起動し、手動で停止するまで継続して動作します。これにより、テスト実行時の起動・停止の待機時間を削減できます。

**推奨ワークフロー:**
1. `make test-setup` - 初回のみ実行
2. `make test-only` - 以降のテスト実行（高速）
3. 開発終了時に `make test-db-down` - テスト用DBを停止

## 📞 サポート

質問や問題がある場合は、Issueを作成してください。

---

**Go + Chi スタータープロジェクト** - 軽量で高速なRESTful API開発のためのベースライン（Docker前提） 