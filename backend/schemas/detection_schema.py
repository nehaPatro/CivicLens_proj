"""
Pydantic schemas for detection results (pothole / flood, image / video).
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Literal


class DetectionBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    confidence: float
    label: str


class DetectionResultResponse(BaseModel):
    """Response returned immediately after running inference (not yet saved)."""
    detection_type: Literal["pothole", "flood"]
    media_type: Literal["image", "video"]
    original_file_url: str
    detected_file_url: str
    boxes: List[DetectionBox] = []
    total_objects_detected: int = 0


class SaveDetectionRequest(BaseModel):
    detection_type: Literal["pothole", "flood"]
    media_type: Literal["image", "video"]
    original_file_url: str
    detected_file_url: str
    total_objects_detected: int = 0


class SavedDetectionResponse(BaseModel):
    id: str
    user_id: str
    detection_type: str
    media_type: str
    original_file_url: str
    detected_file_url: str
    total_objects_detected: int
    timestamp: str
