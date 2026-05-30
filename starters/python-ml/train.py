import argparse
import json
from pathlib import Path

import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from gcp import (
    GcsPrefix,
    log_metrics_to_bigquery,
    new_run_id,
    upload_directory,
    write_run_manifest,
)


def load_data():
    dataset = fetch_california_housing(as_frame=True)
    X = dataset.data
    y = dataset.target
    return X, y, dataset.feature_names


MODEL_NAME = "lightgbm-california-housing"
DATASET_NAME = "sklearn.fetch_california_housing"


def train(
    output_dir: Path,
    seed: int = 42,
    *,
    gcs_prefix: str | None = None,
    bq_metrics_table: str | None = None,
    run_id: str | None = None,
):
    X, y, feature_names = load_data()

    X_trainval, X_test, y_trainval, y_test = train_test_split(
        X, y, test_size=0.2, random_state=seed
    )
    X_train, X_valid, y_train, y_valid = train_test_split(
        X_trainval, y_trainval, test_size=0.2, random_state=seed
    )

    train_set = lgb.Dataset(X_train, label=y_train)
    valid_set = lgb.Dataset(X_valid, label=y_valid, reference=train_set)

    params = {
        "objective": "regression",
        "metric": "rmse",
        "learning_rate": 0.05,
        "num_leaves": 63,
        "feature_fraction": 0.9,
        "bagging_fraction": 0.9,
        "bagging_freq": 5,
        "min_data_in_leaf": 20,
        "verbose": -1,
        "seed": seed,
    }

    model = lgb.train(
        params,
        train_set,
        num_boost_round=2000,
        valid_sets=[train_set, valid_set],
        valid_names=["train", "valid"],
        callbacks=[
            lgb.early_stopping(stopping_rounds=50),
            lgb.log_evaluation(period=100),
        ],
    )

    y_pred = model.predict(X_test, num_iteration=model.best_iteration)
    metrics = {
        "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
        "mae": float(mean_absolute_error(y_test, y_pred)),
        "r2": float(r2_score(y_test, y_pred)),
        "best_iteration": int(model.best_iteration),
    }

    importance = pd.DataFrame(
        {
            "feature": feature_names,
            "gain": model.feature_importance(importance_type="gain"),
            "split": model.feature_importance(importance_type="split"),
        }
    ).sort_values("gain", ascending=False)

    output_dir.mkdir(parents=True, exist_ok=True)
    model.save_model(str(output_dir / "model.txt"))
    (output_dir / "metrics.json").write_text(json.dumps(metrics, indent=2))
    importance.to_csv(output_dir / "feature_importance.csv", index=False)

    resolved_run_id = run_id or new_run_id()
    artifact_uri: str | None = None
    if gcs_prefix:
        destination = GcsPrefix.parse(gcs_prefix).child(resolved_run_id)
        uploaded = upload_directory(output_dir, destination)
        artifact_uri = destination.uri()
        print(f"\nUploaded {len(uploaded)} artifact(s) to {artifact_uri}")

    manifest = {
        "run_id": resolved_run_id,
        "model": MODEL_NAME,
        "dataset": DATASET_NAME,
        "seed": seed,
        "metrics": metrics,
        "artifact_uri": artifact_uri,
    }
    write_run_manifest(output_dir, manifest)

    if bq_metrics_table:
        log_metrics_to_bigquery(
            table=bq_metrics_table,
            run_id=resolved_run_id,
            metrics=metrics,
            model_name=MODEL_NAME,
            dataset=DATASET_NAME,
            seed=seed,
            artifact_uri=artifact_uri,
        )
        print(f"Logged metrics to BigQuery table {bq_metrics_table}")

    print("\n=== Test metrics ===")
    for name, value in metrics.items():
        print(f"{name}: {value}")
    print("\n=== Feature importance (gain) ===")
    print(importance.to_string(index=False))
    print(f"\nArtifacts saved to: {output_dir.resolve()}")
    print(f"Run id: {resolved_run_id}")

    return model, metrics


def main():
    parser = argparse.ArgumentParser(description="Train LightGBM on California housing.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).parent / "artifacts",
        help="Directory to save the trained model and metrics.",
    )
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--gcs-prefix",
        help="Upload artifacts under this GCS prefix (e.g. gs://my-bucket/models)",
    )
    parser.add_argument(
        "--bq-metrics-table",
        help="BigQuery table to log metrics to (project.dataset.table)",
    )
    parser.add_argument(
        "--run-id",
        help="Custom run id (default: timestamp-uuid)",
    )
    args = parser.parse_args()

    train(
        args.output_dir,
        seed=args.seed,
        gcs_prefix=args.gcs_prefix,
        bq_metrics_table=args.bq_metrics_table,
        run_id=args.run_id,
    )


if __name__ == "__main__":
    main()
