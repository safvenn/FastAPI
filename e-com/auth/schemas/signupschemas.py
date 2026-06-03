from pydantic import BaseModel
from pydantic.networks import EmailStr,email_validator
class SignupModel(BaseModel):
    email:EmailStr 
    name:str
    username:str
    password:str

