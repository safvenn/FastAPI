from pydantic import BaseModel

class OrderSchema(BaseModel):
    address_id: int