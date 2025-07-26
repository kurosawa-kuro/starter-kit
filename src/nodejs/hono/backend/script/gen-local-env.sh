#!/bin/bash

# ========================================
# Hello World API - Local Environment Generator
# ========================================
# ローカル開発環境用の.envファイルを生成します
# このスクリプトは後方互換性のために残されています
# 新しい環境管理システムの使用を推奨します

set -e

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 色付き出力用の関数
print_info() {
    echo -e "\033[1;34mℹ️  $1\033[0m"
}

print_success() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_warning() {
    echo -e "\033[1;33m⚠️  $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

# メイン処理
main() {
    cd "$PROJECT_ROOT"
    
    ENV_FILE=".env"
    
    print_info "ローカル開発環境用の.envファイルを生成します"
    
    if [ -f "$ENV_FILE" ]; then
        print_warning "$ENV_FILE already exists."
        echo "既存のファイルをバックアップしますか？ (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            timestamp=$(date +%Y%m%d_%H%M%S)
            cp "$ENV_FILE" "${ENV_FILE}.backup.$timestamp"
            print_success "バックアップを作成しました: ${ENV_FILE}.backup.$timestamp"
        else
            print_info "処理を中止しました"
            exit 0
        fi
    fi
    
    # 開発環境用の.envファイルを作成
    cat <<EOF > "$ENV_FILE"
# ========================================
# Hello World API - Local Development Environment
# ========================================
# ローカル開発環境用の設定ファイル
# Docker Composeで使用されます

# ========================================
# Application Settings
# ========================================
# アプリケーションのポート番号
PORT=8080

# ========================================
# Database Settings
# ========================================
# データベースホスト（Dockerネットワーク内）
DB_HOST=db
# データベースポート番号
DB_PORT=5432
# データベースユーザー名
DB_USER=sampleuser
# データベースパスワード
DB_PASSWORD=samplepass
# データベース名
DB_NAME=sampledb

# ========================================
# Security Settings
# ========================================
# JWT署名用のシークレットキー（開発環境用）
JWT_SECRET=dev_jwt_secret_key_2024

# ========================================
# Development Settings
# ========================================
# Ginモード（開発時はdebug）
GIN_MODE=debug
EOF

    print_success ".env file created at $(pwd)/$ENV_FILE"
    
    echo ""
    print_info "推奨事項:"
    echo "  新しい環境管理システムを使用することをお勧めします:"
    echo "  make env-init ENV=development"
    echo ""
    print_info "次のステップ:"
    echo "  1. docker-compose up --build"
    echo "  2. http://localhost:8080/api/hello-world にアクセス"
}

# スクリプト実行
main "$@"
