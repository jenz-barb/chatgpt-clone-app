from pydantic import BaseModel, EmailStr
from typing import Optional

# ----------- Auth Schemas -----------
class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ----------- Chat Message Input -----------
class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[int] = None  # New chat if None

# ----------- Thread Creation -----------
class ThreadCreate(BaseModel):
    title: str

# ----------- Thread Rename -----------
class ThreadRenameRequest(BaseModel):
    title: str  # Required for PATCH
