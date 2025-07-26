#!/bin/bash

# ========================================
# Hello World API - Local Test Environment Generator
# ========================================
# ローカルテスト環境用の.env.localファイルを生成します
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
    
    ENV_FILE=".env.local"
    
    print_info "ローカルテスト環境用の.env.localファイルを生成します"
    
    # 既存の.env.localファイルがある場合はバックアップ
    if [ -f "$ENV_FILE" ]; then
        print_warning "$ENV_FILE already exists. Creating backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        cp "$ENV_FILE" "${ENV_FILE}.backup.$timestamp"
        print_success "バックアップを作成しました: ${ENV_FILE}.backup.$timestamp"
    fi
    
    # ローカルテスト用の.env.localファイルを作成
    cat <<EOF > "$ENV_FILE"
# ========================================
# Hello World API - Local Test Environment
# ========================================
# ローカルテスト環境用の設定ファイル
# ローカルにPostgreSQLがインストールされている必要があります

# ========================================
# Application Settings
# ========================================
# アプリケーションのポート番号
PORT=8080

# ========================================
# Database Settings
# ========================================
# データベースホスト（ローカル接続用）
DB_HOST=localhost
# データベースポート番号
DB_PORT=5432
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

    print_success ".env.local file created at $(pwd)/$ENV_FILE"
    
    # ローカルPostgreSQLの確認
    print_info "ローカルPostgreSQLの確認中..."
    if command -v psql > /dev/null; then
        print_success "PostgreSQL client (psql) が見つかりました"
        
        # データベース接続テスト
        if PGPASSWORD=samplepass psql -h localhost -U sampleuser -d sampledb_test -c "SELECT 1;" > /dev/null 2>&1; then
            print_success "ローカルPostgreSQLに接続できました"
        else
            print_warning "ローカルPostgreSQLに接続できませんでした"
            echo "   以下のコマンドでデータベースを作成してください："
            echo "   createdb -U sampleuser sampledb_test"
            echo "   または、DockerでPostgreSQLを起動してください："
            echo "   docker run --name postgres-test -e POSTGRES_USER=sampleuser -e POSTGRES_PASSWORD=samplepass -e POSTGRES_DB=sampledb_test -p 5432:5432 -d postgres:15"
        fi
    else
        print_warning "PostgreSQL client (psql) が見つかりません"
        echo "   ローカルテストにはPostgreSQLのインストールが必要です"
    fi
    
    echo ""
    print_info "推奨事項:"
    echo "  新しい環境管理システムを使用することをお勧めします:"
    echo "  make env-init ENV=local"
    echo ""
    print_info "ローカルテスト実行手順："
    echo "1. ローカルPostgreSQLを起動"
    echo "2. データベースを作成: createdb -U sampleuser sampledb_test"
    echo "3. スキーマを適用: psql -U sampleuser -d sampledb_test -f db/init.sql"
    echo "4. テストを実行: make test-local-db"
    echo ""
    print_info "参考リンク："
    echo "- PostgreSQL インストール: https://www.postgresql.org/download/"
    echo "- ローカルテスト実行: make test-local-db"
}

# スクリプト実行
main "$@" 