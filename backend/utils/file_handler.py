"""
Utility functions for saving uploaded files and generating unique filenames.
"""
import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException, status
from database.config import settings

ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXT = {".mp4", ".mov", ".avi", ".mkv"}


def get_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lower()


def validate_media_file(filename: str, media_type: str):
    ext = get_extension(filename)
    allowed = ALLOWED_IMAGE_EXT if media_type == "image" else ALLOWED_VIDEO_EXT
    if ext not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}' for {media_type}. Allowed: {allowed}",
        )
    return ext


async def save_upload_file(upload_file: UploadFile, media_type: str, subfolder: str = "originals") -> str:
    """
    Save an uploaded file to disk under uploads/<subfolder>/ with a unique name.
    Returns the relative file path.
    """
    ext = validate_media_file(upload_file.filename, media_type)
    unique_name = f"{uuid.uuid4().hex}{ext}"
    folder = os.path.join(settings.upload_dir, subfolder)
    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, unique_name)

    # Enforce max size while streaming to disk
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    size = 0
    async with aiofiles.open(file_path, "wb") as out_file:
        while chunk := await upload_file.read(1024 * 1024):
            size += len(chunk)
            if size > max_bytes:
                await out_file.close()
                os.remove(file_path)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds max size of {settings.max_upload_size_mb}MB",
                )
            await out_file.write(chunk)

    return file_path


def build_public_url(file_path: str) -> str:
    """Convert a local file path into a URL served by the /uploads static route."""
    normalized = file_path.replace("\\", "/")
    return f"/{normalized}"


def delete_file_if_exists(file_path: str):
    """Delete a physical file from disk if it exists (path relative to backend root)."""
    clean_path = file_path.lstrip("/")
    if os.path.exists(clean_path):
        try:
            os.remove(clean_path)
        except OSError:
            pass
