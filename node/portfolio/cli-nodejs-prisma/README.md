# Node.js Prisma PostgreSQL CLI

Node.js、Prisma、PostgreSQLを使用したCLIアプリケーションのサンプルです。

## プロジェクト概要

このプロジェクトは、Node.jsとPrismaを使用してPostgreSQLデータベースに接続し、ユーザー管理のためのCLIツールを提供します。

### 主な機能
- ユーザーの作成（create）
- ユーザー一覧の表示（list）
- 特定のユーザーの取得（get）

### 技術スタック
- Node.js
- Prisma ORM
- PostgreSQL
- Commander.js（CLIフレームワーク）

## セットアップ

### 前提条件
- Node.js (v14以上)
- PostgreSQL (v12以上)
- npm または yarn

### インストール手順

1. リポジトリのクローン:
```bash
git clone <repository-url>
cd cli-nodejs-prisma
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

### ユーザーの作成
```bash
node src/index.js create -e user@example.com -n "John Doe"
```
- `-e, --email`: ユーザーのメールアドレス（必須）
- `-n, --name`: ユーザーの名前（必須）

### ユーザー一覧の表示
```bash
node src/index.js list
```
データベースに登録されている全てのユーザーを表示します。

### 特定のユーザーの取得
```bash
node src/index.js get -e user@example.com
```
- `-e, --email`: 検索するユーザーのメールアドレス（必須）

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

3. コマンド実行エラー
   - 必要なパラメータが全て指定されていることを確認
   - 正しいコマンド構文を使用していることを確認

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
npm start

# Prisma Studioの起動（データベース管理UI）
npx prisma studio
```
