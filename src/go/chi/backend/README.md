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
- PostgreSQL 15+ (オプション)
- Docker 20.10+ (オプション)

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
# .envファイルを作成
cat > .env << EOF
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=sampleuser
DB_PASSWORD=samplepass
DB_NAME=sampledb
JWT_SECRET=your_jwt_secret
EOF
```

### 4. データベースのセットアップ（オプション）

```bash
# PostgreSQLに接続
psql -h localhost -U sampleuser -d sampledb

# マイグレーション実行
\i src/db/migrations/001_create_hello_world_messages.sql
```

### 5. アプリケーションの起動

```bash
cd src
go run main.go
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

### テストの実行

```bash
# 全テスト実行
go test ./...

# カバレッジ付きテスト
go test -cover ./...

# 特定のテスト実行
go test ./test -v
```

## 🐳 Docker

### Dockerイメージのビルド

```bash
docker build -t go-chi-starter .
```

### Dockerコンテナの起動

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
│   └── migrations/   # マイグレーションファイル
├── docs/             # Swagger文書（自動生成）
├── main.go           # アプリケーションエントリーポイント
├── go.mod            # Goモジュール定義
└── go.sum            # 依存関係チェックサム
```

## 🔧 開発

### 開発サーバーの起動

```bash
# ホットリロード（air使用）
air

# 通常起動
go run main.go
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

## 📞 サポート

質問や問題がある場合は、Issueを作成してください。

---

**Go + Chi スタータープロジェクト** - 軽量で高速なRESTful API開発のためのベースライン 