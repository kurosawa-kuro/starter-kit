# ビルドステージ
FROM golang:1.21-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# Go modulesファイルをコピー
COPY src/go.mod src/go.sum ./
COPY config/ ./config/

# 依存関係をダウンロード
RUN go mod download

# ソースコードをコピー
COPY . .

# Swagger docsを生成
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN cd src && swag init -g main.go

# アプリケーションをビルド
RUN cd src && CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main main.go

# 実行ステージ
FROM alpine:latest

# ca-certificatesをインストール（HTTPSリクエスト用）
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# ビルドステージからバイナリをコピー
COPY --from=builder /app/src/main .

# ポート8080を公開
EXPOSE 8080

# アプリケーションを実行
CMD ["./main"] 