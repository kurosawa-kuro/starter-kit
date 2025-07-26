# FastAPI Hello World

シンプルなFastAPI Hello Worldアプリケーションです。

## セットアップ

### 1. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 2. アプリケーションの起動

```bash
# 方法1: uvicornコマンドを使用
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 方法2: Pythonスクリプトを直接実行
python main.py
```

## API エンドポイント

### ルートエンドポイント
- **GET** `/` - Hello Worldメッセージを返す

### Hello エンドポイント
- **GET** `/hello/{name}` - 指定された名前でHelloメッセージを返す

### ヘルスチェック
- **GET** `/health` - サービスヘルスチェック

## API ドキュメント

アプリケーション起動後、以下のURLでAPIドキュメントにアクセスできます：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 使用例

```bash
# ルートエンドポイント
curl http://localhost:8000/

# 名前付きHello
curl http://localhost:8000/hello/World

# ヘルスチェック
curl http://localhost:8000/health
```

## レスポンス例

```json
{
  "message": "Hello World"
}
``` 