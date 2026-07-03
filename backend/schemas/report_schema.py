"""
Pydantic schemas for civic issue reports.
"""
from pydantic import BaseModel, Field
from typing import Literal


class CreateReportRequest(BaseModel):
    detection_id: str
    location: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5, max_length=1000)
    severity: Literal["low", "medium", "high", "critical"]


class ReportResponse(BaseModel):
    id: str
    user_id: str
    detection_id: str
    detection_type: str
    detected_file_url: str
    location: str
    description: str
    severity: str
    status: str
    timestamp: str
