# Lambda Batch Hello World

AWS Lambda バッチ処理サンプルプロジェクト（MongoDB Atlas 連携）。

## 機能

- **batchId**: 各バッチ実行にUUIDを自動採番
- **構造化ログ**: JSON形式でCloudWatch Logsに出力
- **MongoDB保存**: バッチ結果を自動でMongoDB Atlasに保存
- **EventBridge対応**: スケジュール名（resources）を取得

## クイックスタート

```bash
# 依存関係インストール
make install

# Lambda関数を新規作成（初回のみ）
make create

# MongoDB URI 環境変数を設定
make env-set MONGODB_URI='mongodb+srv://user:pass@cluster.mongodb.net/starter?retryWrites=true&w=majority'

# コード更新時のデプロイ
make deploy

# テスト実行
make test
```

## MongoDB 設定

### データベース構成

| 項目 | 値 |
|------|-----|
| Database | `starter` |
| Collection | `batch_results` |

### 保存されるドキュメント例

```json
{
  "batchId": "7e62c160-bb2a-46da-8d93-0050ee424c6d",
  "status": "success",
  "message": "Hello World from Lambda Batch!",
  "processedAt": "2025-12-14T00:34:22.921Z",
  "eventType": "manual",
  "resources": [],
  "details": { "event": {} },
  "createdAt": "2025-12-14T00:34:23.841Z"
}
```

### 環境変数設定

```bash
# Lambda に MongoDB URI を設定
make env-set MONGODB_URI='mongodb+srv://user:password@cluster.mongodb.net/starter?retryWrites=true&w=majority'

# 現在の環境変数を確認
make env-get
```

## 初期セットアップ (AWS)

### 前提条件

- AWS CLI 設定済み（`aws configure`）
- Lambda 実行ロール `lambda-execution-role` が存在すること
- MongoDB Atlas クラスタが稼働中

### Lambda関数の作成

```bash
# 依存関係インストール + ビルド + Lambda作成
make install
make create

# MongoDB 環境変数を設定
make env-set MONGODB_URI='your-mongodb-uri'
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `make install` | npm 依存関係インストール |
| `make build` | TypeScript ビルド |
| `make zip` | デプロイパッケージ作成 |
| `make create` | Lambda 関数を新規作成（ビルド含む） |
| `make deploy` | ビルド → zip → Lambda 更新 |
| `make test` | Lambda 関数テスト実行 |
| `make invoke PAYLOAD='{"key":"value"}'` | カスタムペイロードでテスト |
| `make logs` | CloudWatch Logs をリアルタイム表示 |
| `make env-set MONGODB_URI='...'` | MongoDB URI 環境変数を設定 |
| `make env-get` | 現在の環境変数を確認 |
| `make delete` | Lambda 関数を削除 |
| `make clean` | ビルド成果物削除 |

## 対応イベントタイプ

### 1. 手動実行 / テスト

```bash
make test
make invoke PAYLOAD='{"message":"test"}'
```

### 2. EventBridge (CloudWatch Events)

定期実行（cron）やカスタムイベントからのトリガー。
`resources` フィールドにスケジュール名が含まれます。

```json
{
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "resources": ["arn:aws:events:ap-northeast-1:123456789012:rule/hello-batch-schedule"]
}
```

### 3. S3 / SQS イベント

S3バケットへのファイルアップロードやSQSメッセージにも対応。

## EventBridge ルール設定例

```bash
# AWSアカウントIDとリージョンを取得
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

# 5分ごとに実行するルール作成
aws events put-rule \
  --name hello-batch-schedule \
  --schedule-expression "rate(5 minutes)"

# Lambda関数をターゲットに設定
aws events put-targets \
  --rule hello-batch-schedule \
  --targets "Id"="1","Arn"="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:hello-batch"

# 実行権限を付与
aws lambda add-permission \
  --function-name hello-batch \
  --statement-id hello-batch-schedule \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn "arn:aws:events:${REGION}:${ACCOUNT_ID}:rule/hello-batch-schedule"
```

## プロジェクト構成

```
lambda-batch/
├── src/
│   ├── index.ts           # Lambda ハンドラー
│   └── utils/
│       ├── logger.ts      # 構造化ログユーティリティ
│       └── mongo.ts       # MongoDB ヘルパー
├── dist/                  # ビルド出力 (生成)
├── script/
│   └── test-lambda.sh     # テストスクリプト
├── package.json
├── tsconfig.json
├── Makefile
├── .env.example           # 環境変数テンプレート
└── README.md
```

## レスポンス形式

```json
{
  "batchId": "7e62c160-bb2a-46da-8d93-0050ee424c6d",
  "status": "success",
  "message": "Hello World from Lambda Batch!",
  "processedAt": "2025-12-14T00:34:22.921Z",
  "eventType": "manual",
  "details": { "event": {} }
}
```

## ログ形式

CloudWatch Logs には構造化JSONで出力されます：

```json
{
  "timestamp": "2025-12-14T00:34:22.921Z",
  "level": "info",
  "message": "Batch processing completed",
  "context": {
    "batchId": "7e62c160-bb2a-46da-8d93-0050ee424c6d",
    "status": "success"
  }
}
```

## Lambda 設定

| 項目 | 値 |
|------|-----|
| 関数名 | hello-batch |
| ランタイム | nodejs20.x |
| ハンドラー | index.handler |
| タイムアウト | 300秒（5分） |
| メモリ | 256MB |
| パッケージサイズ | 約300KB |
| 実行ロール | lambda-execution-role |
