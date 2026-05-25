from database.db import Base
from sqlalchemy import Column,Integer,String,ForeignKey,Float
from sqlalchemy.orm import Relationship, relationship
from cart.models.catitemmodel import CartitemModel


class OrderModel(Base):
    __tablename__ = "orders"
    id = Column(Integer,primary_key=True,index=True,autoincrement=True,nullable=False,unique=True)
    user_id = Column(Integer,ForeignKey('users.id'))
    total_price = Column(Float,nullable=False)
    addres_id = Column(Integer,ForeignKey('address.id'))
    status = Column(String,default='pending')


    address = relationship('AddresModel',back_populates='orders')
    users = relationship('UsersModel',back_populates='orders')