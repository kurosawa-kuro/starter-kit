# Go + Gin スタータープロジェクト作成仕様書

## 概要

このドキュメントは、Go + Gin スタータープロジェクトの作成仕様を逆算したものです。他のプログラミング言語やフレームワークへの移植時に参考として活用できます。

## 🎯 プロジェクト要件

### 基本要件
- **言語**: Go 1.21.4+
- **フレームワーク**: Gin (Web Framework)
- **データベース**: PostgreSQL (オプション)
- **文書化**: Swagger/OpenAPI
- **テスト**: testify
- **アーキテクチャ**: クリーンアーキテクチャ（Controller-Service Pattern）

### 機能要件
1. **RESTful API**: 基本的なCRUD操作
2. **ヘルスチェック**: アプリケーション状態監視
3. **エラーハンドリング**: 統一されたエラーレスポンス
4. **モックモード**: データベースなしでの動作
5. **環境設定**: 柔軟な環境変数管理
6. **ログ出力**: 構造化されたログ
7. **API文書**: 自動生成されるSwagger文書

## 📁 プロジェクト構造仕様

### ディレクトリ構造
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
│   └── response.go   # レスポンス構造体
├── router/           # ルーティング
│   └── router.go     # ルーター設定
├── services/         # ビジネスロジック（Service層）
│   └── hello_world_service.go # Hello Worldサービス
├── utils/            # ユーティリティ
│   ├── constants.go  # 定数定義
│   └── mock.go       # モックデータ
├── docs/             # Swagger文書（自動生成）
├── main.go           # アプリケーションエントリーポイント
├── go.mod            # Goモジュール定義
└── go.sum            # 依存関係チェックサム
```

### ファイル命名規則
- **ハンドラー**: `{resource}_handler.go`
- **サービス**: `{resource}_service.go`
- **モデル**: `{type}.go` (response.go, request.go等)
- **設定**: `{purpose}.go` (config.go, database.go等)

## 🏗️ アーキテクチャ仕様

### レイヤー構造
1. **Handler層**: HTTPリクエスト/レスポンス処理
2. **Service層**: ビジネスロジック
3. **Model層**: データ構造定義
4. **Config層**: 設定管理
5. **Utils層**: 共通ユーティリティ

### 依存関係の方向
```
Handler → Service → Model
    ↓
Middleware → Utils
    ↓
