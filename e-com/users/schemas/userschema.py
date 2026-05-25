from pydantic import BaseModel

class ProfileSchema(BaseModel):
    id: str
    name: str
    email: str