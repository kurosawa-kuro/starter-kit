# ECS Run Task Hello World

AWS ECS Fargate RunTask バッチ処理サンプル（MongoDB Atlas 連携）。

## 機能

- **batchId**: 各バッチ実行にUUIDを自動採番
- **構造化ログ**: JSON形式でCloudWatch Logsに出力
- **MongoDB保存**: バッチ結果を自動でMongoDB Atlasに保存
- **Lambda互換**: Lambda Batch と同じレスポンス形式

## クイックスタート

```bash
# 初回セットアップ（AWS リソース作成）
make setup

# ビルド & プッシュ & 登録 & 実行
make all

# または個別に実行
make build      # Docker イメージビルド
make push       # ECR にプッシュ
make register   # タスク定義登録
make run        # タスク実行

# MongoDB 連携で実行
make run-with-env MONGODB_URI='mongodb+srv://user:pass@cluster.mongodb.net/starter'

# ログ確認
make logs
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
  "message": "Hello World from ECS Fargate RunTask!",
  "processedAt": "2025-12-14T00:34:22.921Z",
  "eventType": "ecs-run",
  "details": {
    "taskArn": "arn:aws:ecs:ap-northeast-1:123456789012:task/default/abc123",
    "cluster": "default"
  },
  "createdAt": "2025-12-14T00:34:23.841Z"
}
```

## コマンド一覧

### セットアップ

| コマンド | 説明 |
|---------|------|
| `make setup` | 全AWSリソース作成 |
| `make setup-iam` | IAMロール作成 |
| `make setup-ecr` | ECRリポジトリ作成 |
| `make setup-logs` | CloudWatch Log Group作成 |
| `make setup-cluster` | ECSクラスタ作成 |

### ビルド & デプロイ

| コマンド | 説明 |
|---------|------|
| `make build` | Dockerイメージビルド |
| `make push` | ECRにプッシュ |
| `make register` | タスク定義登録 |
| `make run` | タスク実行（MongoDB なし） |
| `make run-with-env MONGODB_URI='...'` | タスク実行（MongoDB あり） |
| `make all` | セットアップ→ビルド→プッシュ→登録→実行 |

### ローカル開発

| コマンド | 説明 |
|---------|------|
| `make local` | ローカルで実行（MongoDB なし） |
| `make local-mongo MONGODB_URI='...'` | ローカルで実行（MongoDB あり） |

### ユーティリティ

| コマンド | 説明 |
|---------|------|
| `make logs` | CloudWatch Logsをtail |
| `make status` | タスク状態確認 |
| `make clean` | 全AWSリソース削除 |
| `make help` | ヘルプ表示 |

## プロジェクト構成

```
ecs-run/
├── app.py              # メインバッチ処理
├── utils/
│   ├── __init__.py
│   ├── logger.py       # 構造化ログユーティリティ
│   └── mongo.py        # MongoDB ヘルパー
├── Dockerfile
├── requirements.txt
├── taskdef.json        # ECS タスク定義
├── Makefile
└── README.md
```

## レスポンス形式

Lambda Batch と同じ形式：

```json
{
  "batchId": "7e62c160-bb2a-46da-8d93-0050ee424c6d",
  "status": "success",
  "message": "Hello World from ECS Fargate RunTask!",
  "processedAt": "2025-12-14T00:34:22.921Z",
  "eventType": "ecs-run",
  "details": {
    "taskArn": "arn:aws:ecs:...",
    "cluster": "default"
  }
}
```

## ログ形式

CloudWatch Logs には構造化JSONで出力：

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

## ECS 設定

| 項目 | 値 |
|------|-----|
| タスク定義 | hello-run-task |
| クラスタ | default |
| 起動タイプ | FARGATE |
| CPU | 256 (0.25 vCPU) |
| メモリ | 512 MB |
| ネットワーク | awsvpc |

## Lambda Batch との比較

| 項目 | Lambda Batch | ECS Run Task |
|------|-------------|--------------|
| 実行時間上限 | 15分 | 無制限 |
| メモリ上限 | 10GB | 30GB (Fargate) |
| eventType | `manual`, `eventbridge`, `s3` | `ecs-run` |
| コールドスタート | あり | イメージプル時間 |
| 課金単位 | 1ms | 1秒 |
