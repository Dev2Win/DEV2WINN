from __future__ import annotations

import json
import logging

try:
    import structlog
except ImportError:  # pragma: no cover - depends on local Python env
    structlog = None


def configure_logging() -> None:
    if structlog is None:
        logging.basicConfig(level=logging.INFO, format="%(message)s")
        return
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(0),
        cache_logger_on_first_use=True,
    )


def logger(name: str):
    if structlog is not None:
        return structlog.get_logger(name)
    return StdlibJsonLogger(name)


class StdlibJsonLogger:
    def __init__(self, name: str) -> None:
        self._logger = logging.getLogger(name)

    def info(self, event: str, **kwargs) -> None:
        self._logger.info(json.dumps({"event": event, **kwargs}, default=str))
