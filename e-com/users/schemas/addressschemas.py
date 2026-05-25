from pydantic import BaseModel

class AddressSchema(BaseModel):
    name: str
    street: str
    city: str
    state: str
