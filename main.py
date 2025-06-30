from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from database import Base, engine
from routes import auth_routes, chat_routes
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

# main.py
from fastapi import FastAPI
from routes import auth_routes, chat_routes
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChatGPT Clone API")

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(chat_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="ChatGPT Clone API",
        version="0.1.0",
        description="API for ChatGPT-like app with JWT Auth",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", [{"OAuth2PasswordBearer": []}])
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# ✅ Make sure this is NOT commented
app.openapi = custom_openapi
