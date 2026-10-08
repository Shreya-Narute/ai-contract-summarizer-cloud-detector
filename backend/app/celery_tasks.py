from .celery_worker import celery
from .utils.summarizer import chunked_summarize
from .utils.clause_detector import detect_clauses

import os
import json


@celery.task(bind=True)
def run_analysis(self, contract_path, contract_id=None):

    if not os.path.exists(contract_path):
        return {
            "status": "error",
            "detail": "file not found"
        }

    try:
        with open(
            contract_path,
            "r",
            encoding="utf-8",
            errors="ignore"
        ) as f:
            text = f.read()

    except Exception:
        text = ""

    self.update_state(
        state="PROGRESS",
        meta={
            "stage": "summarizing"
        }
    )

    summary = chunked_summarize(text[:20000])

    self.update_state(
        state="PROGRESS",
        meta={
            "stage": "clause_detection"
        }
    )

    clauses = detect_clauses(text)

    out_dir = os.path.join(
        "generated",
        "jobs"
    )

    os.makedirs(
        out_dir,
        exist_ok=True
    )

    out_path = os.path.join(
        out_dir,
        f"{self.request.id}.json"
    )

    payload = {
        "contract_id": contract_id,
        "summary": summary,
        "clauses": clauses
    }

    with open(
        out_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            payload,
            f,
            indent=2,
            ensure_ascii=False
        )

    return {
        "status": "done",
        "result_path": out_path,
        "summary": summary[:200],
        "clauses_count": len(clauses)
    }