# スターターキット構成方針

## 目的

最近よく使う技術を前提に、プロジェクト作成時に選びやすいスターターキット構成へ整理する。

## 基本方針

スターターキットは、利用頻度が高い技術から優先して用意する。

優先順位は以下とする。

1. Rust
2. Python
3. Terraform
4. バッチ

API（フロントは React 等のポート分離はできるだけ避ける。HTML テンプレートで我慢する）。

## 技術別スターター構成

### 1. Rust

最優先のスターターキットとする。主な用途は CLI / バッチ処理 / API / 小規模ツール /
高速なユーティリティ。

API を作成する場合は、原則として `axum` を使用する。

想定スターター: `rust-cli` / `rust-batch` / `rust-api-axum` / `rust-api-axum-fullstack`

### 2. Python

AI / ML / GCP 関連のプロジェクトで使用する。主な用途は単純バッチ / AI 関連処理 /
ML モデル学習 / GCP 連携 / データ処理 / ML アプリ用 API。

ML では、原則として `scikit-learn` と `LightGBM` を使用する。
ML アプリの API を作成する場合は `FastAPI` を使用する。

想定スターター: `python-batch` / `python-ml` / `python-gcp` / `python-api-fastapi`

### 3. Terraform

IaC 用のスターターキット。インフラ構成管理 / クラウドリソース管理 / GCP・AWS の環境構築。

想定スターター: `terraform`

### 4. バッチ

簡易的なローカル実行や補助スクリプト用。ただし基本方針としては Rust を優先する。

想定スターター: `batch`

## API 構成方針

```text
通常 API       : Rust + axum
ML アプリ API  : Python + FastAPI
```

## フロントエンド方針

フロントエンドは、できるだけ専属のフロントエンド技術を使わずに簡略化する。
React / Next.js などは原則として使わない。必要な画面は以下で対応する。

* Jinja
* HTML テンプレート
* 最小限の CSS
* 必要最小限の JavaScript

この方針を体現する `admin-pico`（Pico CSS の静的 HTML テンプレート）は、フロント用の
**メイン級スターター**として `starters/` に置く。

## スターター一覧（優先順）

```text
starters/
  rust-cli/             # 1
  rust-batch/           # 2
  rust-api-axum/        # 3
  rust-api-axum-fullstack/  # 4
  python-batch/         # 5
  python-ml/            # 6
  python-gcp/           # 7
  python-api-fastapi/   # 8
  terraform/            # 9
  batch/                # 10
  admin-pico/           # フロント方針(HTML/最小JS)を体現するメイン級
```

## 目立たせない方針（含めるが優先しない）

> 補足: 当初は「含めない（非方針）」としていたが、**削除はせず「目立たせない」**運用に変更した。
> 既存資産は捨てず、`optional/` に退避して通常は前面に出さない。

以下は基本スターターには含めず、`optional/` に配置して目立たせない。

* React
* Next.js
* フロントエンド専用構成（admin: React/Vue/Next/Nuxt 等）
* 過度なマイクロサービス構成
* 不要な CI/CD 構成
* 最初から複雑な Docker / Kubernetes 構成
* 多言語レガシー雛形（Go / JVM / Express など: `optional/legacy-multistack/`）

プロジェクト生成器（旧 `starter-cli`）は `tools/project-generator/` に置く。
