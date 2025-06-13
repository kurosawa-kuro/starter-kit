#!/bin/bash

# エラーが発生したら即座に終了
set -e

# 環境変数の検証
if [ -z "$NODE_ENV" ]; then
  echo "Error: NODE_ENV is not set"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set"
  exit 1
fi

# 環境に応じた.envファイルの選択
ENV_FILE=".env.$NODE_ENV"
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE does not exist"
  exit 1
fi

# 依存関係のインストール
echo "Installing dependencies..."
npm ci

# 環境変数の検証
echo "Validating environment variables..."
npm run validate

# デプロイメントの準備
echo "Preparing deployment for $NODE_ENV environment..."

# 環境に応じた処理
case $NODE_ENV in
  "staging")
    echo "Deploying to staging environment..."
    # ステージング環境固有の処理
    ;;
  "production")
    echo "Deploying to production environment..."
    # 本番環境固有の処理
    ;;
  *)
    echo "Unknown environment: $NODE_ENV"
    exit 1
    ;;
esac

echo "Deployment completed successfully!" 