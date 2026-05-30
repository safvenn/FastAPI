from auth.auth import verfy_refresh
from jose import JWTError
from auth.auth import ALGORITHM
from auth.auth import SECRET_KEY
from jose import jwt
from auth.auth import create_refresh_token
from unittest import result

from fastapi import FastAPI,Depends,HTTPException,Body
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy import func, or_
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database.db import get_db
from orders.models.ordermodels import OrderModel
from orders.schemas.orderschemas import OrderSchema
from products.models.products_model import ProductsModel
from products.scemas.products_schemas import ProductsSchema
from fastapi.security import OAuth2PasswordRequestForm
from auth.schemas.signupschemas import SignupModel

from users.models.address import AddresModel
from users.models.usermodel import UsersModel
from database.db import Base, engine
import random
from auth.password import hashpass,verify_pass
from auth.auth import create_token,current_user,oauth_schema
from cart.models.catitemmodel import CartitemModel
from cart.schemas.addtocartschemas import AddtoCart
from users.schemas.addressschemas import AddressSchema
from users.schemas.userschema import ProfileSchema
from dotenv import load_dotenv
from auth.eamil_auth import craete_email_token
from auth.email import send_email_verf, send_otp,send_forgotpassword_email
from products.routes.productroute import router as productroute
from admin.routes.adminroutes import router as adminroutes
from users.routes.profileroutes import router as profileroutes
from users.routes.addressroutes import router as addressroutes
from cart.routes.cartroutes import router as cartroutes
from orders.routes.ordersroutes import router as ordersroutes
from auth.routes.authroutes import router as authroutes


Base.metadata.create_all(bind=engine)



app = FastAPI(docs_url="/docs", redoc_url="/redoc", openapi_url="/openapi.json")


load_dotenv()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def test():
    return{
        "sucessfull"
    }

#product -------------------------------------------------------------------------------------

app.include_router(productroute, tags=["Products"])

#admin user controll -------------------------------------------------------------------------------------

app.include_router(adminroutes,tags=["Admin"])

#prolile--------------------------------------------------------------------------------------

app.include_router(profileroutes,tags=["Profile"])

#cart section ---------------------------------------------------------------------------------
app.include_router(cartroutes,tags=["Cart"])

#address section ---------------------------------------------------------------------------------

app.include_router(addressroutes,tags=["Address"])


#orderssection --------------------------------------------------------------------------------

app.include_router(ordersroutes,tags=["Order"])


#login section ---------------------------------------------------------------------------------

app.include_router(authroutes,tags=["Auth"])