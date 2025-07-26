#!/bin/bash

# ========================================
# Hello World API - Environment Manager
# ========================================
# 環境変数ファイルの管理スクリプト
# 各種環境用の.envファイルを生成・管理します

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

# ヘルプ表示
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  init [ENV]     - 環境変数ファイルを初期化"
    echo "  validate       - 環境変数ファイルを検証"
    echo "  backup         - 既存の.envファイルをバックアップ"
    echo "  restore [FILE] - バックアップから復元"
    echo "  list           - 利用可能な環境を一覧表示"
    echo "  help           - このヘルプを表示"
    echo ""
    echo "Environments:"
    echo "  development    - 開発環境（Docker使用）"
    echo "  test           - テスト環境（Docker DB使用）"
    echo "  local          - ローカル環境（ローカルDB使用）"
    echo "  production     - 本番環境"
    echo ""
    echo "Examples:"
    echo "  $0 init development"
    echo "  $0 init test"
    echo "  $0 validate"
    echo "  $0 backup"
}

# 環境変数ファイルの検証
validate_env_file() {
    local env_file="$1"
    
    if [ ! -f "$env_file" ]; then
        print_error "環境変数ファイルが見つかりません: $env_file"
        return 1
    fi
    
    print_info "環境変数ファイルを検証中: $env_file"
    
    # 必須環境変数のチェック
    local required_vars=("PORT" "DB_HOST" "DB_PORT" "DB_USER" "DB_PASSWORD" "DB_NAME" "JWT_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$env_file"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "必須環境変数が不足しています: ${missing_vars[*]}"
        return 1
    fi
    
    print_success "環境変数ファイルの検証が完了しました"
    return 0
}

# 環境変数ファイルの初期化
init_env_file() {
    local env_type="$1"
    local env_file=".env"
    
    if [ -z "$env_type" ]; then
        print_error "環境タイプを指定してください"
        show_help
        exit 1
    fi
    
    # 既存ファイルのバックアップ
    if [ -f "$env_file" ]; then
        print_warning "既存の.envファイルをバックアップします"
        backup_env_file
    fi
    
    # 環境タイプに応じたテンプレートファイル
    local template_file=""
    case "$env_type" in
        "development")
            template_file="config/env.development"
            ;;
        "test")
            template_file="config/env.test"
            ;;
        "local")
            template_file="config/env.local"
            ;;
        "production")
            template_file="config/env.production"
            ;;
        *)
            print_error "不明な環境タイプ: $env_type"
            echo "利用可能な環境: development, test, local, production"
            exit 1
            ;;
    esac
    
    if [ ! -f "$template_file" ]; then
        print_error "テンプレートファイルが見つかりません: $template_file"
        exit 1
    fi
    
    # 環境変数ファイルをコピー
    cp "$template_file" "$env_file"
    print_success "$env_type 環境用の.envファイルを作成しました"
    
    # 検証
    validate_env_file "$env_file"
}

# バックアップ作成
backup_env_file() {
    local env_file=".env"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file=".env.backup.$timestamp"
    
    if [ -f "$env_file" ]; then
        cp "$env_file" "$backup_file"
        print_success "バックアップを作成しました: $backup_file"
    else
        print_warning ".envファイルが見つかりません"
    fi
}

# バックアップから復元
restore_env_file() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        print_error "復元するバックアップファイルを指定してください"
        echo "利用可能なバックアップ:"
        ls -la .env.backup.* 2>/dev/null || echo "バックアップファイルが見つかりません"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "バックアップファイルが見つかりません: $backup_file"
        exit 1
    fi
    
    cp "$backup_file" ".env"
    print_success "バックアップから復元しました: $backup_file"
}

# 利用可能な環境を一覧表示
list_environments() {
    echo "利用可能な環境:"
    echo ""
    
    local env_files=("config/env.development" "config/env.test" "config/env.local" "config/env.production")
    
    for file in "${env_files[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file (未作成)"
        fi
    done
    
    echo ""
    echo "現在の.envファイル:"
    if [ -f ".env" ]; then
        echo "  ✅ .env"
        echo "    作成日時: $(stat -c %y .env 2>/dev/null || stat -f %Sm .env 2>/dev/null || echo '不明')"
    else
        echo "  ❌ .env (未作成)"
    fi
    
    echo ""
    echo "バックアップファイル:"
    local backups=$(ls -la .env.backup.* 2>/dev/null || echo "なし")
    echo "  $backups"
}

# メイン処理
main() {
    cd "$PROJECT_ROOT"
    
    case "$1" in
        "init")
            init_env_file "$2"
            ;;
        "validate")
            validate_env_file ".env"
            ;;
        "backup")
            backup_env_file
            ;;
        "restore")
            restore_env_file "$2"
            ;;
        "list")
            list_environments
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            print_error "不明なコマンド: $1"
            show_help
            exit 1
            ;;
    esac
}

# スクリプト実行
main "$@" 