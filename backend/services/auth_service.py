"""
Business logic for authentication: signup, login, and Google OAuth.
"""
from fastapi import HTTPException, status

from auth.password_handler import hash_password, verify_password
from auth.jwt_handler import create_access_token
from auth.google_oauth import verify_google_token
from utils.helpers import utc_now_iso, serialize_user


async def signup_user(db, name: str, email: str, password: str) -> dict:
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    user_doc = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "auth_provider": "manual",
        "profile_picture": None,
        "total_detections": 0,
        "total_reports": 0,
        "created_at": utc_now_iso(),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc


async def login_user(db, email: str, password: str) -> dict:
    user = await db.users.find_one({"email": email})
    if not user or user.get("auth_provider") != "manual":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not verify_password(password, user.get("password", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return user


async def google_login_user(db, id_token_str: str) -> dict:
    google_data = verify_google_token(id_token_str)
    email = google_data["email"]

    user = await db.users.find_one({"email": email})
    if not user:
        user_doc = {
            "name": google_data.get("name") or email.split("@")[0],
            "email": email,
            "password": None,
            "auth_provider": "google",
            "profile_picture": google_data.get("picture"),
            "total_detections": 0,
            "total_reports": 0,
            "created_at": utc_now_iso(),
        }
        result = await db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return user_doc

    return user


def generate_token_response(user: dict) -> dict:
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user)}
