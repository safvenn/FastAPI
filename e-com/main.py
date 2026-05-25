from unittest import result

from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy import func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database.db import get_db
from orders.models.ordermodels import OrderModel
from orders.schemas.orderschemas import OrderSchema
from products.models.products_model import ProductsModel
from products.scemas.products_schemas import ProductsSchema
from fastapi.security import OAuth2PasswordRequestForm
from signup.schemas.signupschemas import SignupModel
from login.schemas.loginschemas import LoginModel
from users.models.address import AddresModel
from users.models.usermodel import UsersModel
from database.db import Base, engine
from auth.password import hashpass,verify_pass
from auth.auth import create_token,current_user
from cart.models.catitemmodel import CartitemModel
from cart.schemas.addtocartschemas import AddtoCart
from users.schemas.addressschemas import AddressSchema
from users.schemas.userschema import ProfileSchema
from dotenv import load_dotenv

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

#AdminSection -------------------------------------------------------------------------------------

@app.get("/products")
def products(db: Session = Depends(get_db)):
    products = db.query(ProductsModel).all()
    return products



@app.post("/addproducts")
def addproducts(product: ProductsSchema, db: Session = Depends(get_db), user: str = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = ProductsModel(
        title=product.title,
        description=product.description,
        brand=product.brand,
        sizes=product.sizes,
        image_url=product.image_url
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return {
        "msg":"product Added"
    }



@app.delete("/deleteproduct")
def delproduct(id:int,db:Session = Depends(get_db),user:str = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(ProductsModel).filter(ProductsModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(data)
    db.commit()
    return {
        "msg":"product deleted"
    }



@app.put("/updateproduct/{id}")
def updateproduct(id:int,product:ProductsSchema,db:Session = Depends(get_db),user:str = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(ProductsModel).filter(ProductsModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Product not found")
    data.title = product.title
    data.description = product.description
    data.brand = product.brand
    data.sizes = product.sizes
    data.image_url = product.image_url
    db.commit()
    return {
        "msg":"product updated"
    }


#admin user controll -------------------------------------------------------------------------------------


@app.get("/users")
def users(db: Session = Depends(get_db),user:str = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(UsersModel).all()
    return data



@app.put("/addadmin")
def addadmin(role:str,db: Session = Depends(get_db),user: int = Depends(current_user),id:int = 0):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(UsersModel).filter(UsersModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    data.role = role
    db.commit()
    return {
        "msg":"Admin added successfully"
    }


@app.delete("/deluser")
def deluser(id:int,db:Session = Depends(get_db),user:str = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(UsersModel).filter(UsersModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(data)
    db.commit()
    return {
        "msg":"User deleted successfully"
    }

@app.get("/admin/orders")
def admin_orders(db: Session = Depends(get_db), user: int = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not user_obj or user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    orders = db.query(OrderModel).all()
    result = []
    for order in orders:
        user_info = db.query(UsersModel).filter(UsersModel.id == order.user_id).first()
        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "username": user_info.username if user_info else "Unknown",
            "email": user_info.email if user_info else "Unknown",
            "total_price": order.total_price,
            "address_id": order.addres_id,
            "status": order.status
        })
    return result

@app.put("/admin/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db), user: int = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not user_obj or user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Order not found")
    data.status = status
    db.commit()
    return {
        "msg": f"status updated to {status}"
    }

@app.put("/orderupdate")

def updatests(status:str,db: Session = Depends(get_db),user: int = Depends(current_user)):

    data = db.query(OrderModel).filter(OrderModel.user_id == user).first()

    if not data:
        raise HTTPException(status_code=404,detail="invalid order")

    data.status = status
    db.commit()

    return {
        "msg":"status updated {status}"
    }

#prolile--------------------------------------------------------------------------------------

@app.get("/profile")
def get_profile(db: Session = Depends(get_db), user: int = Depends(current_user)):
    data = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": data.id,
        "username": data.username,
        "email": data.email,
        "role": data.role
    }

@app.put("/updateprofile")
def updateprofile(profile:ProfileSchema,db: Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    
    username = db.query(UsersModel).filter(UsersModel.username == profile.name, UsersModel.id != user).first()
    if username:
        raise HTTPException(status_code=404,detail="Username already exists")
    data.username = profile.name
    db.commit()
    db.refresh(data)
    return data


#cart section ---------------------------------------------------------------------------------

@app.get("/cart")
def cart(
    db: Session = Depends(get_db),
    user: int = Depends(current_user)
):

    data = (
        db.query(
            CartitemModel.id.label("cart_id"), CartitemModel.quantity, ProductsModel.title, ProductsModel.id.label("product_id"), ProductsModel.description, ProductsModel.brand, CartitemModel.size, ProductsModel.image_url,
            (ProductsModel.price * CartitemModel.quantity).label("item_total")
        )
        .join(
            ProductsModel,
            CartitemModel.product_id == ProductsModel.id
        )
        .filter(CartitemModel.user_id == user)
        .all()
    )

    if not data:
        return {
            "msg": "There is no items in cart"
        }

    total = (
        db.query(
            func.sum(
                CartitemModel.quantity * ProductsModel.price
            )
        )
        .join(
            ProductsModel,
            CartitemModel.product_id == ProductsModel.id
        )
        .filter(CartitemModel.user_id == user)
        .scalar()
    )

    result = []

    for cart_item in data:
        result.append({
            "cart_id": cart_item.cart_id,
            "product_id": cart_item.product_id,
            "title": cart_item.title,
            "description": cart_item.description,
            "brand": cart_item.brand,
            "sizes": cart_item.size,
            "image_url": cart_item.image_url,
            "quantity": cart_item.quantity,
            "item_total": cart_item.item_total
        })

    return {
        "cart_items": result,
        "total_amount": total,
        "total_items": len(result)
    }



#addtocart-----------------------------------------------------------------------------


@app.post("/addtocart")
def addtocart(add:AddtoCart,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = CartitemModel(
        user_id = user,
        product_id = add.product_id,
        quantity = add.quantity,
        size = add.size

    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return data


#updatecart----------------------------------------------------------------------------------

@app.put("/updatecart/{id}")
def updatecart(id:int,add:AddtoCart,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(CartitemModel).filter(CartitemModel.id == id, CartitemModel.user_id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    data.product_id = add.product_id
    data.quantity = add.quantity
    data.size = add.size
    db.commit()
    return {
        "msg":"Item updated successfully"
    }


@app.delete("/deletecart/{id}")
def deletecart(id:int,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(CartitemModel).filter(CartitemModel.id == id, CartitemModel.user_id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(data)
    db.commit()
    return {"msg": "Item deleted successfully"}



@app.delete("/clearcart")
def clearcart(db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(CartitemModel).filter(CartitemModel.user_id == user).all()
    if not data:
        raise HTTPException(status_code=404, detail="No items in cart")
    for item in data:
        db.delete(item)
    db.commit()
    return {"msg": "Cart cleared successfully"}


#address section ---------------------------------------------------------------------------------

@app.get("/address")
def Address(db: Session = Depends(get_db),user:str = Depends(current_user)):
    data = db.query(AddresModel).filter(AddresModel.user_id == user).all()
    if len(data) < 1:
        return {
            "msg":"There is no address"
        }
    return data

@app.post("/addaddress")
def addaddress(address:AddressSchema,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = AddresModel(
        user_id = user,
        name = address.name,
        street = address.street,
        city = address.city,
        state = address.state,

    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return data




@app.delete("/deladdress")
def deladdress(id:int,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(AddresModel).filter(AddresModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Address not found")

    db.delete(data)
    db.commit()
    return{
        "msg":"sucessfully removed address"
    }


@app.put("/updateaddress/{id}")
def updateaddress(id:int, address:AddressSchema, db:Session = Depends(get_db), user:int = Depends(current_user)):
    data = db.query(AddresModel).filter(AddresModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Address not found")
    data.name = address.name
    data.street = address.street
    data.city = address.city
    data.state = address.state
    db.commit()
    return{
        "msg":"Address updated successfully"
    }


#orderssection --------------------------------------------------------------------------------

@app.get("/orders")
def orders(db: Session = Depends(get_db),user: int = Depends(current_user)):
    data = db.query(OrderModel).filter(OrderModel.user_id == user).all()
    return data


@app.post("/addorders")
def addorders(order: OrderSchema,db: Session = Depends(get_db),user: int = Depends(current_user)):
    total = db.query(func.sum(CartitemModel.quantity * ProductsModel.price)).join(ProductsModel, CartitemModel.product_id == ProductsModel.id).filter(CartitemModel.user_id == user).scalar()
    addrss = db.query(AddresModel).filter(AddresModel.id == order.address_id, AddresModel.user_id == user).first()
    if not addrss:
        raise HTTPException(status_code=404,detail="invalid address")
    data = OrderModel(
        user_id = user,
        addres_id = addrss.id,
        total_price = total
)
    db.add(data)
    db.commit()

    
    return {
        "msg": "order placed"
    }




#login section ---------------------------------------------------------------------------------

@app.post("/signup")
def signup(signup: SignupModel, db: Session = Depends(get_db)):
    user = db.query(UsersModel).filter(UsersModel.username == signup.username).first()
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    passsword = hashpass(signup.password)
    data = UsersModel(
        email = signup.email,
        username = signup.username,
        password = passsword
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return data




@app.post("/login")
def login(login: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UsersModel).filter(UsersModel.username == login.username).first()

    if not user or not verify_pass(login.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "Bearer"
    }
    
