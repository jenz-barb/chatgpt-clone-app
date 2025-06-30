from fastapi import APIRouter, HTTPException, Depends, Path
from sqlalchemy.orm import Session
from datetime import datetime
from schemas import ChatRequest, ThreadCreate, ThreadRenameRequest
from database import get_db
from models import ChatThread, ChatMessage, User
from auth import get_current_user

router = APIRouter()

# ------------------ Chat Endpoint ------------------
@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Get or create thread
        thread = db.query(ChatThread).filter_by(id=request.thread_id, user_id=current_user.id).first()
        if not thread:
            thread = ChatThread(user_id=current_user.id, title="New Chat")
            db.add(thread)
            db.commit()
            db.refresh(thread)

        # Save user message
        user_message = ChatMessage(
            thread_id=thread.id,
            sender="user",
            message=request.message,
            created_at=datetime.utcnow()
        )
        db.add(user_message)

        # Fake AI Response
        ai_response_text = f"AI says: You said '{request.message}'"
        ai_message = ChatMessage(
            thread_id=thread.id,
            sender="AI",
            message=ai_response_text,
            created_at=datetime.utcnow()
        )
        db.add(ai_message)
        db.commit()

        return {
            "response": ai_response_text,
            "sender": "AI",
            "timestamp": ai_message.created_at.isoformat(),
            "thread_id": thread.id
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


# ------------------ Get Threads Endpoint ------------------
@router.get("/threads")
def get_threads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    threads = db.query(ChatThread).filter(ChatThread.user_id == current_user.id).all()
    return [
        {
            "id": thread.id,
            "title": thread.title,
            "created_at": thread.created_at.isoformat()
        }
        for thread in threads
    ]


# ------------------ Create Thread ------------------
@router.post("/chat/threads")
def create_thread(
    request: ThreadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        thread = ChatThread(title=request.title, user_id=current_user.id)
        db.add(thread)
        db.commit()
        db.refresh(thread)
        return {"thread_id": thread.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating thread: {str(e)}")


# ------------------ Get Messages by Thread ------------------
@router.get("/chat/messages/{thread_id}")
def get_messages_by_thread(
    thread_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    thread = db.query(ChatThread).filter_by(id=thread_id, user_id=current_user.id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    messages = db.query(ChatMessage).filter_by(thread_id=thread_id).order_by(ChatMessage.created_at).all()
    return [
        {
            "sender": message.sender,
            "message": message.message,
            "timestamp": message.created_at.isoformat()
        }
        for message in messages
    ]


# ------------------ Rename Thread ------------------
@router.patch("/chat/threads/{thread_id}")
def rename_thread(
    thread_id: int,
    request: ThreadRenameRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    thread = db.query(ChatThread).filter_by(id=thread_id, user_id=current_user.id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    thread.title = request.title
    db.commit()
    db.refresh(thread)

    return {
        "thread_id": thread.id,
        "new_title": thread.title
    }
