from sqlalchemy import create_engine
from sqlalchemy.orm import Relationship,sessionmaker,declarative_base

dbconnection = "postgresql://postgres:safvan@localhost:5432/e_com"
engine = create_engine(dbconnection)

session_local = sessionmaker(autoflush=False,autocommit=False,bind=engine)
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()