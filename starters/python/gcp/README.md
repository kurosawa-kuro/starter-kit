# Python GCP Batch Starter

SQLite のローカル CRUD を起点に、GCS / BigQuery へエクスポートする Python バッチスターター。

GCP 連携は任意。ローカル実行だけなら Google Cloud 認証は不要。

## 構成

```text
main.py       # argparse CLI
database.py   # SQLite + SQLAlchemy session
models.py     # Micropost model
gcp.py        # GCS / BigQuery helpers
```

## セットアップ

```bash
python3 -m venv venv
source venv/bin/activate
make install
```

## ローカル実行

```bash
make seed
make list
```

CLI:

```bash
python3 main.py create --title "Hello" --content "Local batch"
python3 main.py list
python3 main.py export-gcs --output posts.ndjson
```

## GCS / BigQuery

GCS:

```bash
python3 main.py export-gcs --gcs-uri gs://your-bucket/path/posts.ndjson
```

BigQuery:

```bash
python3 main.py export-bq --table your-project.your_dataset.microposts
```

## 公開安全

- `microposts.db`、`*.ndjson`、実 GCS URI、実 Project ID はコミットしない。
- service account key は置かない。ローカルでは ADC や Workload Identity を使う。
- 実データではなくダミーデータで動作確認する。
