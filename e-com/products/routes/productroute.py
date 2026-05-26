from fastapi import APIRouter, Depends, HTTPException
from database.db import get_db
from auth.auth import current_user
from sqlalchemy.orm import Session
from products.models.products_model import ProductsModel
from products.scemas.products_schemas import ProductsSchema
from users.models.usermodel import UsersModel   

router = APIRouter()

@router.get("/products")
def products(db: Session = Depends(get_db)):
    products = db.query(ProductsModel).all()
    return products

@router.post("/addproduct")
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



@router.delete("/deleteproduct")
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

@router.put("/updateproduct/{id}")
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
