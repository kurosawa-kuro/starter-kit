#!/usr/bin/env python3
"""ECS Run Task バッチ処理サンプル"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from typing import Any

from utils import logger, save_batch_result


def get_batch_result(
    batch_id: str,
    status: str,
    message: str,
    details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """バッチ結果を生成"""
    return {
        "batchId": batch_id,
        "status": status,
        "message": message,
        "processedAt": datetime.now(timezone.utc).isoformat(),
        "eventType": "ecs-run",
        "details": details or {},
    }


def process_batch(batch_id: str) -> dict[str, Any]:
    """メインのバッチ処理ロジック"""
    logger.info("Starting batch processing", {"batchId": batch_id})

    # ECS タスク情報を取得
    task_arn = os.environ.get("ECS_TASK_ARN", "local")
    cluster = os.environ.get("ECS_CLUSTER", "default")

    details = {
        "taskArn": task_arn,
        "cluster": cluster,
        "environment": {
            "MONGODB_URI": "***" if os.environ.get("MONGODB_URI") else None,
        },
    }

    # ここにバッチ処理ロジックを追加
    logger.info("Processing batch job", {"batchId": batch_id})
    logger.info("Hello World from ECS Fargate RunTask!")

    return get_batch_result(
        batch_id=batch_id,
        status="success",
        message="Hello World from ECS Fargate RunTask!",
        details=details,
    )


def main() -> int:
    """エントリーポイント"""
    batch_id = str(uuid.uuid4())

    logger.info("ECS Task started", {"batchId": batch_id})

    try:
        result = process_batch(batch_id)

        # MongoDB に保存（MONGODB_URI が設定されている場合のみ）
        if os.environ.get("MONGODB_URI"):
            save_batch_result(result)

        logger.info("Batch processing completed", {
            "batchId": batch_id,
            "status": result["status"],
        })

        # 結果を出力
        print("=== Batch Result ===")
        print(json.dumps(result, indent=2, ensure_ascii=False))

        return 0

    except Exception as e:
        error_result = get_batch_result(
            batch_id=batch_id,
            status="error",
            message=str(e),
        )

        logger.error("Batch processing failed", {
            "batchId": batch_id,
            "error": str(e),
        })

        # エラー結果も MongoDB に保存
        if os.environ.get("MONGODB_URI"):
            save_batch_result(error_result)

        print("=== Batch Result (Error) ===")
        print(json.dumps(error_result, indent=2, ensure_ascii=False))

        return 1


if __name__ == "__main__":
    sys.exit(main())
