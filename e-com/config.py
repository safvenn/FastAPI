from database.db import dbconnection
from dotenv import load_dotenv
import os


load_dotenv()

DATABASE_URL = os.getenv("dbconnection")
SECRET_KEY = os.getenv("SECRET_KEY")


class Settings:
    DATABASE_URL = os.getenv("dbconnection")
    SECRET_KEY = os.getenv("SECRET_KEY")

settings = Settings()