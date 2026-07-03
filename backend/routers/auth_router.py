"""
Authentication routes: manual signup/login and Google OAuth login.
"""
from fastapi import APIRouter, Depends

from schemas.user_schema import SignupRequest, LoginRequest, GoogleAuthRequest, TokenResponse
from services.auth_service import signup_user, login_user, google_login_user, generate_token_response
from database.db import get_database

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(payload: SignupRequest, db=Depends(get_database)):
    """Register a new user with name, email and password."""
    user = await signup_user(db, payload.name, payload.email, payload.password)
    return generate_token_response(user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db=Depends(get_database)):
    """Authenticate an existing user with email and password."""
    user = await login_user(db, payload.email, payload.password)
    return generate_token_response(user)


@router.post("/google", response_model=TokenResponse)
async def google_login(payload: GoogleAuthRequest, db=Depends(get_database)):
    """Authenticate (or auto-register) a user via a Google ID token."""
    user = await google_login_user(db, payload.id_token)
    return generate_token_response(user)
