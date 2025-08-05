#!/bin/bash

# display-doppler.sh
# Doppler secretsを表示するシェルスクリプト

set -e  # エラー時にスクリプトを停止

echo "Doppler secretsを表示しています..."

# Dopplerコマンドを実行
doppler secrets \
  --project "kuro-dev-k" \
  --config "dev_personal"

# 終了コードを取得
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo -e "\nDoppler process completed successfully"
else
    echo -e "\nDoppler process failed with exit code $exit_code"
    exit $exit_code
fi 