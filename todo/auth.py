from jose import JWTError,jwt
from datetime import datetime,timedelta,timezone
from fastapi import HTTPException,Depends, Header
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from passlib.context import CryptContext
import hashlib

#JWT CONFIG
SECRET_KEY = "mysecret"
ALGORITH = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#pass Hasshing setup

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

#OauthSetup

oauth2_schema = OAuth2PasswordBearer(tokenUrl="login")

#Hashpass

def hash_pass(password: str):

    return pwd_context.hash(password)

#verifypass
def verify_pass(plain_password, hashed_password):

    return pwd_context.verify(plain_password, hashed_password)


#token create
def create_token(data:dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    token = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITH)

    return token

#verify token



def current_user(token:str = Depends(oauth2_schema)):
    try:
        Payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITH])
        user_id : int = Payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="invalid token: missing subject")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="invalid token: missing subject")