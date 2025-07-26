# JavaScript + Express スタータープロジェクト作成仕様書

## 概要

このドキュメントは、JavaScript + Express スタータープロジェクトの作成仕様を逆算したものです。他のプログラミング言語やフレームワークへの移植時に参考として活用できます。

## 🎯 プロジェクト要件

### 基本要件
- **言語**: JavaScript (Node.js 18.0+)
- **フレームワーク**: Express.js (Web Framework)
- **データベース**: PostgreSQL (オプション)
- **文書化**: Swagger/OpenAPI
- **テスト**: Jest + Supertest
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
│   ├── config.js     # アプリケーション設定
│   └── database.js   # データベース設定
├── controllers/      # HTTPコントローラー（Controller層）
│   ├── health.js     # ヘルスチェック
│   └── helloWorld.js # Hello World API
├── middleware/       # ミドルウェア
│   └── errorHandler.js # エラーハンドリング
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
├── app.js            # アプリケーションエントリーポイント
├── package.json      # Node.js依存関係管理
└── package-lock.json # 依存関係ロックファイル
```

### ファイル命名規則
- **コントローラー**: `{resource}.js` (camelCase)
- **サービス**: `{resource}Service.js` (camelCase)
- **モデル**: `{type}.js` (response.js, request.js等)
- **設定**: `{purpose}.js` (config.js, database.js等)

## 🏗️ アーキテクチャ仕様

### レイヤー構造
1. **Controller層**: HTTPリクエスト/レスポンス処理
2. **Service層**: ビジネスロジック
3. **Model層**: データ構造定義
4. **Config層**: 設定管理
5. **Utils層**: 共通ユーティリティ

### 依存関係の方向
```
Controller → Service → Model
    ↓
Middleware → Utils
    ↓
Config
```

## 📋 実装仕様

### 1. 設定管理仕様

#### 環境変数定義
```javascript
const config = {
    port: process.env.PORT || 8080,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 5432,
    dbUser: process.env.DB_USER || 'sampleuser',
    dbPass: process.env.DB_PASSWORD || 'samplepass',
    dbName: process.env.DB_NAME || 'sampledb',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret'
};
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
    "timestamp": "2025-07-26T01:55:51.425Z",
    "data": { ... }
}
```

#### エラーレスポンス
```json
{
    "status": "error",
    "error": "validation_error",
    "message": "Validation failed",
    "timestamp": "2025-07-26T01:55:51.425Z"
}
```

#### 統一レスポンス構造体
```javascript
class BaseResponse {
    constructor(message, data = null) {
        this.status = 'success';
        this.message = message;
        this.timestamp = new Date().toISOString();
        if (data) this.data = data;
    }
}

class ErrorResponse {
    constructor(error, message) {
        this.status = 'error';
        this.error = error;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
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
| GET | `/api-docs` | Swagger UI | API文書 |

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
```javascript
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const errorResponse = new ErrorResponse(
        err.type || 'internal_error',
        err.message || 'Internal Server Error'
    );
    
    res.status(err.status || 500).json(errorResponse);
};
```

### 5. データベース仕様

#### 接続設定
- **ドライバー**: PostgreSQL (pg)
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
```javascript
class MockData {
    getMockHelloWorldMessage(name) {
        return {
            id: 1,
            name: name || 'World',
            message: `Hello, ${name || 'World'}!`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
}
```

#### モックモード判定
```javascript
if (!this.db || !this.db.connected) {
    return this.mockData.getMockHelloWorldMessage(name);
}
```

### 7. ログ仕様

#### ログレベル
- **INFO**: 一般的な情報
- **WARN**: 警告（データベース接続失敗など）
- **ERROR**: エラー（サーバー起動失敗など）

#### ログ形式
```
2025-07-26T01:55:22.425Z 🚀 Hello World API starting on port 8080
2025-07-26T01:55:22.426Z 📖 API Documentation: http://localhost:8080/api-docs
2025-07-26T01:55:22.427Z 🔗 Health Check: http://localhost:8080/api/health
```

### 8. テスト仕様

#### テスト構造
- **単体テスト**: モックデータ使用
- **統合テスト**: 実際のデータベース使用
- **E2Eテスト**: 完全なワークフロー

#### テストカバレッジ
- **コントローラー**: 100%
- **サービス**: 100%
- **設定**: 100%
- **ユーティリティ**: 100%

## 🔧 開発環境仕様

### 必要なツール
- **Node.js**: 18.0+
- **npm**: 9.0+
- **PostgreSQL**: 15+ (オプション)
- **Docker**: 20.10+ (オプション)
- **Make**: ビルド自動化

### 依存関係
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2"
  }
}
```

## 🚀 デプロイメント仕様

### ビルド設定
- **開発ビルド**: `npm run dev`
- **本番ビルド**: `npm run build`
- **本番起動**: `npm start`

### Docker設定
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 📊 パフォーマンス仕様

### レスポンス時間
- **ヘルスチェック**: < 5ms
- **Hello World GET**: < 5ms
- **Hello World POST**: < 10ms (データベースあり)
- **Hello World POST**: < 5ms (モックモード)

### リソース使用量
- **メモリ**: < 100MB
- **CPU**: 低使用率
- **ディスク**: < 200MB

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
1. **依存関係インストール**: `npm ci`
2. **テスト実行**: `npm test`
3. **ビルド**: `npm run build`
4. **Dockerイメージ作成**: `docker build -t app .`

### テストパイプライン
1. **単体テスト**: `npm test`
2. **統合テスト**: `npm run test:integration`
3. **カバレッジ**: `npm run test:coverage`

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
1. **レイヤー分離**: Controller-Service-Model
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

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [REST API Design](https://restfulapi.net/)
- [Swagger Documentation](https://swagger.io/docs/)

---

このドキュメントは、JavaScript + Express スタータープロジェクトの作成仕様を逆算したものです。他のプログラミング言語やフレームワークへの移植時に、この仕様を参考にして同等の機能を実装してください。
