
from typing import List
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import CreateUser,Login,Addtodo
from sqlalchemy import ARRAY, String
from db import get_db,declarative_base,sessionlocal,sessionmaker,Base,engine
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from auth import create_token,verify_pass,hash_pass,pwd_context,current_user
from models import Users,Todo


app= FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind =engine)




@app.get("/")
def test():
    return {
        "msg":"hello"
    }

@app.post("/signup")
def siginup(users:CreateUser, db: Session = Depends(get_db)):

    exuser = db.query(Users).filter(Users.username == users.username).first()

    if exuser :
        raise HTTPException(status_code=400,detail="already exists")
    
    if len(users.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password too long"
        )
    
    pasx = pwd_context.hash(users.password)
    data = Users(
        username = users.username,
        password = pasx
    )
    db.add(data)
    db.commit()
    db.refresh(data)

    return {
        "msg":"sucess",
        "id": data.id
    }



@app.post("/login")
def login(db:Session = Depends(get_db),form_data:OAuth2PasswordRequestForm = Depends()):
    user = db.query(Users).filter(Users.username == form_data.username).first()

    if not user or not verify_pass(form_data.password, user.password):
        raise HTTPException(status_code=400,detail="invalid username or password")
    acces_token = create_token({"sub": str(user.id)})

    return {
        "access_token": acces_token,
        "token_type": "bearer"
    }

@app.get("/todo")
def all(user_id: str = Depends(current_user),db:Session = Depends(get_db)):
    data = db.query(Todo).filter(user_id == Todo.user_id).all()


    if not data:
        raise HTTPException(status_code=400,detail="NO todos")
    
    return data



@app.post("/addtodo")
def add(d:Addtodo,db:Session = Depends(get_db),user_id: str = Depends(current_user)):

    
    data = Todo(
        title = d.title,
        completed = d.completed,
        user_id = user_id
        

    )
    db.add(data)
    db.commit()
    db.refresh(data)

    return {
        "msg":"added",
        "id": data.id
    }

@app.post("/completed/{id}")
def complete(id: int, db:Session = Depends(get_db),user_id:str = Depends(current_user)):
    data = db.query(Todo).filter(Todo.id == id , Todo.user_id == user_id).first()

    
    if data is None:
     raise HTTPException(
         status_code=404,detail="invalid todo "
     )
    if data.completed == True:
        return{
            "msg":"already complted"
        }

    data.completed = True

    db.commit()
    db.refresh(data)

    return{
        "msg":"completed",
    }
@app.delete("/delete/{id}")
def delete(id:int,db:Session = Depends(get_db),user_id: str = Depends(current_user)):
    data = db.query(Todo).filter(id==Todo.id,Todo.user_id == user_id)
    if data is None:
        raise HTTPException(status_code=401,detail="in valid todo")
    data.delete()

    db.commit()
    return{
        "msg":"deleted"
    }
