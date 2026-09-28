from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class RoverModel(Base):
    __tablename__ = "rovers"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)

    rover_id = Column(String(50), unique=True, index=True)
    name = Column(String(100), default="Underground Rescue Rover 01")
    status = Column(String(20), default="CONNECTED")  # CONNECTED, DISCONNECTED, WARNING, OFFLINE
    mode = Column(String(20), default="AUTO")       # AUTO, MANUAL, RECON
    battery = Column(Float, default=95.0)
    speed = Column(Float, default=0.5)
    direction = Column(String(20), default="FORWARD")
    mission_time = Column(Integer, default=1240)    # seconds
    latency = Column(Integer, default=18)           # ms
    esp32_ip = Column(String(50), default="192.168.1.105")
    esp32_channel = Column(String(50), default="CH-7742")
    comm_mode = Column(String(20), default="REST API")  # REST API, WebSocket, MQTT, Simulation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SensorTelemetryModel(Base):
    __tablename__ = "sensor_telemetry"

    id = Column(Integer, primary_key=True, index=True)
    rover_id = Column(String(50), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    gas = Column(Float, default=12.0)
    temperature = Column(Float, default=28.5)
    humidity = Column(Float, default=65.0)
    vibration = Column(Float, default=0.08)
    battery = Column(Float, default=95.0)
    imu_x = Column(Float, default=0.01)
    imu_y = Column(Float, default=0.02)
    imu_z = Column(Float, default=0.98)
    loc_x = Column(Float, default=120.0)
    loc_y = Column(Float, default=85.0)
    tunnel_id = Column(String(50), default="Tunnel-A East Sector")

class MissionModel(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Emergency Reconnaissance - Tunnel A")
    rover_id = Column(String(50), default="ROVER-01")
    status = Column(String(20), default="ACTIVE") # ACTIVE, PAUSED, COMPLETED
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_events = Column(Integer, default=3)
    description = Column(Text, default="Search for trapped personnel and map gas hazards in Tunnel A.")

class EventModel(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    rover_id = Column(String(50), index=True)
    loc_x = Column(Float, default=124.0)
    loc_y = Column(Float, default=82.0)
    tunnel_id = Column(String(50), default="Tunnel A")
    event_type = Column(String(50), default="Gas Anomaly") 
    sensor_source = Column(String(100), default="Gas sensor + environmental anomaly")
    risk_level = Column(String(20), default="HIGH") # NORMAL, LOW, MODERATE, HIGH, CRITICAL
    ai_confidence = Column(Float, default=91.0)
    status = Column(String(20), default="UNACKNOWLEDGED") # UNACKNOWLEDGED, ACKNOWLEDGED, RESOLVED
    description = Column(Text, default="Elevated Methane/CO gas levels detected combined with ambient heat spike.")
    acknowledged = Column(Boolean, default=False)

class AIResultModel(Base):
    __tablename__ = "ai_results"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    rover_id = Column(String(50))
    anomaly_detected = Column(Boolean, default=False)
    human_detected = Column(Boolean, default=False)
    thermal_confirmed = Column(Boolean, default=False)
    audio_anomaly = Column(Boolean, default=False)
    multimodal_risk = Column(String(20), default="NORMAL")
    confidence = Column(Float, default=0.0)
    factors_json = Column(Text, default="[]")

class SystemConfigModel(Base):
    __tablename__ = "system_configs"

    id = Column(Integer, primary_key=True, index=True)
    rover_id = Column(String(50), default="ROVER-01")
    esp32_ip = Column(String(50), default="192.168.1.105")
    channel_id = Column(String(50), default="CH-7742")
    api_base_url = Column(String(100), default="http://192.168.1.105:8080")
    api_endpoint = Column(String(100), default="/api/rover/ROVER-01/data")
    mqtt_broker = Column(String(100), default="broker.hivemq.com")
    mqtt_topic = Column(String(100), default="mine/rover/ROVER-01/telemetry")
    comm_mode = Column(String(20), default="Simulation")
    is_demo_mode = Column(Boolean, default=True)
    refresh_interval = Column(Integer, default=2)
