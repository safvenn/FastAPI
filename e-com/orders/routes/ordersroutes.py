from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db
from auth.auth import current_user
from orders.models.ordermodels import OrderModel
from orders.schemas.orderschemas import OrderSchema
from products.models.products_model import ProductsModel
from users.models.address import AddresModel
from cart.models.catitemmodel import CartitemModel

router = APIRouter()

@router.get("/orders")
def orders(db: Session = Depends(get_db),user: int = Depends(current_user)):
    data = db.query(OrderModel).filter(OrderModel.user_id == user).all()
    return data


@router.post("/orders")
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