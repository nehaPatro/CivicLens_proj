"""
Miscellaneous helper functions shared across the backend.
"""
from datetime import datetime, timezone
from bson import ObjectId


def utc_now_iso() -> str:
    """Return the current UTC time as an ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def oid_to_str(value) -> str:
    """Safely convert an ObjectId (or already-string id) to string."""
    return str(value) if isinstance(value, ObjectId) else value


def serialize_user(user: dict) -> dict:
    """Convert a MongoDB user document into a JSON-serializable dict."""
    return {
        "id": oid_to_str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "profile_picture": user.get("profile_picture"),
        "auth_provider": user.get("auth_provider", "manual"),
        "total_detections": user.get("total_detections", 0),
        "total_reports": user.get("total_reports", 0),
        "created_at": user.get("created_at", ""),
    }


def serialize_detection(doc: dict) -> dict:
    """Convert a MongoDB detection document into a JSON-serializable dict."""
    return {
        "id": oid_to_str(doc["_id"]),
        "user_id": oid_to_str(doc["user_id"]),
        "detection_type": doc.get("detection_type"),
        "media_type": doc.get("media_type"),
        "original_file_url": doc.get("original_file_url"),
        "detected_file_url": doc.get("detected_file_url"),
        "total_objects_detected": doc.get("total_objects_detected", 0),
        "timestamp": doc.get("timestamp"),
    }


def serialize_report(doc: dict) -> dict:
    """Convert a MongoDB report document into a JSON-serializable dict."""
    return {
        "id": oid_to_str(doc["_id"]),
        "user_id": oid_to_str(doc["user_id"]),
        "detection_id": oid_to_str(doc["detection_id"]),
        "detection_type": doc.get("detection_type"),
        "detected_file_url": doc.get("detected_file_url"),
        "location": doc.get("location"),
        "description": doc.get("description"),
        "severity": doc.get("severity"),
        "status": doc.get("status", "pending"),
        "timestamp": doc.get("timestamp"),
    }