Config
```

## 📋 実装仕様

### 1. 設定管理仕様

#### 環境変数定義
```go
type Config struct {
    Port      string // サーバーポート
    DBHost    string // データベースホスト
    DBPort    string // データベースポート
    DBUser    string // データベースユーザー
    DBPass    string // データベースパスワード
    DBName    string // データベース名
    JWTSecret string // JWT秘密鍵
}
```

#### 環境変数マッピング
| 環境変数 | デフォルト値 | 説明 |
|---------|-------------|------|
| `PORT` | `8080` | サーバーポート |
| `DB_HOST` | `localhost` | データベースホスト |
| `DB_PORT` | `5432` | データベースポート |
| `DB_USER` | `sampleuser` | データベースユーザー |
| `DB_PASSWORD` | `samplepass` | データベースパスワード |
| `DB_NAME` | `sampledb` | データベース名 |
| `JWT_SECRET` | `your_jwt_secret` | JWT秘密鍵 |

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

### 3. APIエンドポイント仕様

#### エンドポイント一覧
| メソッド | パス | 説明 | レスポンス |
|---------|------|------|-----------|
| GET | `/` | ルートエンドポイント | アプリケーション情報 |
| GET | `/api/health` | ヘルスチェック | アプリケーション状態 |
| GET | `/api/hello-world` | Hello World取得 | Hello Worldメッセージ |
| POST | `/api/hello-world` | Hello World作成 | 作成されたメッセージ |
| GET | `/swagger/*` | Swagger UI | API文書 |

#### ルーティング仕様
- **APIグループ**: `/api` プレフィックス
- **バージョニング**: 必要に応じて `/api/v1` 形式
- **エンドポイント命名**: kebab-case形式

### 4. エラーハンドリング仕様

#### エラー種別
- **validation_error**: バリデーションエラー
- **database_error**: データベースエラー
- **internal_error**: 内部サーバーエラー
- **not_found**: リソース未発見

#### エラーハンドリングミドルウェア
```go
func ErrorHandler() gin.HandlerFunc {
    return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
        // エラーレスポンス生成
    })
}
```

### 5. データベース仕様

#### 接続設定
- **ドライバー**: PostgreSQL (lib/pq)
- **接続プール**: 最大25接続
- **タイムアウト**: 5秒
- **SSL**: 無効（開発環境）

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

### 6. モックモード仕様

#### モックデータ構造
```go
type MockData struct {
    // モックデータ管理
}

func (m *MockData) GetMockHelloWorldMessage(name string) *HelloWorldMessage {
    // モックデータ生成
}
```

#### モックモード判定
```go
if s.db == nil || s.db.DB == nil {
    return s.mockData.GetMockHelloWorldMessage(name), nil
}
```

### 7. ログ仕様

#### ログレベル
- **INFO**: 一般的な情報
- **WARN**: 警告（データベース接続失敗など）
- **ERROR**: エラー（サーバー起動失敗など）

#### ログ形式
```
2025/07/26 01:55:22 🚀 Hello World API starting on port 8080
2025/07/26 01:55:22 📖 API Documentation: http://localhost:8080/swagger/index.html
2025/07/26 01:55:22 🔗 Health Check: http://localhost:8080/api/health
```

### 8. テスト仕様

#### テスト構造
- **単体テスト**: モックデータ使用
- **統合テスト**: 実際のデータベース使用
- **E2Eテスト**: 完全なワークフロー

#### テストカバレッジ
- **ハンドラー**: 100%
- **サービス**: 100%
- **設定**: 100%
- **ユーティリティ**: 100%

## 🔧 開発環境仕様

### 必要なツール
- **Go**: 1.21.4+
- **PostgreSQL**: 15+ (オプション)
- **Docker**: 20.10+ (オプション)
- **Make**: ビルド自動化

### 依存関係
```go
require (
    github.com/gin-gonic/gin v1.10.1
    github.com/lib/pq v1.10.9
    github.com/stretchr/testify v1.10.0
    github.com/swaggo/files v1.0.1
    github.com/swaggo/gin-swagger v1.6.0
)
```

## 🚀 デプロイメント仕様

### ビルド設定
- **開発ビルド**: `go build -o bin/app main.go`
- **本番ビルド**: `CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app main.go`

### Docker設定
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

## 📊 パフォーマンス仕様

### レスポンス時間
- **ヘルスチェック**: < 1ms
- **Hello World GET**: < 1ms
- **Hello World POST**: < 5ms (データベースあり)
- **Hello World POST**: < 1ms (モックモード)

### リソース使用量
- **メモリ**: < 50MB
- **CPU**: 低使用率
- **ディスク**: < 100MB

## 🔒 セキュリティ仕様

### 入力検証
- **JSONバリデーション**: 必須フィールドチェック
- **SQLインジェクション対策**: プリペアドステートメント使用
- **XSS対策**: 出力エスケープ

### 認証・認可
- **JWT**: トークンベース認証
- **CORS**: クロスオリジン設定
- **Rate Limiting**: レート制限（将来実装）

## 📈 監視・メトリクス仕様

### ヘルスチェック
- **エンドポイント**: `/api/health`
- **レスポンス**: アプリケーション状態
- **依存関係**: データベース接続状態

### ログ監視
- **構造化ログ**: JSON形式
- **ログレベル**: INFO, WARN, ERROR
- **ログ出力**: 標準出力

## 🔄 CI/CD仕様

### ビルドパイプライン
1. **依存関係インストール**: `go mod download`
2. **テスト実行**: `go test ./...`
3. **ビルド**: `go build -o bin/app main.go`
4. **Dockerイメージ作成**: `docker build -t app .`

### テストパイプライン
1. **単体テスト**: `go test ./...`
2. **統合テスト**: `make test`
3. **カバレッジ**: `go test -cover ./...`

## 📝 ドキュメント仕様

### API文書
- **Swagger**: 自動生成
- **エンドポイント**: 全エンドポイント文書化
- **リクエスト/レスポンス**: 例付き

### README
- **プロジェクト概要**: 機能説明
- **セットアップ手順**: 詳細な手順
- **API仕様**: エンドポイント一覧
- **開発ガイド**: 開発者向け情報

## 🎯 移植時の考慮事項

### 言語固有の実装
1. **エラーハンドリング**: 言語固有の例外処理
2. **依存関係管理**: 言語固有のパッケージ管理
3. **テストフレームワーク**: 言語固有のテストツール
4. **ビルドツール**: 言語固有のビルドシステム

### 共通実装パターン
1. **レイヤー分離**: Handler-Service-Model
2. **設定管理**: 環境変数ベース
3. **エラーレスポンス**: 統一形式
4. **ログ出力**: 構造化ログ
5. **テスト**: 単体・統合・E2E

### 移植チェックリスト
- [ ] プロジェクト構造の作成
- [ ] 設定管理の実装
- [ ] エラーハンドリングの実装
- [ ] レスポンス形式の統一
- [ ] データベース接続の実装
- [ ] モックモードの実装
- [ ] テストの実装
- [ ] ログ出力の実装
- [ ] API文書の生成
- [ ] Docker化
- [ ] CI/CD設定

## 📚 参考資料

- [Gin Framework Documentation](https://gin-gonic.com/docs/)
- [Go Best Practices](https://golang.org/doc/effective_go.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [REST API Design](https://restfulapi.net/)
- [Swagger Documentation](https://swagger.io/docs/)

---

このドキュメントは、Go + Gin スタータープロジェクトの作成仕様を逆算したものです。他のプログラミング言語やフレームワークへの移植時に、この仕様を参考にして同等の機能を実装してください。
