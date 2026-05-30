#!/bin/bash

# ========================================
# Hello World API - Test Environment Generator
# ========================================
# Docker前提のテスト環境用の.env.testファイルを生成します

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
    
    ENV_FILE=".env.test"
    
    print_info "Docker前提のテスト環境用の.env.testファイルを生成します"
    
    # 既存の.env.testファイルがある場合はバックアップ
    if [ -f "$ENV_FILE" ]; then
        print_warning "$ENV_FILE already exists. Creating backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        cp "$ENV_FILE" "${ENV_FILE}.backup.$timestamp"
        print_success "バックアップを作成しました: ${ENV_FILE}.backup.$timestamp"
    fi
    
    # テスト用の.env.testファイルを作成
    cat <<EOF > "$ENV_FILE"
# ========================================
# Hello World API - Test Environment
# ========================================
# Docker前提のテスト環境用の設定ファイル
# docker-compose.test.ymlで起動されるPostgreSQLを使用

# ========================================
# Application Settings
# ========================================
# アプリケーションのポート番号
PORT=8080

# ========================================
# Database Settings
# ========================================
# データベースホスト（Dockerネットワーク内）
DB_HOST=localhost
# データベースポート番号（テスト用ポート）
DB_PORT=15434
# データベースユーザー名
DB_USER=sampleuser
# データベースパスワード
DB_PASSWORD=samplepass
# データベース名（テスト用）
DB_NAME=sampledb_test

# ========================================
# Security Settings
# ========================================
# JWT署名用のシークレットキー（テスト環境用）
JWT_SECRET=test_jwt_secret_key_2024

# ========================================
# Test Settings
# ========================================
# Ginモード（テスト時はtest）
GIN_MODE=test
EOF

    print_success ".env.test file created at $(pwd)/$ENV_FILE"
    
    echo ""
    print_info "テスト実行手順："
    echo "1. テスト用DBを起動: make test-db-up"
    echo "2. テストを実行: make test"
    echo "3. テスト用DBを停止: make test-db-down"
    echo ""
    print_info "または、一括実行："
    echo "  make test  # テスト用DBの起動→テスト実行→停止を自動実行"
    echo ""
    print_info "pgAdmin（テスト用）:"
    echo "  http://localhost:5051 (admin@example.com / adminpass)"
} 