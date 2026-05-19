from fastapi import Depends, FastAPI,Response,HTTPException,responses
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordRequestFormStrict
from models import Expenses, Users
from schemas import AddExp,Signup,Login,TotalRes
from auth import create_token,verify_tokken,hashpass,verifypass
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from db import Base,enginne,get_db,sessionmaker
from sqlalchemy.orm import Session


app = FastAPI()


Base.metadata.create_all(bind =enginne)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




dict2 = {"safvan":[
    {
        "title":"zero",
        "amount":0
    }]}


users ={
    "safvan":{
    "username":"safvan",
    "password":hashpass("1234")
    }

}

dict1 = {"safvan":{
  
    "total":0,
    "name":"safvan",
    "expenses":dict2["safvan"]
    
    }
}


@app.post("/signup")
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
    
    return{ 
        "data":data
        
        }
    

@app.post("/login")
def login(form_data:Login,db: Session = Depends(get_db)):
    user = db.query(Users).filter(form_data.email == Users.email).first()

    if not user or  not verifypass(form_data.password,user.password):
        raise HTTPException(status_code=400,detail="inavild username or password")

    token = create_token({"sub": form_data.email})
    return{
        "access_token": token,
        "token_type":"bearer",
    }


@app.get("/{username}")
def total_exp(email: str = Depends(verify_tokken),db: Session = Depends(get_db)):
    
    data = db.query(Expenses).filter(email == Expenses.user_email).all()
    datax = db.query(Users).filter(email == Users.email).first()
    if len(data) == 0:
        data = "no expenses"
    return {
   
         "username": datax.username,
         "total expense":datax.total_exp,
         "expenses":data
         
         }


@app.post("/expense")
def add(data:AddExp,db: Session = Depends(get_db),email:str = Depends(verify_tokken)):
    datax = Expenses(
        title = data.title,
        amount = data.amount,
        user_email = email
    )



    user = db.query(Users).filter(email == Users.email).first()
    user.total_exp += data.amount
    db.add(datax)
    db.commit()
    db.refresh(datax)

    return({
        "data":datax,
        "total_exp":user.total_exp

    })

    


@app.delete("/delete")
def dele(i:int ,db:Session = Depends(get_db),email:str = Depends(verify_tokken)):
    expense = db.query(Expenses).filter(Expenses.id == i)
    user = db.query(Users).filter(Users.email == email).first()

    if not expense.first():
        raise HTTPException(status_code=400,detail="inavlid id")
    user.total_exp -= expense.first().amount
    expense.delete()
    db.commit()
     

    return{
        "total expense": user.total_exp
     }
