from fastapi import APIRouter,Depends,HTTPException
from database.db import get_db
from auth.auth import current_user
from sqlalchemy.orm import Session
from users.models.usermodel import UsersModel
from users.models.address import AddresModel
from users.schemas.addressschemas import AddressSchema


router = APIRouter()

@router.get("/address")
def Address(db: Session = Depends(get_db),user:str = Depends(current_user)):
    data = db.query(AddresModel).filter(AddresModel.user_id == user).all()
    if len(data) < 1:
        return {
            "msg":"There is no address"
        }
    return data

@router.post("/address")
def addaddress(address:AddressSchema,db:Session = Depends(get_db),user:int = Depends(current_user)):
    user = db.query(UsersModel).filter(UsersModel.id == user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
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




@router.delete("/address/{id}")
def deladdress(id:int,db:Session = Depends(get_db),user:int = Depends(current_user)):
    data = db.query(AddresModel).filter(AddresModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Address not found")

    db.delete(data)
    db.commit()
    return{
        "msg":"sucessfully removed address"
    }


@router.put("/address/{id}")
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