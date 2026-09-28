from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class IMUSchema(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 1.0

class LocationSchema(BaseModel):
    x: float = 120.0
    y: float = 80.0
    tunnel_id: Optional[str] = "Tunnel A"

class GasSchema(BaseModel):
    value: float = 12.0
    unit: str = "ppm"

class SensorTelemetryCreate(BaseModel):
    rover_id: Optional[str] = "ROVER-01"
    timestamp: Optional[str] = None
    gas: Optional[float] = 12.0
    temperature: Optional[float] = 28.5
    humidity: Optional[float] = 65.0
    vibration: Optional[float] = 0.08
    battery: Optional[float] = 95.0
    imu: Optional[IMUSchema] = Field(default_factory=IMUSchema)
    location: Optional[LocationSchema] = Field(default_factory=LocationSchema)

class SensorTelemetryOut(BaseModel):
    id: int
    rover_id: str
    timestamp: datetime
    gas: float
    temperature: float
    humidity: float
    vibration: float
    battery: float
    imu: IMUSchema
    location: LocationSchema

    class Config:
        from_attributes = True

class RoverControlCommand(BaseModel):
    rover_id: str = "ROVER-01"
    command: str  # FORWARD, REVERSE, LEFT, RIGHT, STOP, EMERGENCY_STOP, HEADLIGHT_TOGGLE, BUZZER_TOGGLE
    speed: Optional[float] = 50.0
    camera_rotation: Optional[float] = 0.0

class RoverConnectConfig(BaseModel):
    rover_id: str = "ROVER-01"
    esp32_ip: str = "192.168.1.105"
    channel_id: str = "CH-7742"
    api_base_url: str = "http://192.168.1.105:8080"
    api_endpoint: str = "/api/rover/ROVER-01/data"
    mqtt_broker: str = "broker.hivemq.com"
    mqtt_topic: str = "mine/rover/ROVER-01/telemetry"
    comm_mode: str = "Simulation"  # REST API, WebSocket, MQTT, Simulation
    is_demo_mode: bool = True
    refresh_interval: int = 2

class AIAnalysisRequest(BaseModel):
    rover_id: str = "ROVER-01"
    gas: float
    temperature: float
    humidity: float
    vibration: float
    rgb_evidence: Optional[bool] = False
    thermal_evidence: Optional[bool] = False
    audio_evidence: Optional[bool] = False
    location_x: Optional[float] = 120.0
    location_y: Optional[float] = 80.0

class EventOut(BaseModel):
    id: int
    event_id: str
    timestamp: datetime
    rover_id: str
    loc_x: float
    loc_y: float
    tunnel_id: str
    event_type: str
    sensor_source: str
    risk_level: str
    ai_confidence: float
    status: str
    description: str
    acknowledged: bool

    class Config:
        from_attributes = True

class MissionOut(BaseModel):
    id: int
    name: str
    rover_id: str
    status: str
    start_time: datetime
    end_time: Optional[datetime]
    total_events: int
    description: str

    class Config:
        from_attributes = True
