# JavaScript + Express スタータープロジェクト

クリーンアーキテクチャ（Controller-Service Pattern）を実装したJavaScript + Express スタータープロジェクトです。

## 🎯 プロジェクト概要

このプロジェクトは、他のプログラミング言語やフレームワークへの移植時に参考として活用できる、標準的なWeb APIの実装パターンを提供します。

### 主要機能

- 🏗️ **クリーンアーキテクチャ**: Controller-Service-Model パターン
- 🔄 **モックモード**: データベースなしでの動作
- 📊 **ヘルスチェック**: アプリケーション状態監視
- 📚 **Swagger文書**: 自動生成されるAPI文書
- 🧪 **テスト**: Jest + Supertest による包括的テスト
- 🔒 **セキュリティ**: Helmet、CORS、レート制限、入力検証
- 📝 **統一レスポンス**: 標準化されたAPIレスポンス形式
- 📊 **構造化ログ**: JSON形式のログ出力
- 🚀 **グレースフルシャットダウン**: 適切なリソース管理
- ⚡ **パフォーマンス監視**: リクエスト時間とデータベースクエリの監視
- 🐳 **Docker対応**: 完全なコンテナ化環境
- 🗄️ **PostgreSQL対応**: 本格的なデータベース統合

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp env.example .env
```

### 3. サーバーの起動

#### ローカル開発
```bash
npm run dev
```

#### Docker Compose（推奨）
```bash
# 全サービス起動（PostgreSQL + API）
make docker-compose-up

# 開発環境のみ
make docker-compose-dev

