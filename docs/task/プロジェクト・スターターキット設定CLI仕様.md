# プロジェクト・スターターキット設定CLI仕様

## 目的

新規プロジェクト作成時に、指定したディレクトリへ最低限必要なスターターキットのスケルトンを自動生成する。

docのテンプレートは
<repo>/docs/templates
<repo>/docs/templates/project-docs
を利用せよ

## 概要

Rust製CLIにプロジェクトの作成先フルパスを入力すると、事前に用意されたテンプレートファイルをもとに、指定ディレクトリ配下へ標準構成のファイル・ディレクトリを作成する。

## 実装言語

Rust

## 入力

### 引数

作成先プロジェクトディレクトリのフルパス。

例：

```bash
starter C:\dev\my-project
```

または PowerShell の場合：

```powershell
starter.exe C:\dev\my-project
```

## テンプレート構成

CLIは、あらかじめ用意されたテンプレートディレクトリをもとにファイルを生成する。
`secret.yaml` と `.gitignore` は初期構成に必ず含める。
`secret.yaml` はローカル秘密情報用であり、生成される `.gitignore` でコミット対象外にする。

```text
templates/
  .gitignore
  CLAUDE.md
  AGENTS.md
  Makefile
  README.md
  doppler.yaml
  env/
    config.yaml
    secret.yaml
  src/
  doc/
    01_仕様と設計.md
    02_移行ロードマップ.md
    03_実装カタログ.md
```

## 出力

指定されたディレクトリ配下に、以下のスケルトンを作成する。

```text
.gitignore
CLAUDE.md
AGENTS.md
Makefile
README.md
doppler.yaml
env/
  config.yaml
  secret.yaml
src/
doc/
  01_仕様と設計.md
  02_移行ロードマップ.md
  03_実装カタログ.md
```

## 作成内容

### ルート直下に作成するファイル

* `.gitignore`
* `CLAUDE.md`
* `AGENTS.md`
* `Makefile`
* `README.md`
* `doppler.yaml`

### 作成するディレクトリ

* `env`
* `src`
* `doc`

### `env` 配下に作成するファイル

* `env/config.yaml`
* `env/secret.yaml`

### `doc` 配下に作成するファイル

* `doc/01_仕様と設計.md`
* `doc/02_移行ロードマップ.md`
* `doc/03_実装カタログ.md`

## 挙動

1. CLI実行時に、作成先のフルパスを引数として受け取る。
2. 指定パスが存在しない場合は、ディレクトリを作成する。
3. テンプレートディレクトリを読み込む。
4. テンプレート内のディレクトリ構成を、作成先へ再現する。
5. テンプレート内のファイルを、作成先へコピーする。
6. 既存ファイルがある場合は、原則として上書きしない。
7. 作成完了後、作成したプロジェクトパスを表示する。

## 上書きルール

既存ファイルが存在する場合、デフォルトでは上書きしない。

```text
既存ファイルあり: スキップ
既存ファイルなし: テンプレートからコピー
```

## エラー条件

以下の場合はエラーとして処理を終了する。

* 作成先フルパスが指定されていない
* 指定パスにディレクトリを作成できない
* テンプレートディレクトリが存在しない
* テンプレートファイルを読み込めない
* ファイルまたはディレクトリの作成に失敗した
* ファイルコピーに失敗した

## 想定用途

* 新規PoCプロジェクトの初期化
* 個人開発プロジェクトの標準構成作成
* Claude Code / Codex / GitHub Copilot で扱いやすい初期ドキュメント配置
* 実装前に仕様・移行計画・実装カタログを整理するための土台作成

## 非対象

以下は本CLIでは扱わない。

* アプリケーションコードの自動生成
* npm / pnpm / yarn などの依存関係インストール
* Gitリポジトリ初期化
* Dopplerプロジェクト作成
* CI/CD設定の生成
* Docker / Kubernetes 構成の生成
