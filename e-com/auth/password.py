from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=['bcrypt'],deprecated="auto")

def hashpass(password:str):
    return pwd_context.hash(password)


def verify_pass(plainpassword:str,hashpass:str):
    return pwd_context.verify(plainpassword,hashpass)


