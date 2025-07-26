# Hello World API - Makefile
#
# 本Makefileは責務分離のため、各種サブMakefileをincludeしています。
# 詳細は各サブMakefileを参照してください。
#
# 【プロジェクトルール補足】
# 原則モノリシック構成ですが、チームまたはリーダーから明示的な指示があった場合に限り、
# 責務ごと（例：ビルド、テスト、DB、Docker、環境変数管理等）にサブMakefileや外部スクリプトへの分離を許容します。
# 分割時は、READMEまたは本ファイル先頭に分割方針を必ず明記してください。

include makefiles/Makefile.build
include makefiles/Makefile.test
include makefiles/Makefile.docker
include makefiles/Makefile.env

.PHONY: help
help:
	@echo "🚀 Hello World API - 利用可能なコマンド:"
	@echo ""
	@echo "  make build    - アプリケーションをビルド"
	@echo "  make run      - アプリケーションを実行"
	@echo "  make test     - テストを実行"
	@echo "  make docker   - Docker Composeで起動"
	@echo "  make env-init - 環境変数ファイルを初期化"
	@echo "  make help     - このヘルプを表示"
