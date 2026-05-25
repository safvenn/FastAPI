from database.db import Base
from sqlalchemy import Column,Integer,String,ForeignKey,Float,Boolean
from sqlalchemy.orm import Relationship, relationship
from cart.models.catitemmodel import CartitemModel

class UsersModel(Base):
    __tablename__ = 'users'
    id = Column(Integer,primary_key=True,index=True)
    email = Column(String,unique=True)
    username = Column(String,unique=True)
    password = Column(String,nullable=False)
    role = Column(String,nullable=False,default='user')
    is_verify = Column(Boolean)

    cart = relationship('CartitemModel',back_populates='users')
    address = relationship('AddresModel',back_populates='users')
    orders = relationship('OrderModel',back_populates='users')


from users.models.address import AddresModel