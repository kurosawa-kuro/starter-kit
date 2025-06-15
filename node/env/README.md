# 環境変数管理モジュール

このモジュールは、アプリケーションの環境変数管理を一元化し、異なる環境（開発、テスト、ステージング、本番）での設定を効率的に管理するためのツールを提供します。
package.jsのscriptからどの環境課をcross envで取得
コードの中で適切なenvとして環境変数ファイルからすべての環境変数を読み込む

aws ssm k8s secretで問題を起こさないかを事前チェック依頼

## 機能

- 環境ごとの設定ファイル管理（.env.*）
- 環境変数の検証機能
- 環境に応じたアプリケーション起動
- クロスプラットフォーム対応

## 必要条件

- Node.js 16.x以上
- npm 8.x以上

## インストール

```bash
# 依存関係のインストール
make install
```

## 使用方法

### 環境変数の検証

```bash
# 環境変数の設定を検証
make validate
```

### 環境ごとの起動

```bash
# 開発環境
make dev

# テスト環境
make test

# ステージング環境
make stag

# 本番環境
make prod
```

### 利用可能なコマンド

```bash
# コマンド一覧の表示
make help
```

## 環境設定ファイル

各環境に対応する設定ファイルを作成してください：

- `.env.dev` - 開発環境
- `.env.test` - テスト環境
- `.env.stag` - ステージング環境
- `.env.prod` - 本番環境

### 必須の環境変数

```env
# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# アプリケーション設定
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# セキュリティ設定
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## 開発ガイドライン

1. 新しい環境変数を追加する場合：
   - 各`.env.*`ファイルに追加
   - `environment.js`で型定義を追加
   - 必要に応じて`validate-env.js`に検証ロジックを追加

2. 環境変数の命名規則：
   - 大文字とアンダースコアを使用
   - プレフィックスでカテゴリを明示（例：`DB_`, `API_`）

## トラブルシューティング

### 一般的な問題

1. 環境変数が読み込まれない場合：
   - ファイル名が正しいか確認
   - ファイルのパーミッションを確認
   - ファイルの文字コードがUTF-8であることを確認

2. 検証エラーが発生する場合：
   - 必須の環境変数が設定されているか確認
   - 値の形式が正しいか確認

## ライセンス

ISC

すべての環境パターンを抽出整理依頼

| スクリプト名            | `.env` ファイル名     | 想定用途            | 備考・使用例                    |
| ----------------- | ---------------- | --------------- | ------------------------- |
| `serve:dev`       | `.env.dev`       | ローカル開発用         | kind環境やlocalhost向け。開発者操作。 |
| `serve:test`      | `.env.test`      | ローカルユニット／統合テスト用 | Jest, SuperTest など        |
| `serve:stag`      | `.env.stag`      | ステージング環境用（手動確認） | Lightsail／EKSステージング       |
| `serve:stag-test` | `.env.stag.test` | ステージング環境の自動テスト用 | GitHub Actions などCI/CD    |
| `serve:prod`      | `.env.prod`      | 本番環境の本番起動用      | EKS本番クラスター向け              |
| `serve:prod-test` | `.env.prod.test` | 本番環境のテスト／監視用途   | ロールアウト前の監視確認など            |

