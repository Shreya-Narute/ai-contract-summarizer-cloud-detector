from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os, uuid, time

from ..celery_worker import celery
from ..celery_tasks import run_analysis
from ..models import Contract, User
from .deps import get_db, get_current_user

router = APIRouter(prefix='/jobs')


class JobSubmit(BaseModel):
    # Frontend should send a previously uploaded contract_id or raw text.
    contract_id: int = None
    raw_text: str = None


@router.post('/submit')
def submit_job(
    payload: JobSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.contract_id is None and not payload.raw_text:
        raise HTTPException(status_code=400, detail='Provide contract_id or raw_text')

    if payload.raw_text:
        os.makedirs('uploads', exist_ok=True)
        tmp_name = f'uploads/raw_{int(time.time())}_{uuid.uuid4().hex[:6]}.txt'
        with open(tmp_name, 'w', encoding='utf-8') as f:
            f.write(payload.raw_text)
        contract_path = tmp_name
        contract_id = None
    else:
        c = db.query(Contract).filter(
            Contract.id == payload.contract_id,
            Contract.user_id == current_user.id,
        ).first()
        if not c:
            raise HTTPException(status_code=404, detail='Contract not found')
        contract_path = c.storage_path
        contract_id = c.id

    job = run_analysis.delay(contract_path, contract_id)
    return {'job_id': job.id}


@router.get('/status/{job_id}')
def job_status(
    job_id: str,
    current_user: User = Depends(get_current_user),
):
    res = celery.AsyncResult(job_id)
    state = res.state
    info = res.info if res.info else {}
    out = {'state': state, 'info': info}
    if state == 'SUCCESS' and isinstance(info, dict) and info.get('result_path'):
        try:
            with open(info['result_path'], 'r', encoding='utf-8') as f:
                out['result'] = f.read()
        except Exception:
            out['result'] = None
    return out
