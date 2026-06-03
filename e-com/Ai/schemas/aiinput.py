from pydantic import BaseModel

class Aiinput(BaseModel):
    budget:float
    brand:str
    text:str