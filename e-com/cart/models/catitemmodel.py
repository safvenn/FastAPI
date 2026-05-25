from database.db import Base
from sqlalchemy import Column,Integer,String,ForeignKey,Float
from sqlalchemy.orm import Relationship, relationship


class CartitemModel(Base):
    __tablename__ = 'cartitem'

    id = Column(Integer,primary_key=True,nullable=False,index=True)
    quantity = Column(Integer,nullable=False)
    size = Column(Float)
    product_id = Column(Integer,ForeignKey('products.id',ondelete='CASCADE'))
    user_id = Column(Integer,ForeignKey("users.id"))

    products = relationship('ProductsModel',back_populates='cart')
    users = relationship('UsersModel',back_populates='cart')


from users.models.usermodel import UsersModel

