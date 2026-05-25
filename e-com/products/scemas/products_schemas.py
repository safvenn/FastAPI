from pydantic import BaseModel


class ProductsSchema(BaseModel):
    id:int
    title:str
    description:str
    sizes:list[str]
    brand:str
    image_url:str

