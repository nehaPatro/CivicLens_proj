# 🏙️ CivicLens — AI Powered Smart City Infrastructure Monitoring System

CivicLens is a full-stack, production-ready web application that uses **Ultralytics YOLO**
computer vision models to detect **potholes** and **floods** from images and videos,
helping citizens and municipal authorities monitor and report infrastructure issues in real time.

---

## ✨ Features

- 🔐 Manual Signup/Login, Google OAuth, JWT-based authentication with protected routes
- 🕳️ Pothole Detection (Image & Video)
- 🌊 Flood Detection (Image & Video)
- 🤖 AI-powered inference using your own trained YOLO `.pt` models
- 💾 Save detection results to MongoDB Atlas (view / download / delete)
- 📝 Submit civic issue reports from saved detections (location, description, severity)
- 👤 User profile with detection/report statistics
- 🌗 Dark / Light mode, fully responsive, modern UI
- ⚡ Built with FastAPI + React (Vite) + Tailwind CSS + MongoDB Atlas

---

## 🧱 Tech Stack

| Layer      | Technology                                             |
|------------|---------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Axios       |
| Backend    | FastAPI, Python 3.11, Ultralytics YOLO, OpenCV          |
| Database   | MongoDB Atlas (via Motor async driver)                  |
| Auth       | JWT (python-jose), bcrypt, Google OAuth 2.0              |
| Deployment | Vercel (frontend), Render (backend, Docker)              |

---

## 📁 Project Structure

```
civiclens/
├── backend/
│   ├── routers/          # API route definitions
│   ├── services/         # Business logic (auth, detection, reports, YOLO)
│   ├── models/            # (reserved for ORM/data models if needed)
│   ├── schemas/           # Pydantic request/response schemas
│   ├── database/          # MongoDB connection & app config
│   ├── middleware/        # Auth guard & global error handlers
│   ├── auth/               # JWT, password hashing, Google OAuth verification
│   ├── utils/              # File handling & helper utilities
│   ├── models_ai/          # Place pothole.pt and flood.pt here
│   ├── uploads/             # Runtime-uploaded originals & detected media
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/    # common/, dashboard/, landing/
    │   ├── pages/          # LandingPage, Login, Signup, dashboard/*
    │   ├── layouts/        # AuthLayout, DashboardLayout, PublicLayout
    │   ├── hooks/           # useAuth, useTheme, useDetection
    │   ├── services/        # api.js, authService, detectionService, reportService
    │   └── context/         # AuthContext, ThemeContext
    ├── package.json
    ├── vercel.json
    └── .env.example
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

# Place your trained models:
#   backend/models_ai/pothole.pt
#   backend/models_ai/flood.pt

uvicorn main:app --reload
```

Backend runs at `http://localhost:8000` — API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env
# Set VITE_API_BASE_URL and VITE_GOOGLE_CLIENT_ID

npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🔑 Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
Key variables:

- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET_KEY` — a long, random secret for signing JWTs
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console (OAuth 2.0 credentials)
- `POTHOLE_MODEL_PATH` / `FLOOD_MODEL_PATH` — paths to your `.pt` model files

---

## ☁️ Deployment

### Backend → Render
1. Push the `backend/` folder to a GitHub repo.
2. Create a new **Web Service** on Render, select "Docker" as the environment (uses the included `Dockerfile`).
3. Add the environment variables from `.env.example` in the Render dashboard (or use `render.yaml` with Blueprint deploys).
4. Upload/mount your `pothole.pt` and `flood.pt` files into `models_ai/` (e.g. via a persistent disk or by including them in the repo/image).

### Frontend → Vercel
1. Push the `frontend/` folder to a GitHub repo.
2. Import the project into Vercel — it auto-detects Vite via `vercel.json`.
3. Add `VITE_API_BASE_URL` (your deployed Render backend URL) and `VITE_GOOGLE_CLIENT_ID` as environment variables.
4. Deploy.

---

## 📡 API Overview

| Method | Endpoint                        | Description                          |
|--------|----------------------------------|---------------------------------------|
| POST   | `/api/auth/signup`               | Register with name/email/password     |
| POST   | `/api/auth/login`                | Login with email/password             |
| POST   | `/api/auth/google`               | Login/register via Google ID token    |
| GET    | `/api/profile/me`                | Get current user profile              |
| PUT    | `/api/profile/me`                | Update current user profile           |
| POST   | `/api/detect/pothole/image`      | Run pothole detection on an image     |
| POST   | `/api/detect/pothole/video`      | Run pothole detection on a video      |
| POST   | `/api/detect/flood/image`        | Run flood detection on an image       |
| POST   | `/api/detect/flood/video`        | Run flood detection on a video        |
| POST   | `/api/detect/save`               | Save a detection result                |
| GET    | `/api/detect/saved`              | List saved detections                  |
| DELETE | `/api/detect/saved/{id}`         | Delete a saved detection               |
| POST   | `/api/reports/`                   | Create a civic issue report            |
| GET    | `/api/reports/`                   | List submitted reports                 |

All routes except `/api/auth/*` require a `Bearer <JWT>` token in the `Authorization` header.

---

## 🛡️ License

This project is provided as a production-ready starter template. Customize and license as needed for your use case.
