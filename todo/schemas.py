from pydantic import BaseModel

class CreateUser(BaseModel):
     username : str
     password : str

class Login(BaseModel):
    username : str
    password : str

    def __private_attributes__(self):
        return {
            "_password": str
        }


class Addtodo(BaseModel):

    title:str
    completed:bool = False