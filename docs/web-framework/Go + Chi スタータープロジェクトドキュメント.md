# Go + Chi スタータープロジェクト作成仕様書

## 概要

このドキュメントは、**Go + Chi** を用いたスタータープロジェクトの作成仕様をまとめたものです。Go + Gin 版からの移行ポイントを反映しており、他言語・他フレームワークでスタータープロジェクトを作成する際の参考資料としても利用できます。

---

## 🎯 プロジェクト要件

### 基本要件

* **言語**: Go 1.21.4+
* **フレームワーク**: Chi (v5) — 軽量 HTTP ルーター
* **データベース**: PostgreSQL (オプション)
* **文書化**: Swagger / OpenAPI
* **テスト**: testify
* **アーキテクチャ**: クリーンアーキテクチャ（Controller‑Service Pattern）

### 機能要件

1. **RESTful API**: 基本的な CRUD 操作
2. **ヘルスチェック**: アプリケーション状態監視
3. **エラーハンドリング**: 統一されたエラーレスポンス
4. **環境設定**: 柔軟な環境変数管理
5. **ログ出力**: 構造化されたログ
6. **API 文書**: 自動生成される Swagger 文書

---

## 📁 プロジェクト構造仕様

### ディレクトリ構造

```text
src/
├── config/            # 設定管理
│   ├── config.go      # アプリケーション設定
│   └── database.go    # データベース設定
├── handler/           # HTTP ハンドラー（Controller 層）
│   ├── health.go      # ヘルスチェック
│   └── hello_world.go # Hello World API
├── middleware/        # ミドルウェア
│   └── error_handler.go # エラーハンドリング
├── models/            # データモデル
│   └── response.go    # レスポンス構造体
├── router/            # ルーティング
│   └── router.go      # ルーター設定
├── services/          # ビジネスロジック（Service 層）
│   └── hello_world_service.go # Hello World サービス
├── utils/             # ユーティリティ
│   └── constants.go   # 定数定義
├── docs/              # Swagger 文書（自動生成）
├── main.go            # アプリケーションエントリーポイント
├── go.mod             # Go モジュール定義
└── go.sum             # 依存関係チェックサム
```

> **備考**: Gin 版と同一の構造を維持しつつ、router 実装のみ Chi に置き換えています。

### ファイル命名規則

* **ハンドラー**: `{resource}_handler.go`
* **サービス**: `{resource}_service.go`
* **モデル**: `{type}.go` (`response.go`, `request.go` 等)
* **設定**: `{purpose}.go` (`config.go`, `database.go` 等)

---

## 🏗️ アーキテクチャ仕様

### レイヤー構造

1. **Handler 層**: HTTP リクエスト／レスポンス処理
2. **Service 層**: ビジネスロジック
3. **Model 層**: データ構造定義
4. **Config 層**: 設定管理
5. **Utils 層**: 共通ユーティリティ

### 依存関係の方向

```text
Handler  →  Service  →  Model
    ↓
Middleware → Utils
    ↓
Config
```

---

## 📋 実装仕様

### 1. 設定管理仕様

#### 環境変数定義

```go
package config

type Config struct {
    Port      string // サーバーポート
    DBHost    string // データベースホスト
    DBPort    string // データベースポート
    DBUser    string // データベースユーザー
    DBPass    string // データベースパスワード
    DBName    string // データベース名
    JWTSecret string // JWT 秘密鍵
}
```

#### 環境変数マッピング

| 環境変数          | デフォルト値            | 説明          |
| ------------- | ----------------- | ----------- |
| `PORT`        | `8080`            | サーバーポート     |
| `DB_HOST`     | `localhost`       | データベースホスト   |
| `DB_PORT`     | `5432`            | データベースポート   |
| `DB_USER`     | `sampleuser`      | データベースユーザー  |
| `DB_PASSWORD` | `samplepass`      | データベースパスワード |
| `DB_NAME`     | `sampledb`        | データベース名     |
| `JWT_SECRET`  | `your_jwt_secret` | JWT 秘密鍵     |

### 2. レスポンス形式仕様

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

#### 統一レスポンス構造体

```go
package models

type BaseResponse struct {
    Status    string    `json:"status"`
    Message   string    `json:"message"`
    Timestamp time.Time `json:"timestamp"`
}

type ErrorResponse struct {
    Status    string    `json:"status"`
    Error     string    `json:"error"`
    Message   string    `json:"message"`
    Timestamp time.Time `json:"timestamp"`
}
```

### 3. API エンドポイント仕様

| メソッド | パス                 | 説明             | レスポンス             |
| ---- | ------------------ | -------------- | ----------------- |
| GET  | `/`                | ルートエンドポイント     | アプリケーション情報        |
| GET  | `/api/health`      | ヘルスチェック        | アプリケーション状態        |
| GET  | `/api/hello-world` | Hello World 取得 | Hello World メッセージ |
| POST | `/api/hello-world` | Hello World 作成 | 作成されたメッセージ        |
| GET  | `/swagger/*`       | Swagger UI     | API 文書            |

#### ルーティング仕様

* **API グループ**: `/api` プレフィックス
* **バージョニング**: 必要に応じて `/api/v1` 形式
* **エンドポイント命名**: kebab-case 形式

