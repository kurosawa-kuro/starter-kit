# Hello World API - Makefile

.PHONY: help build run test clean deps

# デフォルトターゲット
help:
	@echo "🚀 Hello World API - 利用可能なコマンド:"
	@echo ""
	@echo "  make build    - アプリケーションをビルド"
	@echo "  make run      - アプリケーションを実行"
	@echo "  make test     - テストを実行（DBが起動していない場合は自動起動）"
	@echo "  make test-only - テストのみ実行（DBの起動・停止なし）"
	@echo "  make test-coverage - テスト実行（カバレッジ付き）"
	@echo "  make test-coverage-report - カバレッジレポート生成"
	@echo "  make test-coverage-html - HTMLカバレッジレポート生成"
	@echo "  make test-setup - テスト用DBのセットアップ（初回のみ実行）"
	@echo "  make test-db-status - テスト用DBの状態確認"
	@echo "  make test-db-up   - テスト用DBを起動"
	@echo "  make test-db-down - テスト用DBを停止"
	@echo "  make clean    - ビルドファイルをクリーン"
	@echo "  make deps     - 依存関係を更新"
	@echo "  make swagger  - Swaggerドキュメントを生成"
	@echo "  make docker   - Docker Composeで起動"
	@echo ""
	@echo "環境変数管理:"
	@echo "  make env-init ENV=development # 環境変数ファイルを初期化"
	@echo "  make env-validate # 環境変数ファイルを検証"
	@echo "  make env-backup # 環境変数ファイルをバックアップ"
	@echo "  make env-restore FILE=backup # バックアップから復元"
	@echo "  make env-list # 利用可能な環境を一覧表示"
	@echo ""
	@echo "  make help     - このヘルプを表示"

# アプリケーションをビルド
build:
	@echo "🔨 Hello World API をビルド中..."
	cd src && go build -o ../bin/hello-world-api main.go
	@echo "✅ ビルド完了: bin/hello-world-api"

# アプリケーションを実行
run:
	@echo "🚀 Hello World API を起動中..."
	cd src && go run main.go

# テスト用DBのセットアップ（初回のみ実行）
test-setup:
	@echo "🔧 テスト用環境変数ファイルを生成中..."
	@./script/gen-test-env.sh
	@echo "🔧 テスト用DBを起動中..."
	@docker compose -f docker/docker-compose.test.yml up -d db-test
	@echo "⏳ DB起動を待機中..."
	@sleep 10
	@echo "✅ テスト用DBのセットアップ完了"

# テストを実行（DBが起動していない場合は自動起動）
test:
	@echo "🧪 Docker DBを使用したテストを実行中..."
	@if ! docker compose -f docker/docker-compose.test.yml ps db-test | grep -q "Up"; then \
		echo "🔧 テスト用DBが起動していません。セットアップを実行します..."; \
		$(MAKE) test-setup; \
	fi
	@echo "🧪 テストを実行中..."
	@cd src && GIN_MODE=test go test -v ./test/... -timeout 60s

# テストのみ実行（DBの起動・停止なし）
test-only:
	@echo "🧪 テストのみ実行中（DBの起動・停止なし）..."
	@if ! docker compose -f docker/docker-compose.test.yml ps db-test | grep -q "Up"; then \
		echo "❌ テスト用DBが起動していません。先に make test-setup を実行してください。"; \
		exit 1; \
	fi
	@cd src && GIN_MODE=test go test -v ./test/... -timeout 60s

# テスト実行（カバレッジ付き）
test-coverage:
	@echo "🧪 カバレッジ付きテストを実行中..."
	@if ! docker compose -f docker/docker-compose.test.yml ps db-test | grep -q "Up"; then \
		echo "❌ テスト用DBが起動していません。先に make test-setup を実行してください。"; \
		exit 1; \
	fi
	@cd src && GIN_MODE=test go test -v -cover ./services ./models ./handler ./middleware ./router ./config ./utils -timeout 60s

# テスト実行（カバレッジレポート生成）
test-coverage-report:
	@echo "🧪 カバレッジレポートを生成中..."
	@if ! docker compose -f docker/docker-compose.test.yml ps db-test | grep -q "Up"; then \
		echo "❌ テスト用DBが起動していません。先に make test-setup を実行してください。"; \
		exit 1; \
	fi
	@cd src && GIN_MODE=test go test -v -coverprofile=../coverage.out ./services ./models ./handler ./middleware ./router ./config ./utils -timeout 60s
	@echo "📊 カバレッジレポートを生成しました: coverage.out"
	@echo "📈 カバレッジ詳細を表示:"
	@cd src && go tool cover -func=../coverage.out

