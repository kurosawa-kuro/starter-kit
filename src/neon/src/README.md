# Neon Database Connection Test

Neonデータベースへの接続確認用のシンプルなNode.jsサンプルです。Dopplerとの連携も含まれています。

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

## 使用方法

### 方法1: 直接接続URL使用
```bash
npm start
```

### 方法2: 環境変数使用
```bash
# 環境変数を設定
export NEON_DB_URL="postgresql://neondb_owner:Nrp3FfO1goiB@ep-noisy-cherry-a7rp6riz-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# 実行
npm run start:env
```

### 方法3: Doppler使用（推奨）
```bash
# Doppler経由で実行
npm run start:doppler

# または直接実行
doppler run node connection-test-doppler.js
```

## テスト内容

このサンプルは以下のテストを実行します：

1. ✅ データベース接続確認
2. 📋 PostgreSQL バージョン取得
3. 🕐 現在時刻取得
4. 🗄️ データベース名取得

## ファイル構成

- `connection-test-direct.js` - 直接接続URLを使用した接続テスト
- `connection-test-env.js` - 環境変数を使用した接続テスト
- `connection-test-doppler.js` - Dopplerを使用した接続テスト（推奨）
- `package.json` - プロジェクト設定と依存関係

## 注意事項

- 接続URLには機密情報が含まれているため、本番環境ではDopplerを使用してください
- このサンプルは接続確認のみを目的としており、実際のアプリケーションでは適切なエラーハンドリングとセキュリティ対策を実装してください
- Dopplerを使用することで、シークレットの安全な管理と環境別の設定管理が可能になります 


neondb スキーマ、テーブル作成 例

# 1) 接続
psql 'postgresql://neondb_owner:…'

# 2) スキーマ作成
neondb=> CREATE SCHEMA billing;

# 3) テーブル作成
neondb=> CREATE TABLE billing.invoices (
            id SERIAL PRIMARY KEY,
            amount NUMERIC NOT NULL
         );

# 4) 確認
neondb=> \dn      -- スキーマ一覧
neondb=> \dt billing.*  -- billing スキーマのテーブル一覧