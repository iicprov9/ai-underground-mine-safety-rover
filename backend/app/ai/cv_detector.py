from typing import Dict, Any

class ComputerVisionDetector:
    """
    Interface for edge RGB computer vision detection model (e.g. YOLOv8-nano).
    Detects humans/miners, structural obstacles, and fire/smoke.
    """
    def analyze_frame(self, frame_id: str, demo_trigger: bool = False) -> Dict[str, Any]:
        if demo_trigger:
            return {
                "human_detected": True,
                "label": "Trapped Miner / Worker",
                "confidence": 0.89,
                "bbox": [140, 80, 220, 310],
                "obstacle_detected": True,
                "smoke_detected": False
            }
        return {
            "human_detected": False,
            "label": "Clear Tunnel Path",
            "confidence": 0.95,
            "bbox": None,
            "obstacle_detected": False,
            "smoke_detected": False
        }

cv_detector = ComputerVisionDetector()
