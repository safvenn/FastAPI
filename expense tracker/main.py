from api.ollamaai import chat_with_ollama
from datetime import datetime
from typing import List
from fastapi import Depends, FastAPI,Response,HTTPException,responses,status
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordRequestFormStrict
from api.aiservice import get_ai_response
from models import Expenses, Users
from schemas import AddExp,Signup,Login, SignupResponse,TotalResponse,Expresponse
from auth import create_token,verify_tokken,hashpass,verifypass
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from db import Base,enginne,get_db,sessionmaker
from sqlalchemy.orm import Session
from starlette.middleware.base import BaseHTTPMiddleware
import time
from dotenv import load_dotenv
load_dotenv()



app = FastAPI()


Base.metadata.create_all(bind =enginne)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/signup",response_model=SignupResponse,status_code=status.HTTP_201_CREATED)
def signup(user:Signup,db: Session = Depends(get_db)):

    userx = db.query(Users).filter(user.email == Users.email).first()

    if userx:
        raise HTTPException(status_code=400,detail="already exists")


    password = hashpass(user.password)
    data =Users(
        username = user.username,
        email = user.email,
        password = password,
        total_exp = 0
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    
    return data
    

@app.post("/login",status_code=status.HTTP_200_OK)
def login(form_data:Login,db: Session = Depends(get_db)):
    user = db.query(Users).filter(form_data.email == Users.email).first()

    if not user or  not verifypass(form_data.password,user.password):
        raise HTTPException(status_code=400,detail="invalid username or password")

    token = create_token({"sub": form_data.email})
    return{
        "access_token": token,
        "token_type":"bearer",
    }


@app.get("/userexpenses",response_model=TotalResponse,status_code=status.HTTP_200_OK)
def total_exp(email: str = Depends(verify_tokken),db: Session = Depends(get_db)):
    
    data = db.query(Expenses).filter(email == Expenses.user_email).order_by(Expenses.created_at.desc()).all()
    datax = db.query(Users).filter(email == Users.email).first()
    return {
        "username":datax.username,
        "total_expense":datax.total_exp,
        "expenses":data if len(data) > 0 else []
    }


@app.post("/expense",response_model=Expresponse,status_code=status.HTTP_201_CREATED)
def add(data:AddExp,db: Session = Depends(get_db),email:str = Depends(verify_tokken)):
    datax = Expenses(
        title = data.title,
        amount = data.amount,
        category = data.category,
        user_email = email,
        discription = data.discription,
        created_at = datetime.now(),
        updated_at = datetime.now()
    )



    user = db.query(Users).filter(email == Users.email).first()
    user.total_exp += data.amount
    db.add(datax)
    db.commit()
    db.refresh(datax)

    return datax


@app.delete("/delete",status_code=status.HTTP_200_OK)
def dele(i:int ,db:Session = Depends(get_db),email:str = Depends(verify_tokken)):
    expense_query = db.query(Expenses).filter(Expenses.id == i)
    expense = expense_query.first()

    if not expense:
        raise HTTPException(status_code=400,detail="invalid id")
    
    if expense.user_email != email:
        raise HTTPException(status_code=403,detail="Not authorized to delete this expense")

    user = db.query(Users).filter(Users.email == email).first()
    user.total_exp -= expense.amount
    expense_query.delete()
    db.commit()

    return {"message": "Expense deleted successfully"}


@app.post("/chat")
async def aichat(chat:str,db: Session = Depends(get_db),email:str = Depends(verify_tokken)):
    
    data = db.query(Expenses).filter(email == Expenses.user_email).order_by(Expenses.created_at.desc()).all()
    
    # Serialize expense data to make it readable for the AI
    expenses_list = [
        {
            "title": exp.title,
            "amount": exp.amount,
            "category": exp.category,
            "description": exp.discription,
            "date": exp.created_at.strftime("%Y-%m-%d") if exp.created_at else "Unknown"
        }
        for exp in data
    ]
    
    prompt = f"""
You are a realistic, direct, and highly punchy , friendly financial assistant. Your goal is to help the user manage their expenses and save money.

Guidelines:
1. Give extremely concise, direct, and short answers (1-2 sentences maximum).
2. Avoid generic pleasantries, fluff, or filler words. Be punchy and get straight to the point.
3. Be realistic and practical in your saving tips.
4. Analyze the user's provided expense data to make your advice specific and factual.

User's Expense Data:
{expenses_list}

User Message: {chat}
"""
    response = get_ai_response(prompt)
    return {"response": response}

@app.post("/olama")

async def olama(chat:str,db:Session = Depends(get_db),email:str = Depends(verify_tokken)):
    data = db.query(Expenses).filter(email == Expenses.user_email).order_by(Expenses.created_at.desc()).all()
    expenses_list = [
        {
            "title": exp.title,
            "amount": exp.amount,
            "category": exp.category,
            "description": exp.discription,
            "date": exp.created_at.strftime("%Y-%m-%d") if exp.created_at else "Unknown"
        }
        for exp in data
    ]

    prompt = f"""
You are a realistic, direct, and highly punchy,friendly financial assistant. Your goal is to help the user manage their expenses and save money.

Guidelines:
1. Give extremely concise, direct, and short answers (1-2 sentences maximum).
2. Avoid generic pleasantries, fluff, or filler words. Be punchy and get straight to the point.
3. Be realistic and practical in your saving tips.
4. Analyze the user's provided expense data to make your advice specific and factual.

User's Expense Data:
{expenses_list}
user_message = {chat}
"""
    response = await chat_with_ollama(prompt)
    return {
        "response":response
    }
