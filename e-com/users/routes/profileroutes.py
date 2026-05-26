from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from auth.auth import current_user
from database.db import get_db
from users.models.usermodel import UsersModel
from users.schemas.userschema import ProfileSchema


router = APIRouter()

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), user: int = Depends(current_user)):
    data = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": data.id,
        "username": data.username,
        "email": data.email,
        "role": data.role
    }


@router.put("/updateprofile")
def updateprofile(profile:ProfileSchema,db: Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    
    username = db.query(UsersModel).filter(UsersModel.username == profile.name, UsersModel.id != user).first()
    if username:
        raise HTTPException(status_code=404,detail="Username already exists")
    data.username = profile.name
    db.commit()
    db.refresh(data)
    return data
