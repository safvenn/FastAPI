from database.db import Base
from sqlalchemy import Column,ForeignKey,Integer,String
from sqlalchemy.orm import Relationship, relationship

class AddresModel(Base):
    __tablename__ = 'address'
    id = Column(Integer,index=True,primary_key=True)
    name = Column(String)
    street = Column(String)
    city = Column(String)
    state = Column(String)
    user_id = Column(Integer,ForeignKey('users.id'))

    users = relationship('UsersModel',back_populates='address')
    orders = relationship('OrderModel',back_populates='address')


from users.models.usermodel import UsersModel
