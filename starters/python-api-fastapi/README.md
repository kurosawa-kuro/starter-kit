# Python FastAPI Starter

ML アプリや小さな CRUD API 向けの FastAPI スターター。

Jinja テンプレートを使い、専用フロントエンドを立てずに最小の Web UI を提供する。Cloud Run / GKE で拾いやすい structured logging helper も含む。

## 構成

```text
main.py          # FastAPI app / routes
database.py      # SQLite + SQLAlchemy session
models.py        # Micropost model
gcp.py           # Cloud Logging style middleware
templates/       # Jinja templates
tests/           # unit tests
e2e/             # e2e tests
```

## セットアップ

```bash
python3 -m venv venv
source venv/bin/activate
make install
```

## 起動

```bash
make run
```

確認:

```bash
curl http://127.0.0.1:8000/healthz
```

## テスト

```bash
make test
```

## 設定

デフォルトではローカル SQLite を使う。生成される `microposts.db` は `.gitignore` 対象。

Cloud Logging 風の JSON ログを有効にする場合:

```bash
GCP_LOGGING_ENABLED=1 make run
```

## 公開安全

- `microposts.db` はコミットしない。
- 実 `DATABASE_URL`、service account、API key、token は置かない。
- サンプルデータは fixture / dummy のみ使う。