# 本番環境のみ
make docker-compose-prod
```

### 4. アクセス

- 🌐 **アプリケーション**: http://localhost:8080
- 📖 **API文書**: http://localhost:8080/api-docs
- 🔗 **ヘルスチェック**: http://localhost:8080/api/health
- 🗄️ **PostgreSQL**: localhost:5432

## 🐳 Docker Compose

### サービス構成

| サービス | ポート | 説明 |
|---------|--------|------|
| `postgres` | 5432 | PostgreSQL 15 データベース |
| `app` | 8080 | 本番用APIサーバー |
| `app-dev` | 8081 | 開発用APIサーバー |

### 使用方法

#### 全サービス起動
```bash
make docker-compose-up
```

#### 開発環境起動
```bash
make docker-compose-dev
```

#### 本番環境起動
```bash
make docker-compose-prod
```

#### サービス停止
```bash
make docker-compose-down
```

#### ログ確認
```bash
make docker-compose-logs
```

#### 完全クリーンアップ
```bash
make docker-compose-clean
```

### データベース

PostgreSQL 15が自動的にセットアップされ、以下の初期データが作成されます：

- **データベース**: `sampledb`
- **ユーザー**: `sampleuser`
- **パスワード**: `samplepass`
- **初期テーブル**: `hello_world_messages`
- **サンプルデータ**: 3件のHello Worldメッセージ

## 📋 API エンドポイント

### アプリケーション情報

#### GET /
アプリケーションの基本情報を取得します。

**レスポンス例:**
```json
{
  "status": "success",
  "message": "Application info retrieved",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": {
    "name": "Hello World API",
    "version": "1.0.0",
    "description": "JavaScript + Express スタータープロジェクト - クリーンアーキテクチャ実装",
    "environment": "development",
    "features": {
      "rateLimit": true,
      "helmet": true,
      "swagger": true,
      "mockMode": true,
      "validation": true,
      "logging": true
    },
    "endpoints": {
      "health": "/api/health",
      "helloWorld": "/api/hello-world",
      "documentation": "/api-docs"
    }
  }
}
```

### ヘルスチェック

#### GET /api/health
アプリケーションの状態を確認します。

**レスポンス例:**
```json
{
  "status": "success",
  "message": "Health check successful",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": {
    "status": "OK",
    "message": "Server is running with database connection",
    "uptime": 123.456,
    "memory": {
      "rss": 12345678,
      "heapTotal": 9876543,
      "heapUsed": 5432109,
      "external": 123456
    },
    "database": {
      "connected": true,
      "mode": "postgres",
      "message": "Connected to PostgreSQL"
    },
    "services": {
      "helloWorld": "OK",
      "rateLimit": "OK",
      "logging": "OK"
    }
  }
}
```

### Hello World API

#### GET /api/hello-world
Hello Worldメッセージを取得します。

**クエリパラメータ:**
- `name` (string, オプション): 挨拶する相手の名前（デフォルト: "World"）

**レスポンス例:**
```json
{
  "status": "success",
  "message": "Hello World message retrieved",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": {
    "id": 1,
    "name": "World",
    "message": "Hello, World!",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/hello-world
新しいHello Worldメッセージを追加します。

**リクエストボディ:**
```json
{
  "name": "string (必須)",
  "message": "string (オプション)"
}
```

**レスポンス例:**
```json
{
  "status": "success",
  "message": "Hello World message added",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": {
    "id": 2,
    "name": "Express",
    "message": "Hello, Express!",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/hello-world/list
Hello Worldメッセージ一覧を取得します。

**レスポンス例:**
```json
{
  "status": "success",
  "message": "Hello World messages retrieved",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": [
    {
      "id": 1,
      "name": "World",
      "message": "Hello, World!",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Express",
      "message": "Hello, Express!",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🔧 設定

### 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `PORT` | `8080` | サーバーポート |
| `NODE_ENV` | `development` | 実行環境 |
| `HOST` | `0.0.0.0` | サーバーホスト |
| `DB_HOST` | `localhost` | データベースホスト |
| `DB_PORT` | `5432` | データベースポート |
| `DB_USER` | `sampleuser` | データベースユーザー |
| `DB_PASSWORD` | `samplepass` | データベースパスワード |
| `DB_NAME` | `sampledb` | データベース名 |
| `DB_SSL` | `false` | データベースSSL接続 |
| `RATE_LIMIT_ENABLED` | `true` | レート制限の有効化 |
| `RATE_LIMIT_MAX` | `100` | レート制限の最大リクエスト数 |
| `RATE_LIMIT_WINDOW_MS` | `900000` | レート制限のウィンドウ時間（ミリ秒） |
| `LOG_LEVEL` | `info` | ログレベル |
| `LOG_FORMAT` | `json` | ログ形式 |
| `MOCK_MODE` | `true` | モックモードの有効化 |

### Docker環境変数

Docker Composeでは、以下の環境変数が自動的に設定されます：

- `DB_HOST=postgres` (Dockerサービス名)
- `MOCK_MODE=false` (データベース接続あり)
- `NODE_ENV=production` (本番環境)

## 🏗️ アーキテクチャ

### ディレクトリ構造

```
src/
├── config/           # 設定管理
│   ├── config.js     # アプリケーション設定
│   └── database.js   # データベース設定
├── controllers/      # HTTPコントローラー（Controller層）
│   ├── health.js     # ヘルスチェック
│   └── helloWorld.js # Hello World API
├── middleware/       # ミドルウェア
│   ├── errorHandler.js # エラーハンドリング
│   ├── rateLimiter.js  # レート制限
│   ├── validator.js    # 入力検証
│   └── logger.js       # ログ出力
├── models/           # データモデル
│   └── response.js   # レスポンス構造体
├── routes/           # ルーティング
│   └── routes.js     # ルーター設定
├── services/         # ビジネスロジック（Service層）
│   └── helloWorldService.js # Hello Worldサービス
├── utils/            # ユーティリティ
│   ├── constants.js  # 定数定義
│   └── mock.js       # モックデータ
├── docs/             # Swagger文書（自動生成）
├── app.js            # Expressアプリケーション設定
├── server.js         # サーバー起動とアプリケーション初期化
└── package.json      # Node.js依存関係管理
```

### アプリケーションとサーバーの分離

このプロジェクトでは、**アプリケーション**と**サーバー**を明確に分離しています：

#### `src/app.js` - Expressアプリケーション
- Expressアプリケーションの設定のみ
- ミドルウェアの設定
- ルーティングの設定
- エラーハンドリングの設定
- **テスト時に使用**

#### `src/server.js` - サーバー起動
- アプリケーションの初期化
- データベース接続
- サーバー起動
- グレースフルシャットダウン
- **本番環境で使用**

#### 分離のメリット
- **テストの簡素化**: アプリケーションのみをテスト可能
- **再利用性**: 異なるサーバー設定でアプリケーションを使用可能
- **責任の分離**: アプリケーションロジックとサーバー設定の明確な分離
- **デバッグの容易さ**: 問題の切り分けが簡単

### レイヤー構造

1. **Controller層**: HTTPリクエスト/レスポンス処理
2. **Service層**: ビジネスロジック
3. **Model層**: データ構造定義
4. **Middleware層**: リクエスト処理パイプライン
5. **Config層**: 設定管理
6. **Utils層**: 共通ユーティリティ

## 🔒 セキュリティ機能

### レート制限
- IPアドレスベースのレート制限
- 設定可能な制限値とウィンドウ時間
- レスポンスヘッダーでの制限情報提供

### 入力検証
- リクエストボディ、クエリパラメータ、パスパラメータの検証
- 型チェック、長さ制限、パターンマッチング
- カスタムバリデーションルール

### セキュリティヘッダー
- Helmet.jsによるセキュリティヘッダー設定
- CORS設定
- XSS対策

## 📊 ログ機能

### 構造化ログ
- JSON形式のログ出力
- ログレベルの設定
- リクエストIDによる追跡

### パフォーマンス監視
- リクエスト処理時間の記録
- データベースクエリ時間の監視
- スローリクエストの検出

### セキュリティログ
- 不正なリクエストの検出
- セキュリティイベントの記録

## 🧪 テスト

### テスト実行

```bash
# 全テスト実行
npm test

# テスト監視モード
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage

# 統合テスト
npm run test:integration
```

### テストカバレッジ
- コントローラー: 100%
- サービス: 100%
- ミドルウェア: 100%
- ユーティリティ: 100%

### テストアーキテクチャ
- **アプリケーションのみテスト**: `src/app.js`を使用
- **サーバー分離**: テスト時にサーバーは起動しない
- **モックデータ**: データベース接続なしでテスト実行

## 🚀 デプロイメント

### Docker Compose（推奨）

```bash
# 本番環境
make docker-compose-prod

# 開発環境
make docker-compose-dev

# 全サービス停止
make docker-compose-down
```

### 単体Docker

```bash
# イメージビルド
docker build -t hello-world-api .

# コンテナ実行
docker run -p 8080:8080 hello-world-api
```

### 本番環境設定

```bash
# 本番環境変数
NODE_ENV=production
MOCK_MODE=false
RATE_LIMIT_ENABLED=true
LOG_LEVEL=info
```

## 📈 パフォーマンス

### レスポンス時間
- ヘルスチェック: < 5ms
- Hello World GET: < 5ms
- Hello World POST: < 10ms (データベースあり)
- Hello World POST: < 5ms (モックモード)

### リソース使用量
- メモリ: < 100MB
- CPU: 低使用率
- ディスク: < 200MB

## 🔄 開発ガイド

### 新しいエンドポイントの追加

1. **コントローラー作成**: `src/controllers/`
2. **サービス作成**: `src/services/`
3. **ルート追加**: `src/routes/routes.js`
4. **バリデーション追加**: `src/middleware/validator.js`
5. **テスト作成**: `test/`

### コード規約

- **命名規則**: camelCase
- **ファイル名**: kebab-case
- **エクスポート**: クラスまたは関数
- **コメント**: JSDoc形式
- **エラーハンドリング**: 統一されたエラーレスポンス

## 📚 参考資料

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [REST API Design](https://restfulapi.net/)
- [Swagger Documentation](https://swagger.io/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

---

このプロジェクトは、他のプログラミング言語やフレームワークへの移植時に参考として活用できる、標準的なWeb APIの実装パターンを提供します。 