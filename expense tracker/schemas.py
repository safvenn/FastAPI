from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Signup(BaseModel):
    username:str
    email:str
    password:str

class Login(BaseModel):
    email:str
    password:str

class AddExp(BaseModel):
    title:str
    amount:int
    category:str
    discription:Optional[str] = None

class Expresponse(BaseModel):
    id:int
    title:str
    amount:int
    category:str
    discription:Optional[str] = None
    created_at:Optional[datetime] = None
    updated_at:Optional[datetime] = None


class TotalResponse(BaseModel):
    username: str
    total_expense:int
    expenses:list[Expresponse]

class SignupResponse(BaseModel):
    id:int
    username:str
    email:str