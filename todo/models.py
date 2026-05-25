from sqlalchemy import Column, ForeignKey,Integer,String,Boolean
from sqlalchemy.orm import relationship
from db import Base


class Users(Base):
    __tablename__ = "todouser"
    id = Column(Integer,index=True,primary_key=True)
    username = Column(String,nullable=False)
    password = Column(String,nullable=False)

    todos = relationship("Todo",back_populates="user")


class Todo(Base):
    __tablename__ = 'todosx'
    id = Column(Integer,index=True,primary_key=True)
    title = Column(String,nullable=False)
    completed = Column(Boolean,nullable=False,default=False)
    user_id = Column(Integer,ForeignKey("todouser.id"))

    user = relationship(Users)