# カバレッジレポートをHTMLで表示
test-coverage-html:
	@echo "🧪 HTMLカバレッジレポートを生成中..."
	@if ! docker compose -f docker/docker-compose.test.yml ps db-test | grep -q "Up"; then \
		echo "❌ テスト用DBが起動していません。先に make test-setup を実行してください。"; \
		exit 1; \
	fi
	@cd src && GIN_MODE=test go test -v -coverprofile=../coverage.out ./services ./models ./handler ./middleware ./router ./config ./utils -timeout 60s
	@echo "📊 HTMLカバレッジレポートを生成中..."
	@cd src && go tool cover -html=../coverage.out -o ../coverage.html
	@echo "✅ HTMLカバレッジレポートを生成しました: coverage.html"
	@echo "🌐 ブラウザで開く: open coverage.html または coverage.html をダブルクリック"

# ビルドファイルをクリーン
clean:
	@echo "🧹 ビルドファイルをクリーン中..."
	rm -rf bin/
	rm -f coverage.out coverage.html
	go clean
	@echo "✅ クリーン完了"

# 依存関係を更新
deps:
	@echo "📦 依存関係を更新中..."
	go mod tidy
	go mod download
	@echo "✅ 依存関係更新完了"

# 環境変数ファイルの管理
env-init:
	@echo "🔧 環境変数ファイルを初期化中..."
	@if [ -z "$(ENV)" ]; then \
		echo "⚠️  環境タイプを指定してください: make env-init ENV=development"; \
		echo "利用可能な環境: development, test, production"; \
		exit 1; \
	fi
	@./script/env-manager.sh init $(ENV)

env-validate:
	@echo "🔍 環境変数ファイルを検証中..."
	@./script/env-manager.sh validate

env-backup:
	@echo "💾 環境変数ファイルをバックアップ中..."
	@./script/env-manager.sh backup

env-restore:
	@echo "🔄 環境変数ファイルを復元中..."
	@if [ -z "$(FILE)" ]; then \
		echo "⚠️  復元ファイルを指定してください: make env-restore FILE=.env.backup.20240101_120000"; \
		exit 1; \
	fi
	@./script/env-manager.sh restore $(FILE)

env-list:
	@echo "📋 利用可能な環境を一覧表示中..."
	@./script/env-manager.sh list

# 開発用（ホットリロード）
dev:
	@echo "🔥 開発モードで起動中..."
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "⚠️  air がインストールされていません。通常モードで起動します。"; \
		go run main.go; \
	fi

# 本番用ビルド
build-prod:
	@echo "🏭 本番用ビルド中..."
	cd src && CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ../bin/hello-world-api main.go
	@echo "✅ 本番用ビルド完了: bin/hello-world-api"

# コードフォーマット
fmt:
	@echo "🎨 コードをフォーマット中..."
	go fmt ./...
	@echo "✅ フォーマット完了"

# リント
lint:
	@echo "🔍 コードをリント中..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "⚠️  golangci-lint がインストールされていません。"; \
	fi

# Swaggerドキュメントを生成
swagger:
	@echo "📖 Swaggerドキュメントを生成中..."
	@if command -v swag > /dev/null; then \
		cd src && swag init -g main.go; \
	else \
		echo "⚠️  swag がインストールされていません。go install github.com/swaggo/swag/cmd/swag@latest を実行してください。"; \
	fi

# Swaggerテストを実行
test-swagger:
	@echo "🧪 Swaggerテストを実行中..."
	go test -v ./test/... -run "TestSwagger"

# テスト用DBを起動
test-db-up:
	@echo "🐳 テスト用DBを起動中..."
	docker compose -f docker/docker-compose.test.yml up -d db-test

# テスト用DBの状態確認
test-db-status:
	@echo "🔍 テスト用DBの状態を確認中..."
	@docker compose -f docker/docker-compose.test.yml ps db-test

# テスト用DBを停止
test-db-down:
	@echo "🐳 テスト用DBを停止中..."
	docker compose -f docker/docker-compose.test.yml down

# Docker Composeで起動
docker:
	@echo "🐳 Docker Composeで起動中..."
	docker compose -f docker/docker-compose.yml up --build

# Docker Composeでバックグラウンド起動
docker-bg:
	@echo "🐳 Docker Composeでバックグラウンド起動中..."
	docker compose -f docker/docker-compose.yml up -d --build

# Docker Composeで停止
docker-down:
	@echo "🐳 Docker Composeで停止中..."
	docker compose -f docker/docker-compose.yml down
