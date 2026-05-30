"""GCP helpers for train: upload artifacts to GCS, log metrics to BigQuery.

MLOps 連携想定:
  - 学習アーティファクト (model.txt / metrics.json / feature_importance.csv) を
    gs://bucket/prefix/<run_id>/ にアップロード
  - 学習メトリクスを BigQuery の experiment テーブルに INSERT
    （Looker / Vertex Experiments からの可視化を念頭）
"""
from __future__ import annotations

import json
import socket
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


METRICS_SCHEMA = [
    {"name": "run_id", "type": "STRING", "mode": "REQUIRED"},
    {"name": "logged_at", "type": "TIMESTAMP", "mode": "REQUIRED"},
    {"name": "model", "type": "STRING", "mode": "REQUIRED"},
    {"name": "dataset", "type": "STRING", "mode": "NULLABLE"},
    {"name": "seed", "type": "INTEGER", "mode": "NULLABLE"},
    {"name": "rmse", "type": "FLOAT", "mode": "NULLABLE"},
    {"name": "mae", "type": "FLOAT", "mode": "NULLABLE"},
    {"name": "r2", "type": "FLOAT", "mode": "NULLABLE"},
    {"name": "best_iteration", "type": "INTEGER", "mode": "NULLABLE"},
    {"name": "artifact_uri", "type": "STRING", "mode": "NULLABLE"},
    {"name": "host", "type": "STRING", "mode": "NULLABLE"},
]


@dataclass(frozen=True)
class GcsPrefix:
    bucket: str
    prefix: str  # 先頭/末尾の '/' なし

    @classmethod
    def parse(cls, uri: str) -> "GcsPrefix":
        if not uri.startswith("gs://"):
            raise ValueError(f"gcs uri must start with gs://: {uri!r}")
        bucket, _, prefix = uri[len("gs://"):].partition("/")
        if not bucket:
            raise ValueError(f"bucket missing in {uri!r}")
        return cls(bucket=bucket, prefix=prefix.strip("/"))

    def child(self, sub: str) -> "GcsPrefix":
        new_prefix = "/".join(p for p in [self.prefix, sub.strip("/")] if p)
        return GcsPrefix(bucket=self.bucket, prefix=new_prefix)

    def uri(self, *parts: str) -> str:
        joined = "/".join(p.strip("/") for p in parts if p)
        base = f"gs://{self.bucket}"
        if self.prefix:
            base = f"{base}/{self.prefix}"
        return f"{base}/{joined}" if joined else base


def new_run_id() -> str:
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return f"{ts}-{uuid.uuid4().hex[:8]}"


def upload_directory(local_dir: Path, destination: GcsPrefix) -> list[str]:
    """local_dir 配下を再帰的にアップロードし、アップロードした GCS URI を返す。"""
    from google.cloud import storage  # type: ignore

    client = storage.Client()
    bucket = client.bucket(destination.bucket)
    uploaded: list[str] = []
    for path in sorted(local_dir.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(local_dir).as_posix()
        blob_name = f"{destination.prefix}/{rel}" if destination.prefix else rel
        blob = bucket.blob(blob_name)
        blob.upload_from_filename(str(path))
        uploaded.append(f"gs://{destination.bucket}/{blob_name}")
    return uploaded


def log_metrics_to_bigquery(
    *,
    table: str,
    run_id: str,
    metrics: dict,
    model_name: str,
    dataset: str | None,
    seed: int | None,
    artifact_uri: str | None,
) -> None:
    """`project.dataset.table` に 1 行 INSERT する。"""
    from google.cloud import bigquery  # type: ignore

    parts = table.split(".")
    if len(parts) != 3:
        raise ValueError(f"table must be project.dataset.table: {table!r}")

    client = bigquery.Client(project=parts[0])

    table_ref = bigquery.Table(
        table, schema=[bigquery.SchemaField(**f) for f in METRICS_SCHEMA]
    )
    # テーブルが無ければ作成 (冪等)
    client.create_table(table_ref, exists_ok=True)

    row = {
        "run_id": run_id,
        "logged_at": datetime.now(timezone.utc).isoformat(),
        "model": model_name,
        "dataset": dataset,
        "seed": seed,
        "rmse": metrics.get("rmse"),
        "mae": metrics.get("mae"),
        "r2": metrics.get("r2"),
        "best_iteration": metrics.get("best_iteration"),
        "artifact_uri": artifact_uri,
        "host": socket.gethostname(),
    }
    errors = client.insert_rows_json(table, [row])
    if errors:
        raise RuntimeError(f"BigQuery insert failed: {errors}")


def write_run_manifest(output_dir: Path, payload: dict) -> Path:
    """ローカルにも run manifest を残しておくと後段からの参照に便利。"""
    path = output_dir / "run.json"
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
    return path
