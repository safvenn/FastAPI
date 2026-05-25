from sqlalchemy import Column, create_engine,Integer,String,ARRAY,Boolean,ForeignKey
from sqlalchemy.orm import sessionmaker,declarative_base,relationship
from typing import List
engine = create_engine("postgresql://postgres:safvan@localhost:5432/fastapi")

sessionlocal = sessionmaker(autocommit = False,autoflush=False,bind=engine)

def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()
    
Base = declarative_base()




