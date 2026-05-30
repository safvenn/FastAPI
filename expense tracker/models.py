from db import Base,get_db,Relationship
from sqlalchemy import Column,String,Integer,ForeignKey,create_engine,DateTime



class Users(Base):
    __tablename__ = "user"

    id = Column(Integer,index=True,nullable=False,primary_key=True)
    email = Column(String,unique=True,nullable=False)
    username = Column(String,unique=True,nullable=False)
    password = Column(String,nullable=False)
    total_exp = Column(Integer,nullable=False)

    user = Relationship('Expenses',back_populates='expense')


class Expenses(Base):
    __tablename__ = "expense"

    id = Column(Integer,index=True,nullable=False,primary_key=True)
    title = Column(String)
    user_email = Column(String,ForeignKey('user.email',ondelete="CASCADE"))
    amount = Column(Integer,nullable=False)
    category = Column(String,nullable=False)
    #new coloumn 
    discription = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    expense = Relationship(Users,back_populates="user")