# --------------------------------------------
# ターゲット一覧 (.PHONY)
# --------------------------------------------
.PHONY: install dev test test-setup test-migrate test-watch test-coverage seed clean help \
        migrate generate db-push db-seed studio

# デフォルトターゲット
.DEFAULT_GOAL := help

# --------------------------------------------
# 基本的なコマンド
# --------------------------------------------

# 依存関係のインストール
install:
	@echo "📦 Installing dependencies..."
	npm install

# 開発サーバーの起動
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# テストの実行
test:
	@echo "🧪 Running tests..."
	npm run test

# テスト環境のセットアップ
test-setup:
	@echo "🔧 Setting up test environment..."
	npm run test:setup

# テストデータベースのマイグレーション
test-migrate:
	@echo "🔄 Running test database migrations..."
	npm run test:migrate

# テストの監視モード
test-watch:
	@echo "👀 Running tests in watch mode..."
	npm run test:watch

# テストカバレッジの確認
test-coverage:
	@echo "📊 Generating test coverage report..."
	npm run test:coverage

# データベースのシード
seed:
	@echo "🌱 Seeding database..."
	npm run seed

# 生成されたファイルの削除
clean:
	@echo "🧹 Cleaning up..."
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage

# --------------------------------------------
# Prisma 関連コマンド
# --------------------------------------------

# Prisma のマイグレーション
migrate:
	@echo "🚀 Prisma: Migrate dev..."
	npx prisma migrate dev --name init

# Prisma Client の再生成
generate:
	@echo "🚀 Prisma: Generate Client..."
	npx prisma generate --schema=prisma/schema.prisma

# Prisma: スキーマを DB に直接プッシュ
db-push:
	@echo "🚀 Prisma: DB Push..."
	npx prisma db push --schema=prisma/schema.prisma

# Prisma: DB シード
db-seed:
	@echo "🚀 Prisma: DB Seed..."
	npx prisma db seed --schema=prisma/schema.prisma

# Prisma: Studio を起動
studio:
	@echo "🚀 Prisma: Studio..."
	npx prisma studio

# --------------------------------------------
# ヘルプ表示
# --------------------------------------------
help:
	@echo "🔧 利用可能なコマンド一覧:"
	@echo "make install         - 依存関係をインストール"
	@echo "make dev             - 開発サーバーを起動"
	@echo "make test            - テストを実行"
	@echo "make test-setup      - テスト環境をセットアップ"
	@echo "make test-migrate    - テストDBのマイグレーションを実行"
	@echo "make test-watch      - テストを監視モードで実行"
	@echo "make test-coverage   - テストカバレッジレポートを生成"
	@echo "make seed            - データベースにシードデータを投入"
	@echo "make migrate         - Prisma: DBマイグレーション(dev)"
	@echo "make generate        - Prisma Client の生成"
	@echo "make db-push         - Prisma: DBへスキーマ内容を直反映"
	@echo "make db-seed         - Prisma: データベースにシードデータを投入"
	@echo "make studio          - Prisma: GUIでDBを操作"
	@echo "make clean           - 生成されたファイルを削除"
	@echo "make help            - このヘルプメッセージを表示"
