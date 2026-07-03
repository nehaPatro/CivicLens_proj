"""
Business logic for creating and retrieving civic issue reports.
"""
from bson import ObjectId
from fastapi import HTTPException, status

from utils.helpers import utc_now_iso, serialize_report


async def create_report(db, user_id: str, payload) -> dict:
    detection = await db.detections.find_one({
        "_id": ObjectId(payload.detection_id),
        "user_id": ObjectId(user_id),
    })
    if not detection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved detection not found")

    doc = {
        "user_id": ObjectId(user_id),
        "detection_id": ObjectId(payload.detection_id),
        "detection_type": detection["detection_type"],
        "detected_file_url": detection["detected_file_url"],
        "location": payload.location,
        "description": payload.description,
        "severity": payload.severity,
        "status": "pending",
        "timestamp": utc_now_iso(),
    }
    result = await db.reports.insert_one(doc)
    doc["_id"] = result.inserted_id

    await db.users.update_one({"_id": ObjectId(user_id)}, {"$inc": {"total_reports": 1}})

    return serialize_report(doc)


async def get_user_reports(db, user_id: str) -> list:
    cursor = db.reports.find({"user_id": ObjectId(user_id)}).sort("timestamp", -1)
    return [serialize_report(doc) async for doc in cursor]
