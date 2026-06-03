from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from users.models.usermodel import UsersModel
from auth.auth import current_user
from database.db import get_db
from orders.models.ordermodels import OrderModel
from admin.schemas.orderschemas import Ordesschemas
from users.schemas.userschema import ProfileSchema
router = APIRouter()


@router.get("/users",response_model=list[ProfileSchema])
def users(db: Session = Depends(get_db),user:str = Depends(current_user)):
    user_obj = db.query(UsersModel).filter(UsersModel.id == user).first()
    if user_obj and user_obj.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access needed")
    data = db.query(UsersModel).all()
    return data




@router.put("/addadmin")
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



@router.delete("/deluser")
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


@router.get("/admin/orders",response_model=list[Ordesschemas])  
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


@router.put("/admin/orders/{order_id}/status")
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

@router.put("/orderupdate")

def updatests(status:str,db: Session = Depends(get_db),user: int = Depends(current_user)):

    data = db.query(OrderModel).filter(OrderModel.user_id == user).first()

    if not data:
        raise HTTPException(status_code=404,detail="invalid order")

    data.status = status
    db.commit()

    return {
        "msg":"status updated {status}"
    }
