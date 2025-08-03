Claude CLIのインストールでエラーが発生しているようですね。既存のインストールと競合しているようです。以下の手順で解決しましょう：

## 1. 既存のClaude CLIを完全に削除

```bash
# 既存のclaude-codeディレクトリを削除
sudo rm -rf /home/wsl/.npm-global/lib/node_modules/@anthropic-ai/claude-code

# claude-codeの関連ファイルも削除
sudo rm -rf /home/wsl/.npm-global/lib/node_modules/@anthropic-ai/.claude-code-*

# シンボリックリンクも削除
sudo rm -f /home/wsl/.npm-global/bin/claude
sudo rm -f /home/wsl/.npm-global/bin/cc
```

## 2. npmキャッシュをクリア

```bash
# npmキャッシュをクリア
npm cache clean --force
```

## 3. Claude CLIを再インストール

```bash
npm install -g @anthropic-ai/claude-code --omit=optional --loglevel=info


# 詳細ログ付きインストール（トラブルシューティング用）
npm install -g @anthropic-ai/claude-code --verbose --progress

# グローバルインストール
npm install -g @anthropic-ai/claude-code

# または、権限エラーが出る場合
sudo npm install -g @anthropic-ai/claude-code
```

## 4. インストール確認

```bash
# バージョン確認
claude --version

# またはエイリアスで
cc --version
```

## 5. パスの確認（必要な場合）

```bash
# npmグローバルbinのパスを確認
npm bin -g

# PATHに含まれているか確認
echo $PATH | grep -o '/home/wsl/.npm-global/bin'

# もしPATHに含まれていない場合、.bashrcに追加
echo 'export PATH="$PATH:/home/wsl/.npm-global/bin"' >> ~/.bashrc
source ~/.bashrc
```

これで `cc` コマンドが使えるようになるはずです。もし問題が続く場合は、以下も試してください：

```bash
# npmの設定確認
npm config get prefix

# 必要に応じてprefixを設定
npm config set prefix ~/.npm-global
```
