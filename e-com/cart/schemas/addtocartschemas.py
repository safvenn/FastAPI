from pydantic import BaseModel


class AddtoCart(BaseModel):
    product_id: int
    quantity: int
    size: float