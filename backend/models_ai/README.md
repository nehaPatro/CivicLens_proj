# YOLO Models Directory

Place your trained Ultralytics YOLO model files here:

- `pothole.pt`  — trained pothole detection model
- `flood.pt`    — trained flood detection model

These paths are referenced via `POTHOLE_MODEL_PATH` and `FLOOD_MODEL_PATH`
in your `.env` file (see `.env.example`). The backend loads them once at
first inference request (lazy singleton loading in `services/yolo_service.py`).
