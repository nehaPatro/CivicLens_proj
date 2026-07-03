"""
User profile routes.
"""
from fastapi import APIRouter, Depends
from bson import ObjectId

from middleware.auth_middleware import get_current_user
from database.db import get_database
from schemas.user_schema import UserResponse, UpdateProfileRequest
from utils.helpers import serialize_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Get the profile of the currently authenticated user."""
    return serialize_user(current_user)


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    payload: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Update the current user's name and/or profile picture."""
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update_data:
        await db.users.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    return serialize_user(updated_user)
