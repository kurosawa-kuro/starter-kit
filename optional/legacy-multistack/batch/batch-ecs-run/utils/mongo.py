import os
from datetime import datetime, timezone
from typing import Any

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from .logger import logger

MONGODB_URI = os.environ.get("MONGODB_URI", "")
DB_NAME = "starter"
COLLECTION_NAME = "batch_results"

_client: MongoClient | None = None


def get_client() -> MongoClient:
    """MongoDBクライアントを取得（シングルトン）"""
    global _client
    if _client is None:
        if not MONGODB_URI:
            raise ValueError("MONGODB_URI environment variable is not set")
        logger.info("Creating new database connection")
        _client = MongoClient(MONGODB_URI)
        logger.info("Database connection established", {"database": DB_NAME})
    return _client


def save_batch_result(result: dict[str, Any]) -> None:
    """バッチ結果をMongoDBに保存"""
    try:
        client = get_client()
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        document = {
            **result,
            "createdAt": datetime.now(timezone.utc),
        }

        collection.insert_one(document)

        logger.info(
            "Batch result saved to MongoDB",
            {"batchId": result.get("batchId"), "collection": COLLECTION_NAME},
        )
    except PyMongoError as e:
        logger.error(
            "Failed to save batch result to MongoDB",
            {"error": str(e), "batchId": result.get("batchId")},
        )
        # MongoDB保存失敗はバッチ処理全体を失敗させない


def close_connection() -> None:
    """MongoDB接続をクローズ"""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        logger.info("Database connection closed")
