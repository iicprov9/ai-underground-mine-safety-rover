import json
import asyncio
from typing import List, Dict, Any
from fastapi import WebSocket
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.models import SensorTelemetryModel, EventModel, RoverModel, AIResultModel, SystemConfigModel
from app.ai.risk_fusion import risk_fusion_engine
from app.ai.cv_detector import cv_detector
from app.ai.thermal_processor import thermal_processor
from app.ai.audio_processor import audio_processor

class ConnectionManager:
    """Manages active WebSocket client connections for real-time dashboard updates."""
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_sockets = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_sockets.append(connection)
        for dead in dead_sockets:
            self.disconnect(dead)

ws_manager = ConnectionManager()

def process_and_store_telemetry(db: Session, telemetry_data: Dict[str, Any], is_demo: bool = False):
    rover_id = telemetry_data.get("rover_id", "ROVER-01")
    gas = float(telemetry_data.get("gas", 12.0))
    temperature = float(telemetry_data.get("temperature", 28.5))
    humidity = float(telemetry_data.get("humidity", 65.0))
    vibration = float(telemetry_data.get("vibration", 0.08))
    battery = float(telemetry_data.get("battery", 95.0))
    
    imu = telemetry_data.get("imu", {})
    imu_x = float(imu.get("x", 0.01))
    imu_y = float(imu.get("y", 0.02))
    imu_z = float(imu.get("z", 0.98))
    
    location = telemetry_data.get("location", {})
    loc_x = float(location.get("x", 120.0))
    loc_y = float(location.get("y", 80.0))
    tunnel_id = str(location.get("tunnel_id", "Tunnel A"))

    # Demo triggers evaluation
    triggers = telemetry_data.get("demo_triggers", {})
    rgb_human = bool(triggers.get("human_detected", False))
    thermal_human = bool(triggers.get("human_detected", False))
    audio_help = bool(triggers.get("human_detected", False))

    # Evaluate Multimodal AI Risk Fusion
    fusion_result = risk_fusion_engine.evaluate_risk(
        gas=gas,
        temperature=temperature,
        humidity=humidity,
        vibration=vibration,
        battery=battery,
        rgb_human=rgb_human,
        thermal_human=thermal_human,
        audio_help=audio_help,
        demo_mode=is_demo
    )

    # 1. Save Telemetry Record
    telemetry_record = SensorTelemetryModel(
        rover_id=rover_id,
        timestamp=datetime.utcnow(),
        gas=gas,
        temperature=temperature,
        humidity=humidity,
        vibration=vibration,
        battery=battery,
        imu_x=imu_x,
        imu_y=imu_y,
        imu_z=imu_z,
        loc_x=loc_x,
        loc_y=loc_y,
        tunnel_id=tunnel_id
    )
    db.add(telemetry_record)

    # 2. Update Rover Status in DB
    rover = db.query(RoverModel).filter(RoverModel.rover_id == rover_id).first()
    if not rover:
        rover = RoverModel(rover_id=rover_id)
        db.add(rover)
    
    rover.battery = battery
    rover.status = "CONNECTED"
    rover.updated_at = datetime.utcnow()

    # 3. Create Event if Risk Level is HIGH or CRITICAL
    risk_lvl = fusion_result.get("risk_level", "NORMAL")
    if risk_lvl in ["HIGH", "CRITICAL"]:
        evt_type = fusion_result.get("event_type", "Hazard Event")
        event_id = f"EVT-{int(datetime.utcnow().timestamp())}"
        
        # Check if similar recent unacknowledged event exists to avoid duplicate floods
        existing_event = db.query(EventModel).filter(
            EventModel.rover_id == rover_id,
            EventModel.event_type == evt_type,
            EventModel.acknowledged == False
        ).order_by(EventModel.timestamp.desc()).first()

        if not existing_event:
            new_event = EventModel(
                event_id=event_id,
                timestamp=datetime.utcnow(),
                rover_id=rover_id,
                loc_x=loc_x,
                loc_y=loc_y,
                tunnel_id=tunnel_id,
                event_type=evt_type,
                sensor_source=", ".join(fusion_result.get("contributing_factors", ["Multimodal Sensors"])),
                risk_level=risk_lvl,
                ai_confidence=fusion_result.get("confidence", 90.0),
                status="UNACKNOWLEDGED",
                description=fusion_result.get("recommended_action", "Emergency situation detected."),
                acknowledged=False
            )
            db.add(new_event)

    db.commit()

    # Prepare packet for WebSocket broadcast
    payload = {
        "type": "TELEMETRY_UPDATE",
        "rover_id": rover_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "gas": {"value": gas, "unit": "ppm", "status": "CRITICAL" if gas > 40 else ("WARNING" if gas > 25 else "SAFE")},
        "temperature": {"value": temperature, "unit": "°C", "status": "CRITICAL" if temperature > 42 else ("WARNING" if temperature > 34 else "SAFE")},
        "humidity": {"value": humidity, "unit": "%", "status": "SAFE"},
        "vibration": {"value": vibration, "unit": "g", "status": "CRITICAL" if vibration > 0.45 else ("WARNING" if vibration > 0.25 else "SAFE")},
        "battery": battery,
        "imu": {"x": imu_x, "y": imu_y, "z": imu_z},
        "location": {"x": loc_x, "y": loc_y, "tunnel_id": tunnel_id},
        "ai_risk": fusion_result,
        "is_demo_mode": is_demo
    }

    return payload
