from dotenv import load_dotenv
import os


load_dotenv()

DATABASE_URL = os.getenv("dbconnection")
SECRET_KEY = os.getenv("SECRET_KEY")
SECRET_KEY_REFRESH = os.getenv("REFRESH_SECRET_KEY")
GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")


class Settings:
    DATABASE_URL = os.getenv("dbconnection")
    SECRET_KEY = os.getenv("SECRET_KEY")
    MAIL_USERNAME=os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")
    MAIL_FROM=os.getenv("MAIL_FROM")
    MAIL_SERVER=os.getenv("MAIL_SERVER")
    MAIL_PORT=os.getenv("MAIL_PORT")

settings = Settings()

