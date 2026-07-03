"""
Application configuration loaded from environment variables.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    app_name: str = "CivicLens"
    app_env: str = "development"
    debug: bool = True
    frontend_url: str = "http://localhost:5173"

    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "civiclens"

    # JWT
    jwt_secret_key: str = "change_me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 1440

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    # Uploads
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 50

    # YOLO
    pothole_model_path: str = "models_ai/pothole.pt"
    flood_model_path: str = "models_ai/flood.pt"
    yolo_confidence_threshold: float = 0.35

    port: int = 8000

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
print("GOOGLE CLIENT ID:", settings.google_client_id)