from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException, status
from database.config import settings


def verify_google_token(token: str) -> dict:
    print("=" * 60)
    print("GOOGLE CLIENT ID:", repr(settings.google_client_id))

    try:
        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.google_client_id,
        )

        print("TOKEN AUD:", id_info.get("aud"))
        print("=" * 60)

        return {
            "email": id_info.get("email"),
            "name": id_info.get("name"),
            "picture": id_info.get("picture"),
            "email_verified": id_info.get("email_verified", False),
        }

    except Exception as exc:
        print("ERROR:", repr(exc))
        print("=" * 60)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {exc}",
        )