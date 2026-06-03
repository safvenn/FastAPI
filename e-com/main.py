
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
# pyrefly: ignore [missing-import]

from database.db import Base, engine
from dotenv import load_dotenv
from products.routes.productroute import router as productroute
from admin.routes.adminroutes import router as adminroutes
from users.routes.profileroutes import router as profileroutes
from users.routes.addressroutes import router as addressroutes
from cart.routes.cartroutes import router as cartroutes
from orders.routes.ordersroutes import router as ordersroutes
from auth.routes.authroutes import router as authroutes
from Ai.routes.airoutes import router as airoutes

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

#AI--------------------------------------------------------------

app.include_router(airoutes,tags=["AI"])