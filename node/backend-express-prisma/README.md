# Express Prisma API Starter Kit

シンプルなユーザー管理APIを提供するExpress.js + Prisma + PostgreSQLのスターターキットです。

## 機能

- ユーザー管理（CRUD操作）
- RESTful API設計
- Swagger UIによるAPIドキュメント
- テスト環境の整備
- エラーハンドリング
- リクエストロギング

## 技術スタック

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Jest (テスト)
- Swagger UI (APIドキュメント)

## 必要条件

- Node.js (v14以上)
- PostgreSQL
- npm または yarn

## セットアップ

1. リポジトリのクローン
```bash
git clone <repository-url>
cd backend-express-prisma
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env`ファイルを作成し、以下の内容を設定します：
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/local?schema=public"
PORT=3000
```

4. データベースのセットアップ
```bash
npx prisma migrate dev
```

5. アプリケーションの起動
```bash
npm start
```

## 開発

### 開発サーバーの起動
```bash
npm run dev
```

### テストの実行
```bash
npm test
```

### Prisma Studioの起動
```bash
npx prisma studio
```

## API仕様

### ユーザー管理

#### ユーザー作成
```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name"
}
```

#### ユーザー一覧取得
```http
GET /api/users
```

#### ユーザー詳細取得
```http
GET /api/users/:id
```

#### ユーザー更新
```http
PUT /api/users/:id
Content-Type: application/json

{
  "email": "updated@example.com",
  "name": "Updated Name"
}
```

#### ユーザー削除
```http
DELETE /api/users/:id
```

### APIドキュメント

Swagger UIでAPIドキュメントを確認できます：
```
http://localhost:3000/api-docs
```

## プロジェクト構造

```
.
├── prisma/              # Prisma設定とマイグレーション
├── src/
│   ├── __tests__/      # テストファイル
│   ├── config/         # 設定ファイル
│   ├── controllers/    # コントローラー
│   ├── middleware/     # ミドルウェア
│   ├── routes/         # ルート定義
│   ├── services/       # ビジネスロジック
│   └── index.js        # アプリケーションエントリーポイント
├── .env                # 環境変数
├── package.json        # プロジェクト設定
└── README.md          # プロジェクトドキュメント
```

## エラーハンドリング

アプリケーションは以下のような形式でエラーレスポンスを返します：

```json
{
  "status": "fail",
  "message": "エラーメッセージ"
}
```

## ロギング

アプリケーションは以下のログを出力します：
- リクエストログ
- エラーログ
- アプリケーションログ

## ライセンス

MIT
