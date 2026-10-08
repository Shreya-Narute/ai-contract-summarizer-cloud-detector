from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from ..utils.generator import generate_from_template
from ..models import User
from .deps import get_current_user

router = APIRouter(prefix="/generate")

class GenerateIn(BaseModel):
    template: str
    fields: dict

@router.post("/", response_class=FileResponse)
def generate_contract(
    payload: GenerateIn,
    current_user: User = Depends(get_current_user),
):
    tpl_map = {
        "rental": "templates/rental_template.docx",
        "affidavit": "templates/affidavit_template.docx",
        "service": "templates/service_template.docx"
    }
    if payload.template not in tpl_map:
        raise HTTPException(status_code=400, detail="Unknown template")
    tpl_path = tpl_map[payload.template]
    out_dir = "generated"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{payload.template}_filled.docx")
    try:
        generate_from_template(tpl_path, payload.fields, out_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return FileResponse(
        out_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=os.path.basename(out_path),
    )
