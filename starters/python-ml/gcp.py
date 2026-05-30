"""Backward-compatible exports for older imports.

New code should import from `housing_ml.infra.gcs`,
`housing_ml.infra.bigquery`, and `housing_ml.registry.manifest`.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from housing_ml.infra.bigquery import METRICS_SCHEMA, log_metrics_to_bigquery
from housing_ml.infra.gcs import GcsPrefix, upload_directory
from housing_ml.registry.manifest import new_run_id, write_run_manifest

__all__ = [
    "GcsPrefix",
    "METRICS_SCHEMA",
    "log_metrics_to_bigquery",
    "new_run_id",
    "upload_directory",
    "write_run_manifest",
]
