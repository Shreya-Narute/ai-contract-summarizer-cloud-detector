from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from ..models import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session
import jwt, os, datetime
from .deps import get_db

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth")

class SignupIn(BaseModel):
    email: EmailStr
    password: str
    name: str = None

@router.post("/signup")
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email exists")
    user = User(email=payload.email, hashed_password=pwd_ctx.hash(payload.password), name=payload.name)
    db.add(user); db.commit(); db.refresh(user)
    return {"msg": "ok"}

class LoginIn(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not pwd_ctx.verify(payload.password, user.hashed_password):
        raise HTTPException(401, "Invalid creds")
    token = jwt.encode(
        {"sub": user.email, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)},
        os.getenv("JWT_SECRET", "secret"),
        algorithm="HS256",
    )
    return {"access_token": token}
