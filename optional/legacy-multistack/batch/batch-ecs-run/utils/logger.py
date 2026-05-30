import json
from datetime import datetime, timezone
from typing import Any


class Logger:
    """構造化ログユーティリティ（Lambda/ECS統一フォーマット）"""

    def _format(self, level: str, message: str, context: dict[str, Any] | None = None) -> str:
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "message": message,
        }
        if context:
            entry["context"] = context
        return json.dumps(entry, ensure_ascii=False, default=str)

    def debug(self, message: str, context: dict[str, Any] | None = None) -> None:
        print(self._format("debug", message, context))

    def info(self, message: str, context: dict[str, Any] | None = None) -> None:
        print(self._format("info", message, context))

    def warn(self, message: str, context: dict[str, Any] | None = None) -> None:
        print(self._format("warn", message, context))

    def error(self, message: str, context: dict[str, Any] | None = None) -> None:
        print(self._format("error", message, context))


logger = Logger()
