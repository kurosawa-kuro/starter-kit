#!/bin/bash

# ポート競合時のプロセスkillユーティリティ
# 使用方法: ./script/kill-backend-port.sh [PORT]

PORT=${1:-8080}

echo "🔍 ポート $PORT を使用しているプロセスを検索中..."

# ポートを使用しているプロセスを検索
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
    echo "✅ ポート $PORT を使用しているプロセスは見つかりませんでした。"
    exit 0
fi

echo "⚠️  ポート $PORT を使用しているプロセスが見つかりました:"
lsof -i:$PORT

echo ""
read -p "このプロセスを終了しますか？ (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 プロセスを終了中..."
    kill -9 $PID
    echo "✅ プロセス $PID を終了しました。"
else
    echo "❌ プロセスの終了をキャンセルしました。"
fi