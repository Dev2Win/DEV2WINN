from __future__ import annotations

import json

from app.evaluation import evaluate_matching_fixture


if __name__ == "__main__":
    print(json.dumps(evaluate_matching_fixture(), indent=2))
