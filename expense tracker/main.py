from fastapi import Depends, FastAPI,Response,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from schemas import AddExp,Signup,Login,TotalRes
from auth import create_token,verify_tokken,hashpass,verifypass
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()



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
def signup(user:Signup):

    if user.username  in users:
        raise HTTPException(status_code=400,detail="already exists")


    password = hashpass(user.password)
    data ={
        "username":user.username,
        "password":password
    }
    dict2[user.username] = []
    users[user.username] = data
    dict1[user.username] = {
        "total":0,
        "name":user.username,
        "expenses":dict2[user.username]
    }
    
    return{ 
        "data":users[user.username]}
    

@app.post("/login")
def login(form_data:OAuth2PasswordRequestForm = Depends()):
    user = users.get(form_data.username)

    if not user or  not verifypass(form_data.password,user["password"]):
        raise HTTPException(status_code=400,detail="inavild username or password")

    token = create_token({"sub": form_data.username})
    return{
        "access_token": token,
        "token_type":"bearer",
    }


@app.get("/{username}")
def total_exp(username: str = Depends(verify_tokken)):
    return {
   
         "data": dict1[username]
         
         }
@app.put("/expense")
def add(data:AddExp,username:str = Depends(verify_tokken)):
    datax = {
        "title":data.title,
        "amount":data.amount
    }

    dict2[username].insert(0,datax)

    dict1[username]["total"] += data.amount

    return  {
        "data":dict2[username][0],
        "total expense":dict1[username]['total']
        
        }

@app.delete("/delete")
def dele(i:int ,username:str = Depends(verify_tokken)):
    x = 1-1
    try:
     if not dict2[username][x]:
        raise HTTPException(status_code=400,detail="inavlid id")
     dict1[username]['total'] -= dict2[username][x]['amount']
     dict2[username].pop(x)

     return{
        "data":dict2[username]
     }
    except Exception  :
        raise HTTPException(status_code=400,detail="inavlid idx")


