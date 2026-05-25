from jose import jwt
from datetime import datetime, timedelta,timezone
from config import settings

ALGORITHM = "HS256"

def craete_email_token(mail:str,passsword):
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    playload = {
        "sub":mail,
        "password":passsword,
        "exp":expire
    }
    token = jwt.encode(playload, settings.SECRET_KEY, algorithm=ALGORITHM)
    
    
    return token
