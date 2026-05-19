from pydantic import BaseModel
from typing import Optional

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

class TotalRes(BaseModel):
    name:str
    Total:str

