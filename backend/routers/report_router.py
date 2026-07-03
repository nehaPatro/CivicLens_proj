"""
Civic issue report routes.
"""
from fastapi import APIRouter, Depends

from middleware.auth_middleware import get_current_user
from database.db import get_database
from schemas.report_schema import CreateReportRequest, ReportResponse
from services.report_service import create_report, get_user_reports

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.post("/", response_model=ReportResponse, status_code=201)
async def submit_report(
    payload: CreateReportRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Create a new civic issue report from a saved detection."""
    return await create_report(db, str(current_user["_id"]), payload)


@router.get("/", response_model=list[ReportResponse])
async def list_reports(current_user: dict = Depends(get_current_user), db=Depends(get_database)):
    """Get all reports submitted by the current user."""
    return await get_user_reports(db, str(current_user["_id"]))
