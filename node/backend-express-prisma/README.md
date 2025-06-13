# Express Prisma PostgreSQL API

Node.js、Express、Prisma、PostgreSQLを使用したRESTful APIのサンプルです。

## プロジェクト概要

このプロジェクトは、Node.jsとExpressを使用してRESTful APIを提供し、Prismaを使用してPostgreSQLデータベースに接続します。

### 主な機能
- ユーザーの作成（POST /users）
- ユーザー一覧の取得（GET /users）
- 特定のユーザーの取得（GET /users/:email）

### 技術スタック
- Node.js
- Express
- Prisma ORM
- PostgreSQL

## セットアップ

### 前提条件
- Node.js (v14以上)
- PostgreSQL (v12以上)
- npm または yarn

### インストール手順

1. リポジトリのクローン:
```bash
git clone <repository-url>
cd express-prisma-api
```

2. 環境変数の設定:
.env.sampleを.envにコピー

```bash
cp .env.sample .env
```

3. データベースの作成（存在しない場合）:
```bash
psql -U postgres -c "CREATE DATABASE local_dev;"
```

4. 依存関係のインストール:
```bash
npm install
```

5. データベースのマイグレーション:
```bash
npx prisma migrate dev --name init
```

## 使用方法

### 開発サーバーの起動
```bash
npm run dev
```

### APIエンドポイント

#### ユーザーの作成
```bash
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### ユーザー一覧の取得
```bash
GET /users
```

#### 特定のユーザーの取得
```bash
GET /users/:email
```

## データベース接続情報
- ホスト: localhost
- データベース: local_dev
- ユーザー名: postgres
- パスワード: postgres
- ポート: 5432（デフォルト）

## トラブルシューティング

### よくある問題と解決方法

1. データベース接続エラー
   - PostgreSQLが実行中であることを確認
   - 接続情報（ホスト、ポート、認証情報）が正しいことを確認
   - データベースが存在することを確認

2. マイグレーションエラー
   - `npx prisma migrate reset`を実行してデータベースをリセット
   - マイグレーションファイルが正しいことを確認

3. APIエラー
   - リクエストの形式が正しいことを確認
   - 必要なパラメータが全て指定されていることを確認
   - エラーメッセージを確認

## 開発

### プロジェクト構造
```
.
├── prisma/
│   └── schema.prisma    # データベーススキーマ定義
├── src/
│   └── index.js        # メインアプリケーション
├── .env                # 環境変数
├── package.json        # プロジェクト設定
└── README.md          # ドキュメント
```

### 開発コマンド
```bash
# 開発モードで実行
npm run dev

# 本番モードで実行
npm start

# Prisma Studioの起動（データベース管理UI）
npx prisma studio
```
