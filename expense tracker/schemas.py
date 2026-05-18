from pydantic import BaseModel

class Signup(BaseModel):
    username:str
    password:str

class Login(BaseModel):
    username:str
    password:str

class AddExp(BaseModel):
    title:str
    amount:int

class TotalRes(BaseModel):
    name:str
    Total:str

