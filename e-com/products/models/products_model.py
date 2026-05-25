from database.db import Base
from sqlalchemy import Column,String,Integer,ForeignKey,ARRAY,Float
from sqlalchemy.orm import Relationship, relationship
from cart.models.catitemmodel import CartitemModel

class ProductsModel(Base):
    __tablename__ = 'products'

    id =Column(Integer,primary_key=True,nullable=False,index=True)
    price = Column(Float,nullable=False)
    title = Column(String,nullable=False)
    description = Column(String,nullable=False)
    sizes = Column(ARRAY(String),nullable=False)
    brand = Column(String,nullable=False)
    image_url = Column(String)

    cart = Relationship(CartitemModel,back_populates="products")




