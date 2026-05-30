# Render API (Hono)

Render.comへデプロイするHono APIのサンプルです。

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（ホットリロード）
npm run dev

# ビルド
npm run build

# 本番起動
npm start
```

## エンドポイント

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Hello World |
| GET | `/health` | ヘルスチェック |
| GET | `/api/hello` | APIサンプル |
| GET | `/api/hello/:name` | パラメータ付き |
| POST | `/api/echo` | リクエストボディを返す |

## Renderへのデプロイ

### 方法1: render.yaml（Blueprint）

1. GitHubにプッシュ
2. Renderダッシュボードで「New Blueprint」
3. リポジトリを選択
4. `render.yaml`が自動検出される

### 方法2: 手動設定

1. Renderダッシュボードで「New Web Service」
2. 設定:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

## 環境変数

| 変数 | 説明 | デフォルト |
|------|------|-----------|
| `PORT` | サーバーポート | 3000 |
| `NODE_ENV` | 環境 | - |

## 動作確認

```bash
# Hello World
curl http://localhost:3000/

# ヘルスチェック
curl http://localhost:3000/health

# パラメータ付き
curl http://localhost:3000/api/hello/World

# POST
curl -X POST http://localhost:3000/api/echo \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```
