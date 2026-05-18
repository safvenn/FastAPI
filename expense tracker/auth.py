from fastapi import Depends,HTTPException
from jose import jwt,JWTError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from datetime import datetime,timedelta,timezone
import hashlib

#config

SECRET_KEY = "mysecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = 30

#pass hashing 

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

#Oauth2

oauth_schema = OAuth2PasswordBearer(tokenUrl="/login")

def hashpass(password:str):
    return pwd_context.hash(password)

def verifypass(plainpass,hashpassword):
    return pwd_context.verify(plainpass,hashpassword)

def create_token(data:dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    to_encode.update({"exp": int(expire.timestamp())})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # Ensure token is a string (some versions of PyJWT return bytes)
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def verify_tokken(token:str = Depends(oauth_schema)):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        username :str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401,detail="no user or token expire")
        return str(username)
    except JWTError as e:
        raise HTTPException(status_code=401,detail=f"unauthorized or invalid token: {str(e)}")