---

### 4. エラーハンドリング仕様

#### エラー種別

* **validation\_error**: バリデーションエラー
* **database\_error**: データベースエラー
* **internal\_error**: 内部サーバーエラー
* **not\_found**: リソース未発見

#### エラーハンドリングミドルウェア (Chi)

```go
package middleware

import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/go-chi/chi/v5/middleware"
    "your_project/src/models"
)

func ErrorHandler(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if rec := recover(); rec != nil {
                res := models.ErrorResponse{
                    Status:    "error",
                    Error:     "internal_error",
                    Message:   "Internal Server Error",
                    Timestamp: time.Now(),
                }
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusInternalServerError)
                _ = json.NewEncoder(w).Encode(res)
            }
        }()
        next.ServeHTTP(w, r)
    })
}
```

> **補足**: 追加で `middleware.Recoverer` も合わせて使用します。

---

### 5. ルーター実装例

```go
package router

import (
    "net/http"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"

    "your_project/src/handler"
    "your_project/src/middleware" // 自作エラーハンドラ
)

func NewRouter() http.Handler {
    r := chi.NewRouter()

    // 公式ミドルウェア
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)

    // カスタムミドルウェア
    r.Use(middleware.ErrorHandler)

    // ルート
    r.Get("/", handler.RootHandler)

    // API グループ
    r.Route("/api", func(api chi.Router) {
        api.Get("/health", handler.HealthCheckHandler)
        api.Get("/hello-world", handler.GetHelloWorldHandler)
        api.Post("/hello-world", handler.CreateHelloWorldHandler)
    })

    // Swagger
    r.Get("/swagger/*", handler.SwaggerHandler)

    return r
}
```

---

### 6. データベース仕様

#### 接続設定

* **ドライバー**: PostgreSQL (`github.com/lib/pq`)
* **接続プール**: 最大 25 接続
* **タイムアウト**: 5 秒
* **SSL**: 無効（開発環境）

#### テーブル定義

```sql
CREATE TABLE hello_world_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```



### 8. ログ仕様

* Chi 自体は Logger を備えていないため、`github.com/go-chi/httplog` などの構造化ログライブラリを推奨。
* 例: `httplog.NewLogger("go-chi-sample", httplog.Options{JSON: true})`

---

### 9. テスト仕様

* **単体テスト**: テストデータ使用
* **統合テスト**: 実 DB 使用
* **E2E テスト**: HTTP クライアントでフローをテスト
* **カバレッジ目標**: 全層 100%

---

## 🔧 開発環境仕様

### 必要なツール

* **Go**: 1.21.4+
* **PostgreSQL**: 15+
* **Docker**: 20.10+ (オプション)
* **Make**: ビルド自動化

### 依存関係 (`go.mod` 抜粋)

```go
require (
    github.com/go-chi/chi/v5 v5.0.9
    github.com/go-chi/chi/v5/middleware v5.0.9 // インポート例示
    github.com/lib/pq v1.10.9
    github.com/stretchr/testify v1.10.0
    github.com/swaggo/files v1.0.1
    github.com/swaggo/http-swagger v1.6.0
)
```

> **注意**: Gin 用の `gin-swagger` は Chi では使用しないため、`http-swagger` を利用します。

---

## 🚀 デプロイメント仕様

### ビルド設定

* **開発ビルド**: `go build -o bin/app main.go`
* **本番ビルド**: `CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app main.go`

### Docker 設定

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

---

## 📊 パフォーマンス仕様

| エンドポイント                 | 目標レスポンス時間                    |
| ----------------------- | ---------------------------- |
| `/api/health`           | < 1 ms                       |
| `GET /api/hello-world`  | < 1 ms                       |
| `POST /api/hello-world` | < 5 ms (DB 有) / < 1 ms (モック) |

* **メモリ**: < 50 MB
* **CPU**: 低使用率
* **ディスク**: < 100 MB

---

## 🔒 セキュリティ仕様

* **JSON バリデーション**: 必須フィールドチェック
* **SQL インジェクション対策**: プリペアドステートメント
* **XSS 対策**: エスケープ
* **JWT 認証**: トークンベース
* **CORS**: 設定必須
* **Rate Limiting**: 将来実装

---

## 📈 監視・メトリクス仕様

* **ヘルスチェック**: `/api/health`
* **ログ監視**: JSON 構造化ログ

---

## 🔄 CI/CD 仕様

1. `go mod download`
2. `go test ./...`
3. `go build -o bin/app main.go`
4. `docker build -t app .`

---

## 📝 ドキュメント仕様

* **Swagger**: 自動生成 (`swag init`)
* **README**: プロジェクト概要 / セットアップ手順 / API 仕様

---

## 🎯 移植時の考慮事項

* Gin から Chi への違いは全てルーター＆ミドルウェア層で閉じ込める
* ハンドラーのシグネチャが `func(w http.ResponseWriter, r *http.Request)` に一本化される点に注意

---

この仕様書は Go + Chi 版スタータープロジェクトのベースラインです。他言語・他フレームワークへ移植する際には、本書を参考に Controller‑Service Pattern、設定管理、統一エラーレスポンスなどのベストプラクティスを適用してください。
