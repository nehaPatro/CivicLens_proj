"""
CivicLens Backend — FastAPI application entrypoint.
AI Powered Smart City Infrastructure Monitoring System.
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from pymongo.errors import DuplicateKeyError

from database.config import settings
from database.db import connect_to_mongo, close_mongo_connection
from middleware.error_handler import (
    validation_exception_handler, duplicate_key_exception_handler, generic_exception_handler,
)
from routers import auth_router, profile_router, detection_router, report_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    os.makedirs(os.path.join(settings.upload_dir, "originals"), exist_ok=True)
    os.makedirs(os.path.join(settings.upload_dir, "detected"), exist_ok=True)
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="CivicLens API",
    description="AI Powered Smart City Infrastructure Monitoring System",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Static files (serve uploaded originals + detected media)
# ---------------------------------------------------------------------------
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(DuplicateKeyError, duplicate_key_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(detection_router.router)
app.include_router(report_router.router)


@app.get("/", tags=["Health"])
async def root():
    """Health check / welcome route."""
    return {
        "success": True,
        "message": "CivicLens API is running",
        "app": settings.app_name,
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=settings.debug)
