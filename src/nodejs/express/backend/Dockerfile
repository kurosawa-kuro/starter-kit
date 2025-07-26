# マルチステージビルド
FROM node:18-alpine AS builder

# 作業ディレクトリ設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# 本番用イメージ
FROM node:18-alpine

# 作業ディレクトリ設定
WORKDIR /app

# curlをインストール（ヘルスチェック用）
RUN apk add --no-cache curl

# 非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 依存関係をコピー
COPY --from=builder /app/node_modules ./node_modules

# アプリケーションコードをコピー
COPY . .

# ユーザー権限を変更
RUN chown -R nodejs:nodejs /app
USER nodejs

# ポートを公開
EXPOSE 8080

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# アプリケーション起動
CMD ["npm", "start"] 