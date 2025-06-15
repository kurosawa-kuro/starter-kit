.PHONY: validate dev test stag prod install

# 依存関係のインストール
install:
	@echo "依存関係をインストールします..."
	@npm install

# 環境変数の検証
validate:
	@echo "環境変数の検証を開始します..."
	@npm run validate

# 開発環境
dev:
	@echo "開発環境を起動します..."
	@npm run serve:dev

# テスト環境
test:
	@echo "テスト環境を起動します..."
	@npm run serve:test

# ステージング環境
stag:
	@echo "ステージング環境を起動します..."
	@npm run serve:stag

# 本番環境
prod:
	@echo "本番環境を起動します..."
	@npm run serve:prod

# ヘルプ
help:
	@echo "利用可能なコマンド:"
	@echo "  make install  - 依存関係のインストール"
	@echo "  make validate - 環境変数の検証"
	@echo "  make dev      - 開発環境の起動"
	@echo "  make test     - テスト環境の起動"
	@echo "  make stag     - ステージング環境の起動"
	@echo "  make prod     - 本番環境の起動"
	@echo "  make help     - このヘルプメッセージを表示"
