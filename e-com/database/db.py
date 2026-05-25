from sqlalchemy import create_engine
from sqlalchemy.orm import Relationship,sessionmaker,declarative_base
from config import settings

dbconnection = settings.DATABASE_URL
engine = create_engine(dbconnection)

session_local = sessionmaker(autoflush=False,autocommit=False,bind=engine)
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()