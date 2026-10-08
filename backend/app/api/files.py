from fastapi import APIRouter, File, UploadFile, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import os, shutil

from ..models import Contract, User
from ..utils.extractor import extract_from_pdf, extract_from_docx
from ..utils.summarizer import chunked_summarize
from ..utils.clause_detector import detect_clauses
from .deps import get_db, get_current_user

router = APIRouter(prefix="/files")


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all contracts belonging to the current user, newest first."""
    contracts = (
        db.query(Contract)
        .filter(Contract.user_id == current_user.id)
        .order_by(Contract.id.desc())
        .all()
    )
    return [
        {
            "id":           c.id,
            "filename":     c.filename,
            "storage_path": c.storage_path,
        }
        for c in contracts
    ]


def save_upload_tmp(upload: UploadFile, dest_path: str):
    with open(dest_path, "wb") as f:
        shutil.copyfileobj(upload.file, f)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    os.makedirs("uploads", exist_ok=True)
    path = f"uploads/{file.filename}"
    save_upload_tmp(file, path)

    if file.filename.lower().endswith(".pdf"):
        text = extract_from_pdf(path)
    elif file.filename.lower().endswith(".docx"):
        text = extract_from_docx(path)
    else:
        text = ""

    # Use the authenticated user's id instead of the previous hard-coded value.
    c = Contract(
        user_id=current_user.id,
        filename=file.filename,
        storage_path=path,
        original_text=text,
    )
    db.add(c)
    db.commit()
    db.refresh(c)

    summary = chunked_summarize(text[:20000])
    clauses = detect_clauses(text)

    return {"contract_id": c.id, "summary": summary, "clauses": clauses}
