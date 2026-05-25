from fastapi.security import OAuth2PasswordBearer,OAuth2,oauth2
from jose import jwt,JWTError
from datetime import datetime,timedelta,timezone
from fastapi import Depends,HTTPException


SECRET_KEY = "secretkey"
ALGORITHM = "HS256"
EXPIRE_TIME = 30
oauth_schema = OAuth2PasswordBearer(tokenUrl="login")


def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_TIME)
    to_encode.update({'exp': expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

def current_user(token: str = Depends(oauth_schema)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: int = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user")
        return int(username)
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid credentials or expired token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token validation failed")


 

