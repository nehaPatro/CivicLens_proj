"""
Business logic for running detections and managing saved detection records.
"""
import os
import uuid
from bson import ObjectId
from fastapi import HTTPException, status, UploadFile

from services.yolo_service import run_image_detection, run_video_detection
from utils.file_handler import save_upload_file, build_public_url, delete_file_if_exists
from utils.helpers import utc_now_iso, serialize_detection


async def detect_media(upload_file: UploadFile, detection_type: str, media_type: str) -> dict:
    """Run YOLO inference on an uploaded image/video and return URLs + stats."""
    original_path = await save_upload_file(upload_file, media_type, subfolder="originals")

    ext = os.path.splitext(original_path)[1]
    detected_filename = f"{uuid.uuid4().hex}{ext}"
    detected_path = os.path.join("uploads", "detected", detected_filename)

    try:
        if media_type == "image":
            boxes = run_image_detection(original_path, detected_path, detection_type)
            stats = {"total_objects_detected": len(boxes), "boxes": boxes}
        else:
            result_stats = run_video_detection(original_path, detected_path, detection_type)
            stats = {"total_objects_detected": result_stats["total_objects_detected"], "boxes": []}
    except Exception as exc:
        delete_file_if_exists(original_path)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Detection failed: {exc}")

    return {
        "detection_type": detection_type,
        "media_type": media_type,
        "original_file_url": build_public_url(original_path),
        "detected_file_url": build_public_url(detected_path),
        "total_objects_detected": stats["total_objects_detected"],
        "boxes": stats["boxes"],
    }


async def save_detection(db, user_id: str, payload: dict) -> dict:
    """Persist a detection result to MongoDB and increment the user's counter."""
    doc = {
        "user_id": ObjectId(user_id),
        "detection_type": payload["detection_type"],
        "media_type": payload["media_type"],
        "original_file_url": payload["original_file_url"],
        "detected_file_url": payload["detected_file_url"],
        "total_objects_detected": payload.get("total_objects_detected", 0),
        "timestamp": utc_now_iso(),
    }
    result = await db.detections.insert_one(doc)
    doc["_id"] = result.inserted_id

    await db.users.update_one({"_id": ObjectId(user_id)}, {"$inc": {"total_detections": 1}})

    return serialize_detection(doc)


async def get_user_detections(db, user_id: str) -> list:
    cursor = db.detections.find({"user_id": ObjectId(user_id)}).sort("timestamp", -1)
    return [serialize_detection(doc) async for doc in cursor]


async def delete_detection(db, user_id: str, detection_id: str):
    doc = await db.detections.find_one({"_id": ObjectId(detection_id), "user_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detection not found")

    delete_file_if_exists(doc["original_file_url"])
    delete_file_if_exists(doc["detected_file_url"])

    await db.detections.delete_one({"_id": ObjectId(detection_id)})
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$inc": {"total_detections": -1}})
