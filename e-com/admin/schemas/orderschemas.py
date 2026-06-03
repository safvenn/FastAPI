from pydantic import BaseModel


class Ordesschemas(BaseModel):
            id: int
            user_id: int
            username: str
            email: str
            total_price: float
            address_id: int
            status: str

