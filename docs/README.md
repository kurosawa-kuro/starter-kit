# docs/ — ドキュメント地図

starter-kit のドキュメント全体のインデックス。トピックごとにサブフォルダへ整理してある。目的のフォルダから辿る。

> Claude Code / 開発者はまずここを見れば、どこに何が書いてあるか把握できる。

---

## サブフォルダ一覧

| フォルダ | 内容 | 主なファイル |
|---|---|---|
| [`guides/`](./guides/) | リポジトリ共通の開発方針・ルール | [development-principles.md](./guides/development-principles.md) — ポート規約 / Makefile タスク / ディレクトリ雛形などの共通基本方針 |
| [`web-frameworks/`](./web-frameworks/) | Web フレームワーク別の参照ブループリント | [README](./web-frameworks/README.md) / [express](./web-frameworks/express.md) / [hono](./web-frameworks/hono.md) / [go-chi](./web-frameworks/go-chi.md) / [go-gin](./web-frameworks/go-gin.md) / [java-springboot](./web-frameworks/java-springboot.md) / [kotlin-springboot](./web-frameworks/kotlin-springboot.md) / [vue](./web-frameworks/vue.md) |
| [`database/`](./database/) | データベース運用・開発環境ガイド | [postgresql-commands.md](./database/postgresql-commands.md) — 管理コマンド集 / [postgresql-dev-guide.md](./database/postgresql-dev-guide.md) — 開発環境ベストプラクティス |
| [`ai-tools/`](./ai-tools/) | AI 開発ツールのセットアップ | [claude-code-setup.md](./ai-tools/claude-code-setup.md) — Claude CLI 導入/トラブルシュート / [claude-code-serena.md](./ai-tools/claude-code-serena.md) — Serena (LSP MCP) 連携 |
| [`prompts/`](./prompts/) | AI 向けプロンプト雛形 | [project-skeleton.md](./prompts/project-skeleton.md) — 新規プロジェクトの最小スケルトン生成プロンプト |
| [`templates/`](./templates/) | 新規プロジェクト立ち上げ用のドキュメント雛形(下記の注記参照) | [project-docs/](./templates/project-docs/) |

---

## ⚠️ `templates/` についての注記

[`templates/project-docs/`](./templates/project-docs/) に入っている `01_仕様と設計.md`〜`04_運用.md` と
その `README.md` は **この starter-kit 本体の仕様ではない**。

これらは MLOps/GCP プロジェクトを題材にした「AI フレンドリーなプロジェクトを立ち上げるときの
ドキュメント構成・運用ルールの実例雛形」であり、新規プロジェクトを作る際にコピーして使うための
参照テンプレートとして残している。**本体の仕様・運用情報と混同しないこと。**

雛形の使い方は [prompts/project-skeleton.md](./prompts/project-skeleton.md) を参照。

---

## 関連

- リポジトリ全体の概要・クイックスタート → [`../README.md`](../README.md)
- Claude Code 向け作業ガイド・各スタックのコマンド → [`../CLAUDE.md`](../CLAUDE.md)
