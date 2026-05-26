
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from cart.models.catitemmodel import CartitemModel
from products.models.products_model import ProductsModel
from database.db import get_db
from auth.auth import current_user
from cart.schemas.addtocartschemas import AddtoCart


router = APIRouter()



@router.get("/cart")
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


@router.post("/addtocart")
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

@router.put("/updatecart/{id}")
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


@router.delete("/deletecart/{id}")
def deletecart(id:int,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(CartitemModel).filter(CartitemModel.id == id, CartitemModel.user_id == user).first()
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(data)
    db.commit()
    return {"msg": "Item deleted successfully"}



@router.delete("/clearcart")
def clearcart(db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(CartitemModel).filter(CartitemModel.user_id == user).all()
    if not data:
        raise HTTPException(status_code=404, detail="No items in cart")
    for item in data:
        db.delete(item)
    db.commit()
    return {"msg": "Cart cleared successfully"}
