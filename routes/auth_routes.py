from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import UserSignup
from auth import hash_password
from database import get_db
from models import User

router = APIRouter()

@router.post("/signup")
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    try:
        user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password)  # ✅ fix here
        )
        db.add(user)
        db.commit()
        return {"message": "User created successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")



from schemas import UserLogin
from auth import verify_password, create_access_token

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    print("🔍 Received login email:", user.email)

    db_user = db.query(User).filter(User.email == user.email).first()
    print("👤 Found user:", db_user)

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        print("❌ Password check failed or user not found")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(user.email)
    print("✅ Login successful, token created")

    return {"access_token": token, "email": user.email}

