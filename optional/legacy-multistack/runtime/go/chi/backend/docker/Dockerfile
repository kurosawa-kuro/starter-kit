# ビルドステージ
FROM golang:1.21-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# Go modulesファイルをコピー
COPY src/go.mod src/go.sum ./

# 依存関係をダウンロード
RUN go mod download

# ソースコードをコピー（事前に生成されたSwaggerドキュメントを含む）
COPY src/ ./src/

# アプリケーションをビルド
RUN cd src && CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main main.go

# 実行ステージ
FROM alpine:latest

# ca-certificatesをインストール（HTTPSリクエスト用）
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# ビルドステージからバイナリをコピー
COPY --from=builder /app/src/main .

# Swaggerドキュメントをコピー
COPY --from=builder /app/src/docs ./docs

# ポート8080を公開
EXPOSE 8080

# アプリケーションを実行
CMD ["./main"] 