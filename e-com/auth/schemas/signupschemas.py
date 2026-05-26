from pydantic import BaseModel

class SignupModel(BaseModel):
    email:str
    username:str
    password:str

