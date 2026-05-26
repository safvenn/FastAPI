import random
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
from jose import jwt, JWTError

from database.db import get_db
from auth.auth import SECRET_KEY, ALGORITHM, create_token, create_refresh_token, verfy_refresh
from auth.schemas.signupschemas import SignupModel
from users.models.usermodel import UsersModel
from auth.password import hashpass, verify_pass
from auth.eamil_auth import craete_email_token
from auth.email import send_email_verf, send_otp, send_forgotpassword_email

router = APIRouter()





@router.post("/signup")
async def signup(signup: SignupModel, db: Session = Depends(get_db)):
    user = db.query(UsersModel).filter(or_(UsersModel.username == signup.username, UsersModel.email == signup.email)).first()
    if user:
        if user.is_verify:
            raise HTTPException(status_code=400, detail="User already exists")
        else:
            db.delete(user)
            db.commit()
    token = craete_email_token(str(signup.email))
    
    await send_email_verf(
        signup.email,
        token)

    passsword = hashpass(signup.password)
    data = UsersModel(
        email = signup.email,
        username = signup.username,
        password = passsword,
        is_verify = False
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return {
        "msg":"email verification email sented"
    }


@router.get("/signup/{token}")
def verify_email(token:str,db: Session = Depends(get_db)):
    payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    email:str = payload.get("sub")

    user = db.query(UsersModel).filter(UsersModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404,detail="inavalid user")
    user.is_verify = True
    user_id = user.id
    token = create_token({"sub":str(user_id)})
    refresh_token = create_refresh_token({"sub":str(user_id)})

    
    db.commit()
    

    return{
        "msg":"sucessfully registerd",
        "access_token": token,
        "refresh_token":refresh_token,
        "token_type":'Bearer'
        }

@router.post("/login")
async def login(login: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UsersModel).filter(
        or_(
            UsersModel.username == login.username,
            UsersModel.email == login.username
        )
    ).first()

    if not user or not verify_pass(login.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_verify:
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email first.")
    
    # Generate user-specific OTP locally inside login function (not shared globally!)
    otp = random.randint(100000, 999999)
    
    # Send the OTP to the user's email address
    await send_otp(user.email, otp)
    
    # Encode the OTP secure claim in the temporary token
    user.otp = otp
    db.commit()
    db.refresh(user)
    token = craete_email_token(str(user.email))

    return {
        "msg": "OTP verification email sent. Please check your inbox.",
        "access_token": token,
        "token_type":'Bearer'
    }

@router.post("/verify-otp")
def verify_otp(otp: int, token: str, db: Session = Depends(get_db)):
    try:
        # Decode the client's temporary token to read the correct OTP and user ID
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user = db.query(UsersModel).filter(UsersModel.email == email).first()
        token_otp = user.otp
        
        if not token_otp or not email:
            raise HTTPException(status_code=401, detail="Invalid or expired session token")
        
        # Verify the OTP matches
        if str(otp) != str(token_otp):
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        # OTP is verified! Issue a permanent token (WITHOUT 'otp' claim) for full access
        final_token = create_token({"sub": str(user.id)})
        final_refresh_token = create_refresh_token({"sub": str(user.id)})
        
        return {
            "msg": "Successfully verified OTP",
            "access_token": final_token,
            "refresh_token": final_refresh_token,
            "token_type": "Bearer"
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")


@router.post("/forgotpassword")
async def forgotpas(email:str):
    token = craete_email_token(email)
    await send_forgotpassword_email(email,token)
    return{
        "msg":"sended"
    }
@router.put("/resetpassword/{token}")
def reset(token: str, new_password: str, confirm_pass: str, db: Session = Depends(get_db)):
    if new_password != confirm_pass:
        raise HTTPException(status_code=400, detail="passwords do not match")
    payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    if not payload:
        raise HTTPException(status_code=400, detail="invalid token")
    email = payload.get("sub")
    user = db.query(UsersModel).filter(UsersModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verify == False:
        raise HTTPException(status_code=404, detail="User not verified")
    user.password = hashpass(new_password)
    db.commit()

    return {"msg":"password updated successfully"}

#refresh token---------------------------------------------------------------------------------------------------------

@router.post("/refresh")
def refresh(token:str):

    new_token = verfy_refresh(token)

    return {
            "access_token": new_token,
            "token_type": "Bearer"
        }
