# Go + Gin スタータープロジェクト

## 概要

このプロジェクトは、Go言語とGinフレームワークを使用したRESTful APIのスタータープロジェクトです。クリーンアーキテクチャの原則に従い、保守性と拡張性を重視して設計されています。

## 🚀 主な機能

- **RESTful API**: 標準的なHTTPメソッドをサポート
- **データベース統合**: PostgreSQLとの統合（オプション）
- **Swagger文書**: 自動生成されるAPI文書
- **エラーハンドリング**: 統一されたエラーレスポンス
- **モックモード**: データベースなしでも動作
- **ヘルスチェック**: アプリケーションの状態監視
- **環境設定**: 柔軟な環境変数による設定

## 📁 プロジェクト構造

```
src/
├── config/           # 設定管理
│   ├── config.go     # アプリケーション設定
│   └── database.go   # データベース設定
├── handler/          # HTTPハンドラー
│   ├── health.go     # ヘルスチェック
│   └── hello_world.go # Hello World API
├── middleware/       # ミドルウェア
│   └── error_handler.go # エラーハンドリング
├── models/           # データモデル
│   └── response.go   # レスポンス構造体
├── router/           # ルーティング
│   └── router.go     # ルーター設定
├── services/         # ビジネスロジック
│   └── hello_world_service.go # Hello Worldサービス
├── utils/            # ユーティリティ
│   ├── constants.go  # 定数定義
│   └── mock.go       # モックデータ
├── docs/             # Swagger文書（自動生成）
├── main.go           # アプリケーションエントリーポイント
├── go.mod            # Goモジュール定義
└── go.sum            # 依存関係チェックサム
```

## 🛠️ 技術スタック

- **言語**: Go 1.21.4+
- **フレームワーク**: Gin
- **データベース**: PostgreSQL（オプション）
- **文書化**: Swagger/OpenAPI
- **テスト**: testify

## 🚀 クイックスタート

### 前提条件

- Go 1.21.4以上
- PostgreSQL（オプション）

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd my-study/starter-project/go/gin/backend
```

### 2. 依存関係のインストール

```bash
cd src
go mod tidy
```

### 3. 環境変数の設定

```bash
# .envファイルを作成（オプション）
cp .env.example .env

# または環境変数を直接設定
export PORT=8080
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=sampleuser
export DB_PASSWORD=samplepass
export DB_NAME=sampledb
```

### 4. アプリケーションの起動

```bash
# 開発モード
go run main.go

# 本番モード
GIN_MODE=release go run main.go
```

### 5. 動作確認

```bash
# ヘルスチェック
curl http://localhost:8080/api/health

# Hello World API
curl http://localhost:8080/api/hello-world

# POSTリクエスト
curl -X POST http://localhost:8080/api/hello-world \
  -H "Content-Type: application/json" \
  -d '{"name": "Your Name"}'
```

## 📚 API エンドポイント

### ヘルスチェック
- `GET /api/health` - アプリケーションの健康状態を確認

### Hello World
- `GET /api/hello-world` - Hello Worldメッセージを取得
- `POST /api/hello-world` - 名前付きメッセージを作成

### 文書
- `GET /swagger/index.html` - Swagger UI

## 🔧 設定

### 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `PORT` | `8080` | サーバーポート |
| `DB_HOST` | `localhost` | データベースホスト |
| `DB_PORT` | `5432` | データベースポート |
| `DB_USER` | `sampleuser` | データベースユーザー |
| `DB_PASSWORD` | `samplepass` | データベースパスワード |
| `DB_NAME` | `sampledb` | データベース名 |
| `JWT_SECRET` | `your_jwt_secret` | JWT秘密鍵 |

### モックモード

データベースが利用できない場合、アプリケーションは自動的にモックモードで動作します。この場合、実際のデータベース操作の代わりにモックデータが返されます。

## 🧪 テスト

```bash
# srcディレクトリに移動してテストを実行
cd src

# テストの実行
go test ./...

# テストカバレッジ
go test -cover ./...

# ベンチマーク
go test -bench=. ./...

# 統合テストのみ実行
go test ./test
```

## 📦 ビルド

```bash
# 開発用ビルド
go build -o bin/app main.go

# 本番用ビルド
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/app main.go
```

## 🐳 Docker

```bash
# Dockerイメージのビルド
docker build -t hello-world-api .

# コンテナの実行
docker run -p 8080:8080 hello-world-api
```

## 🔍 ログ

アプリケーションは以下のログレベルをサポートしています：

- **INFO**: 一般的な情報
- **WARN**: 警告（データベース接続失敗など）
- **ERROR**: エラー（サーバー起動失敗など）

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆕 最近の改善点

### コード整理
- **共通モデルの統合**: レスポンス構造体を`models`パッケージに集約
- **定数の統一**: マジックナンバーと文字列を`utils/constants.go`に集約
- **モックデータの整理**: 重複していたモックレスポンスを`utils/mock.go`に集約
- **エラーハンドリングの統一**: 一貫したエラーレスポンス形式

### アーキテクチャの改善
- **依存関係の明確化**: 各レイヤーの責任を明確に分離
- **ミドルウェアの追加**: グローバルエラーハンドリングとバリデーション
- **設定の簡素化**: テスト用設定の重複コードを削除

### 保守性の向上
- **コメントの改善**: より詳細で分かりやすいコメント
- **ログの改善**: 絵文字を使用した視覚的に分かりやすいログ
- **エラーメッセージの統一**: 一貫したエラーメッセージ形式 