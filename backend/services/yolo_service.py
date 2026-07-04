"""
YOLO inference service. Loads the pre-trained pothole.pt and flood.pt
Ultralytics models once at startup and exposes helpers to run detection
on images and videos, drawing thin bounding boxes on the output media.
"""
import os
import cv2
from ultralytics import YOLO
from database.config import settings

# ---------------------------------------------------------------------------
# Model loading (singleton) — models are loaded once and reused across requests
# ---------------------------------------------------------------------------
_pothole_model: YOLO | None = None
_flood_model: YOLO | None = None

# Thin, non-intrusive bounding box style
BOX_COLOR = {"pothole": (0, 140, 255), "flood": (255, 140, 0)}  # BGR
BOX_THICKNESS = 2
FONT_SCALE = 0.5
FONT_THICKNESS = 1


def _load_model(path: str) -> YOLO:
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"YOLO model not found at '{path}'. Place your trained .pt file there."
        )
    return YOLO(path)


def get_pothole_model() -> YOLO:
    global _pothole_model
    if _pothole_model is None:
        _pothole_model = _load_model(settings.pothole_model_path)
    return _pothole_model


def get_flood_model() -> YOLO:
    global _flood_model
    if _flood_model is None:
        _flood_model = _load_model(settings.flood_model_path)
    return _flood_model


def get_model_for_type(detection_type: str) -> YOLO:
    return get_pothole_model() if detection_type == "pothole" else get_flood_model()


def _draw_thin_boxes(frame, results, detection_type: str):
    """Draw slim bounding boxes + label so the underlying image stays visible."""
    color = BOX_COLOR.get(detection_type, (0, 255, 0))
    boxes_data = []

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = result.names.get(cls_id, detection_type)

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, BOX_THICKNESS)
            text = f"{label} {conf * 100:.0f}%"
            (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, FONT_SCALE, FONT_THICKNESS)
            cv2.rectangle(frame, (x1, max(0, y1 - th - 6)), (x1 + tw + 4, y1), color, -1)
            cv2.putText(
                frame, text, (x1 + 2, max(12, y1 - 4)),
                cv2.FONT_HERSHEY_SIMPLEX, FONT_SCALE, (255, 255, 255), FONT_THICKNESS, cv2.LINE_AA,
            )

            boxes_data.append({
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "confidence": round(conf, 4), "label": label,
            })

    return frame, boxes_data


def run_image_detection(input_path: str, output_path: str, detection_type: str):
    """Run YOLO inference on a single image and save the annotated result."""
    model = get_model_for_type(detection_type)

    frame = cv2.imread(input_path)
    if frame is None:
        raise ValueError("Could not read the uploaded image.")

    conf = getattr(settings, f"{detection_type}_confidence_threshold")

    results = model.predict(
        source=frame,
        conf=conf,
        verbose=False
    )

    annotated, boxes_data = _draw_thin_boxes(
        frame.copy(),
        results,
        detection_type
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cv2.imwrite(output_path, annotated)

    return boxes_data


def run_video_detection(input_path: str, output_path: str, detection_type: str):
    """Run YOLO inference frame-by-frame on a video and save the annotated result."""
    model = get_model_for_type(detection_type)

    cap = cv2.VideoCapture(input_path)

    if not cap.isOpened():
        raise ValueError(f"Could not open video: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    print("=" * 50)
    print("VIDEO INFORMATION")
    print(f"Input: {input_path}")
    print(f"Output: {output_path}")
    print(f"FPS: {fps}")
    print(f"Width: {width}")
    print(f"Height: {height}")
    print(f"Frames: {frame_count}")
    print("=" * 50)

    if fps is None or fps <= 1:
        fps = 30

    if width <= 0 or height <= 0:
        cap.release()
        raise ValueError("Invalid video dimensions.")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    fourcc = cv2.VideoWriter_fourcc(*"avc1")
    writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    if not writer.isOpened():
        cap.release()
        raise ValueError("VideoWriter could not be opened.")

    total_objects = 0
    processed_frames = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        results = model.predict(
            source=frame,
            conf=getattr(settings, f"{detection_type}_confidence_threshold"),
            verbose=False
        )

        annotated, boxes = _draw_thin_boxes(
            frame.copy(),
            results,
            detection_type
        )

        writer.write(annotated)

        total_objects += len(boxes)
        processed_frames += 1

    cap.release()
    writer.release()

    cv2.destroyAllWindows()

    print("Output Exists:", os.path.exists(output_path))

    if os.path.exists(output_path):
        print("Output Size:", os.path.getsize(output_path), "bytes")

    return {
        "frames_processed": processed_frames,
        "total_objects_detected": total_objects,
        "avg_objects_per_frame": round(
            total_objects / processed_frames, 2
        ) if processed_frames else 0
    }