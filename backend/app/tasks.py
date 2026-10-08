# tasks.py — convenience helpers for enqueueing Celery jobs.
# The actual task definitions live in celery_tasks.py.

from .celery_tasks import run_analysis


def enqueue_analysis(contract_path: str, contract_id: int = None) -> str:
    """Enqueue a run_analysis job and return the Celery job ID."""
    job = run_analysis.delay(contract_path, contract_id)
    return job.id
