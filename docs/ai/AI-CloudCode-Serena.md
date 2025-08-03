# WSL Ubuntu環境でClaude-Code + Serenaを導入するガイド

## 目次
1. [概要](#概要)
2. [メリット](#メリット)
3. [前提条件](#前提条件)
4. [インストール手順](#インストール手順)
5. [設定と起動](#設定と起動)
6. [使い方](#使い方)
7. [トラブルシューティング](#トラブルシューティング)

## 概要

SerenaはオープンソースのMCPサーバーで、Claude-Codeの能力を大幅に拡張します。Language Server Protocol (LSP)を使用してコードをシンボルレベルで理解し、IDEのような高度な機能を提供します。

## メリット

### 🚀 パフォーマンス向上
- **シンボリックなコード理解**: テキスト検索ではなく、構造的なコード理解
- **効率的なコンテキスト管理**: 必要な部分のみアクセスし、トークン消費を削減
- **高速なナビゲーション**: 大規模プロジェクトでも迅速に目的のコードを発見

### 💰 コスト削減
- **無料でオープンソース**: APIキーや追加課金不要
- **トークン効率**: APIコストを50-80%削減可能
- **有料IDEの代替**: Cursor、Windsurf等の月額課金不要

### 🛠️ 強力な機能
- **多言語サポート**: Python、TypeScript、Go、Rust、C#、Java等
- **精密な編集**: シンボル単位での正確なコード変更
- **リファクタリング**: 複数ファイルにまたがる変更も安全に実行

## 前提条件

- WSL2 (Ubuntu 20.04以降)
- Node.js 18以上
- Git
- Anthropic APIキー（Claude-Code用）

## インストール手順

### 1. uvのインストール

```bash
# uvをインストール
curl -LsSf https://astral.sh/uv/install.sh | sh

# パスを設定（.bashrcに追加）
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 動作確認
uv --version
```

### 2. Claude-Codeのインストール

```bash
# Claude-Codeをグローバルインストール
npm install -g @anthropic-ai/claude-code

# 動作確認
claude --version
```

### 3. Serenaのセットアップ

```bash
# Serenaをクローン
git clone https://github.com/oraios/serena
cd serena

# 設定ディレクトリを作成
mkdir -p ~/.serena

# 設定ファイルをコピー
cp src/serena/resources/serena_config.template.yml ~/.serena/serena_config.yml

# 動作確認
uv run serena-mcp-server --help
```

## 設定と起動

### 1. プロジェクトディレクトリで実行

```bash
# プロジェクトディレクトリに移動
cd ~/your-project

# Claude-CodeにSerenaを追加（WSL環境用）
claude mcp add serena -- wsl -e /home/$USER/.local/bin/uv run --directory /home/$USER/serena serena-mcp-server --context ide-assistant --project $(pwd)
```

### 2. Claude-Codeの起動

```bash
# Claude-Codeを起動
claude

# 初回のみ：Serenaの初期設定を読み込み
/mcp__serena__initial_instructions
```

### 3. プロジェクトのインデックス作成（推奨）

```bash
# 大規模プロジェクトの場合、事前インデックスで高速化
uv run --directory ~/serena index-project
```

## 使い方

### 基本的なコマンド例

```bash
# シンボル検索
"find the getUserById function"

# リファクタリング
"rename all occurrences of oldFunctionName to newFunctionName"

# 実装の追加
"add error handling to the database connection function"

# テスト作成
"create unit tests for the UserService class"
```

### 効果的な使い方

1. **プロジェクトのアクティベート**
   ```
   "Activate the project /path/to/project"
   ```

2. **メモリの活用**
   ```
   "Create a memory about the current architecture"
   ```

3. **計画的な作業**
   ```
   "Plan the refactoring of the authentication module"
   ```

## トラブルシューティング

### よくある問題と解決方法

#### 1. パスが通らない
```bash
# 手動でパスを確認
which uv
# 出力がない場合は再度パスを設定
export PATH="$HOME/.local/bin:$PATH"
```

#### 2. プロセスが残る
```bash
# Serenaプロセスを確認
ps aux | grep serena

# 必要に応じて終了
pkill -f serena
```

#### 3. Webダッシュボードへのアクセス
- デフォルト: http://localhost:24282/dashboard/index.html
- 複数インスタンスの場合: ポート24283, 24284...を試す

### ログの確認

```bash
# ログディレクトリ
ls ~/.serena/logs/

# 最新のログを確認
tail -f ~/.serena/logs/$(date +%Y-%m-%d)/mcp_*.txt
```

## ベストプラクティス

1. **Gitの活用**: 作業前にクリーンな状態から開始
2. **適切な構造化**: 良い構造のコードほど効果的
3. **型アノテーション**: 動的型付け言語でも型ヒントを活用
4. **テストの充実**: Serenaは実行結果から学習

## まとめ

Serena + Claude-Codeの組み合わせにより：
- ✅ 無料で強力なコーディングアシスタント
- ✅ 大規模プロジェクトでも高速・正確
- ✅ APIコストを大幅削減
- ✅ 有料IDEサブスクリプション不要

これで、WSL Ubuntu環境で最強のAIコーディング環境が構築できます。