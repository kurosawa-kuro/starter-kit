#!/bin/bash

# UbuntuでのNode.jsとGoのインストールスクリプト

echo "=== Ubuntu環境での開発環境セットアップ ==="

# システムパッケージの更新
echo "システムパッケージを更新中..."
sudo apt update && sudo apt upgrade -y

# Node.jsのインストール
echo "Node.jsをインストール中..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Node.jsのバージョン確認
echo "Node.jsバージョン:"
node --version
echo "npmバージョン:"
npm --version

# Goのインストール
echo "Goをインストール中..."
GO_VERSION="1.21.5"
wget https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz
rm go${GO_VERSION}.linux-amd64.tar.gz

# Goのパス設定
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin

# Goのバージョン確認
echo "Goバージョン:"
go version

# 依存関係のインストール
echo "プロジェクトの依存関係をインストール中..."
if [ -f "package.json" ]; then
    npm install
fi

if [ -f "go.mod" ]; then
    go mod download
fi

echo "=== インストール完了 ==="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Go: $(go version)" 