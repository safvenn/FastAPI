from sqlalchemy import Column,String,Integer,ForeignKey,create_engine
from sqlalchemy.orm import sessionmaker,Relationship,declarative_base


enginne = create_engine("postgresql://postgres:safvan@localhost:5432/expense_tracker")

session_local = sessionmaker(autoflush=False,autocommit=False,bind=enginne)

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()