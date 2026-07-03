"""
Detection routes: pothole/flood image & video inference, save, list, delete.
"""
from fastapi import APIRouter, Depends, UploadFile, File

from middleware.auth_middleware import get_current_user
from database.db import get_database
from schemas.detection_schema import (
    DetectionResultResponse, SaveDetectionRequest, SavedDetectionResponse,
)
from services.detection_service import (
    detect_media, save_detection, get_user_detections, delete_detection,
)

router = APIRouter(prefix="/api/detect", tags=["Detection"])


@router.post("/pothole/image", response_model=DetectionResultResponse)
async def detect_pothole_image(file: UploadFile = File(...), _user: dict = Depends(get_current_user)):
    """Run pothole detection on an uploaded image."""
    return await detect_media(file, detection_type="pothole", media_type="image")


@router.post("/pothole/video", response_model=DetectionResultResponse)
async def detect_pothole_video(file: UploadFile = File(...), _user: dict = Depends(get_current_user)):
    """Run pothole detection on an uploaded video."""
    return await detect_media(file, detection_type="pothole", media_type="video")


@router.post("/flood/image", response_model=DetectionResultResponse)
async def detect_flood_image(file: UploadFile = File(...), _user: dict = Depends(get_current_user)):
    """Run flood detection on an uploaded image."""
    return await detect_media(file, detection_type="flood", media_type="image")


@router.post("/flood/video", response_model=DetectionResultResponse)
async def detect_flood_video(file: UploadFile = File(...), _user: dict = Depends(get_current_user)):
    """Run flood detection on an uploaded video."""
    return await detect_media(file, detection_type="flood", media_type="video")


@router.post("/save", response_model=SavedDetectionResponse, status_code=201)
async def save_detection_result(
    payload: SaveDetectionRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Save a detection result (original + detected files) to the user's saved results."""
    return await save_detection(db, str(current_user["_id"]), payload.model_dump())


@router.get("/saved", response_model=list[SavedDetectionResponse])
async def list_saved_detections(current_user: dict = Depends(get_current_user), db=Depends(get_database)):
    """Get all saved detections for the current user."""
    return await get_user_detections(db, str(current_user["_id"]))


@router.delete("/saved/{detection_id}", status_code=204)
async def delete_saved_detection(
    detection_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Delete a saved detection (and its files) belonging to the current user."""
    await delete_detection(db, str(current_user["_id"]), detection_id)
