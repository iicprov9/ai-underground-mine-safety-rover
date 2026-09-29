from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import io
import csv

from app.database.database import get_db
from app.database.models import RoverModel, SensorTelemetryModel, EventModel, MissionModel, SystemConfigModel, AIResultModel
from app.schemas.schemas import (
    SensorTelemetryCreate, RoverControlCommand, RoverConnectConfig,
    AIAnalysisRequest, EventOut, MissionOut
)
from app.services.telemetry_service import process_and_store_telemetry, ws_manager
from app.services.simulation_service import simulation_service
from app.ai.risk_fusion import risk_fusion_engine

router = APIRouter()

# 1. Health check
@router.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "AI-Enabled Mobile Multisensory Rescue Rover Command System",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# Compatibility route for general latest telemetry
@router.get("/telemetry/latest")
def get_latest_telemetry_compat(rover_id: str = "ROVER-01", db: Session = Depends(get_db)):
    return get_rover_data(rover_id=rover_id, db=db)

# Compatibility route for ThingSpeak direct polling
@router.get("/thingspeak/latest")
def get_thingspeak_latest_compat(
    channel_id: Optional[str] = Query(None),
    api_key: Optional[str] = Query(None),
    field_moisture: Optional[str] = Query(None),
    field_temp: Optional[str] = Query(None),
    field_hum: Optional[str] = Query(None),
    field_tilt: Optional[str] = Query(None),
    field_raw: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    rover_id = f"THINGSPEAK-CH{channel_id}" if channel_id else "ROVER-01"
    sim_data = simulation_service.generate_telemetry(rover_id)
    payload = process_and_store_telemetry(db, sim_data, is_demo=True)
    return payload


# 2. Rovers list & status
@router.get("/rovers")
def get_rovers(db: Session = Depends(get_db)):
    rovers = db.query(RoverModel).all()
    if not rovers:
        # Seed default rover
        default_rover = RoverModel(
            rover_id="ROVER-01",
            name="Underground Rescue Rover 01",
            status="CONNECTED",
            mode="RECON",
            battery=94.0,
            speed=0.65,
            direction="FORWARD",
            esp32_ip="192.168.1.105",
            esp32_channel="CH-7742",
            comm_mode="Simulation"
        )
        db.add(default_rover)
        db.commit()
        db.refresh(default_rover)
        rovers = [default_rover]
    return rovers

# 3. Rover Connection configuration
@router.post("/rover/connect")
async def connect_rover(config: RoverConnectConfig, db: Session = Depends(get_db)):
    cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == config.rover_id).first()
    if not cfg:
        cfg = SystemConfigModel(rover_id=config.rover_id)
        db.add(cfg)
    
    cfg.esp32_ip = config.esp32_ip
    cfg.channel_id = config.channel_id
    cfg.api_base_url = config.api_base_url
    cfg.api_endpoint = config.api_endpoint
    cfg.mqtt_broker = config.mqtt_broker
    cfg.mqtt_topic = config.mqtt_topic
    cfg.comm_mode = config.comm_mode
    cfg.is_demo_mode = config.is_demo_mode
    cfg.refresh_interval = config.refresh_interval
    
    # Update Rover status
    rover = db.query(RoverModel).filter(RoverModel.rover_id == config.rover_id).first()
    if not rover:
        rover = RoverModel(rover_id=config.rover_id)
        db.add(rover)
    
    rover.status = "CONNECTED"
    rover.esp32_ip = config.esp32_ip
    rover.esp32_channel = config.channel_id
    rover.comm_mode = config.comm_mode
    
    db.commit()
    
    # Send WebSocket notification
    await ws_manager.broadcast({
        "type": "SYSTEM_STATUS",
        "rover_id": config.rover_id,
        "status": "CONNECTED",
        "comm_mode": config.comm_mode,
        "is_demo_mode": config.is_demo_mode,
        "message": f"Successfully connected to {config.rover_id} via {config.comm_mode}"
    })
    
    return {
        "status": "CONNECTED",
        "rover_id": config.rover_id,
        "comm_mode": config.comm_mode,
        "channel_id": config.channel_id,
        "esp32_ip": config.esp32_ip,
        "last_packet": "Just now",
        "message": "Rover configuration saved and connection established."
    }

@router.post("/rover/disconnect")
async def disconnect_rover(rover_id: str = "ROVER-01", db: Session = Depends(get_db)):
    rover = db.query(RoverModel).filter(RoverModel.rover_id == rover_id).first()
    if rover:
        rover.status = "DISCONNECTED"
        db.commit()
    
    await ws_manager.broadcast({
        "type": "SYSTEM_STATUS",
        "rover_id": rover_id,
        "status": "DISCONNECTED",
        "message": f"Rover {rover_id} disconnected by user request."
    })
    
    return {"status": "DISCONNECTED", "rover_id": rover_id}

# 4. Get Latest Telemetry Data for Rover
@router.get("/rover/{rover_id}/data")
def get_rover_data(rover_id: str, db: Session = Depends(get_db)):
    cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == rover_id).first()
    is_demo = cfg.is_demo_mode if cfg else True

    latest = db.query(SensorTelemetryModel).filter(
        SensorTelemetryModel.rover_id == rover_id
    ).order_by(SensorTelemetryModel.timestamp.desc()).first()

    if not latest or is_demo:
        # Generate dynamic simulation payload
        sim_data = simulation_service.generate_telemetry(rover_id)
        payload = process_and_store_telemetry(db, sim_data, is_demo=True)
        return payload

    # Return stored data
    fusion_result = risk_fusion_engine.evaluate_risk(
        gas=latest.gas,
        temperature=latest.temperature,
        humidity=latest.humidity,
        vibration=latest.vibration,
        battery=latest.battery,
        demo_mode=is_demo
    )

    return {
        "rover_id": latest.rover_id,
        "timestamp": latest.timestamp.isoformat() + "Z",
        "gas": {"value": latest.gas, "unit": "ppm", "status": "CRITICAL" if latest.gas > 40 else ("WARNING" if latest.gas > 25 else "SAFE")},
        "temperature": {"value": latest.temperature, "unit": "°C", "status": "CRITICAL" if latest.temperature > 42 else ("WARNING" if latest.temperature > 34 else "SAFE")},
        "humidity": {"value": latest.humidity, "unit": "%", "status": "SAFE"},
        "vibration": {"value": latest.vibration, "unit": "g", "status": "CRITICAL" if latest.vibration > 0.45 else ("WARNING" if latest.vibration > 0.25 else "SAFE")},
        "battery": latest.battery,
        "imu": {"x": latest.imu_x, "y": latest.imu_y, "z": latest.imu_z},
        "location": {"x": latest.loc_x, "y": latest.loc_y, "tunnel_id": latest.tunnel_id},
        "ai_risk": fusion_result,
        "is_demo_mode": is_demo
    }

# 5. Ingest ESP32 Telemetry Packet (POST /api/rover/{rover_id}/data)
@router.post("/rover/{rover_id}/data")
async def receive_esp32_telemetry(rover_id: str, telemetry: SensorTelemetryCreate, db: Session = Depends(get_db)):
    data_dict = telemetry.model_dump()
    data_dict["rover_id"] = rover_id
    
    cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == rover_id).first()
    is_demo = cfg.is_demo_mode if cfg else False

    payload = process_and_store_telemetry(db, data_dict, is_demo=is_demo)
    await ws_manager.broadcast(payload)

    return {
        "status": "ACCEPTED",
        "rover_id": rover_id,
        "processed_at": datetime.utcnow().isoformat() + "Z",
        "risk_level": payload["ai_risk"]["risk_level"]
    }

# 6. Remote Rover Control Command
@router.post("/rover/control")
async def control_rover(command: RoverControlCommand, db: Session = Depends(get_db)):
    rover = db.query(RoverModel).filter(RoverModel.rover_id == command.rover_id).first()
    if rover:
        if command.command in ["FORWARD", "REVERSE", "LEFT", "RIGHT", "STOP"]:
            rover.direction = command.command
        if command.speed is not None:
            rover.speed = command.speed
        db.commit()

    control_ack = {
        "type": "CONTROL_ACK",
        "rover_id": command.rover_id,
        "command": command.command,
        "speed": command.speed,
        "camera_rotation": command.camera_rotation,
        "status": "COMMAND ACKNOWLEDGED",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    await ws_manager.broadcast(control_ack)
    return control_ack

# 7. Rover Status Summary
@router.get("/rover/{rover_id}/status")
def get_rover_status(rover_id: str, db: Session = Depends(get_db)):
    rover = db.query(RoverModel).filter(RoverModel.rover_id == rover_id).first()
    cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == rover_id).first()
    
    if not rover:
        return {
            "rover_id": rover_id,
            "status": "DISCONNECTED",
            "battery": 0,
            "mode": "UNKNOWN",
            "comm_mode": "Simulation"
        }
    
    return {
        "rover_id": rover.rover_id,
        "name": rover.name,
        "status": rover.status,
        "mode": rover.mode,
        "battery": rover.battery,
        "speed": rover.speed,
        "direction": rover.direction,
        "mission_time": rover.mission_time,
        "latency": rover.latency,
        "esp32_ip": rover.esp32_ip,
        "esp32_channel": rover.esp32_channel,
        "comm_mode": rover.comm_mode,
        "is_demo_mode": cfg.is_demo_mode if cfg else True,
        "updated_at": rover.updated_at.isoformat() if rover.updated_at else None
    }

# 8. Events API
@router.get("/events")
def get_events(limit: int = 50, db: Session = Depends(get_db)):
    events = db.query(EventModel).order_by(EventModel.timestamp.desc()).limit(limit).all()
    if not events:
        # Seed initial demo events for rescue command preview
        demo_events = [
            EventModel(
                event_id="EVT-1082",
                timestamp=datetime.utcnow() - timedelta(minutes=14),
                rover_id="ROVER-01",
                loc_x=124.0,
                loc_y=82.0,
                tunnel_id="Tunnel A",
                event_type="Gas Anomaly",
                sensor_source="Gas sensor + environmental anomaly",
                risk_level="HIGH",
                ai_confidence=91.0,
                status="UNACKNOWLEDGED",
                description="Elevated Methane/CO gas levels detected combined with ambient heat spike.",
                acknowledged=False
            ),
            EventModel(
                event_id="EVT-1081",
                timestamp=datetime.utcnow() - timedelta(minutes=32),
                rover_id="ROVER-01",
                loc_x=156.0,
                loc_y=110.0,
                tunnel_id="Tunnel B",
                event_type="Human Detected",
                sensor_source="RGB evidence + Thermal infrared confirm",
                risk_level="CRITICAL",
                ai_confidence=94.5,
                status="ACKNOWLEDGED",
                description="Thermal body heat signature confirmed at 36.8°C with visual hard-hat outline.",
                acknowledged=True
            ),
            EventModel(
                event_id="EVT-1080",
                timestamp=datetime.utcnow() - timedelta(minutes=55),
                rover_id="ROVER-01",
                loc_x=95.0,
                loc_y=60.0,
                tunnel_id="Tunnel C",
                event_type="Vibration Anomaly",
                sensor_source="3-Axis Accelerometer / IMU",
                risk_level="MODERATE",
                ai_confidence=82.0,
                status="ACKNOWLEDGED",
                description="Minor structural rock settling detected.",
                acknowledged=True
            )
        ]
        for e in demo_events:
            db.add(e)
        db.commit()
        events = demo_events
    return events

@router.post("/events/{event_id}/acknowledge")
async def acknowledge_event(event_id: str, db: Session = Depends(get_db)):
    evt = db.query(EventModel).filter(EventModel.event_id == event_id).first()
    if not evt:
        raise HTTPException(status_code=404, detail="Event not found")
    evt.acknowledged = True
    evt.status = "ACKNOWLEDGED"
    db.commit()
    
    await ws_manager.broadcast({
        "type": "EVENT_ACKNOWLEDGED",
        "event_id": event_id
    })
    return {"status": "SUCCESS", "event_id": event_id}

# 9. Missions API
@router.get("/missions")
def get_missions(db: Session = Depends(get_db)):
    missions = db.query(MissionModel).all()
    if not missions:
        m = MissionModel(
            name="Emergency Reconnaissance - Tunnel A & B",
            rover_id="ROVER-01",
            status="ACTIVE",
            start_time=datetime.utcnow() - timedelta(hours=1, minutes=25),
            total_events=3,
            description="Initial autonomous search and sensor mapping after seismic report."
        )
        db.add(m)
        db.commit()
        missions = [m]
    return missions

@router.post("/missions")
def create_mission(name: str, rover_id: str = "ROVER-01", description: str = "", db: Session = Depends(get_db)):
    m = MissionModel(
        name=name,
        rover_id=rover_id,
        status="ACTIVE",
        start_time=datetime.utcnow(),
        description=description
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

# 10. AI Analysis Manual Endpoint
@router.post("/ai/analyze")
def analyze_ai_manually(req: AIAnalysisRequest):
    result = risk_fusion_engine.evaluate_risk(
        gas=req.gas,
        temperature=req.temperature,
        humidity=req.humidity,
        vibration=req.vibration,
        rgb_human=req.rgb_evidence or False,
        thermal_human=req.thermal_evidence or False,
        audio_help=req.audio_evidence or False
    )
    return result

# 11. Configuration API
@router.get("/config")
def get_config(rover_id: str = "ROVER-01", db: Session = Depends(get_db)):
    cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == rover_id).first()
    if not cfg:
        cfg = SystemConfigModel(rover_id=rover_id)
        db.add(cfg)
        db.commit()
        db.refresh(cfg)
    return cfg

@router.post("/config")
async def update_config(config: RoverConnectConfig, db: Session = Depends(get_db)):
    cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == config.rover_id).first()
    if not cfg:
        cfg = SystemConfigModel(rover_id=config.rover_id)
        db.add(cfg)
    
    cfg.esp32_ip = config.esp32_ip
    cfg.channel_id = config.channel_id
    cfg.api_base_url = config.api_base_url
    cfg.api_endpoint = config.api_endpoint
    cfg.mqtt_broker = config.mqtt_broker
    cfg.mqtt_topic = config.mqtt_topic
    cfg.comm_mode = config.comm_mode
    cfg.is_demo_mode = config.is_demo_mode
    cfg.refresh_interval = config.refresh_interval
    db.commit()

    await ws_manager.broadcast({
        "type": "CONFIG_UPDATE",
        "is_demo_mode": config.is_demo_mode,
        "comm_mode": config.comm_mode
    })

    return {"status": "SUCCESS", "config": config}

# 12. Telemetry History & CSV Download
@router.get("/history")
def get_history(
    rover_id: str = "ROVER-01",
    time_range: str = Query("30m", description="5m, 30m, 1h, all"),
    format: str = Query("json", description="json or csv"),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    if time_range == "5m":
        start_time = now - timedelta(minutes=5)
    elif time_range == "1h":
        start_time = now - timedelta(hours=1)
    elif time_range == "30m":
        start_time = now - timedelta(minutes=30)
    else:
        start_time = now - timedelta(days=7)

    query = db.query(SensorTelemetryModel).filter(
        SensorTelemetryModel.rover_id == rover_id,
        SensorTelemetryModel.timestamp >= start_time
    ).order_by(SensorTelemetryModel.timestamp.desc())

    records = query.all()

    if not records:
        # Generate 20 synthetic points if DB is clean
        synthetic = []
        for i in range(20):
            ts = now - timedelta(minutes=i*2)
            synthetic.append({
                "id": i+1,
                "rover_id": rover_id,
                "timestamp": ts.isoformat() + "Z",
                "gas": round(12.0 + (i % 5)*2.5, 1),
                "temperature": round(28.0 + (i % 3)*1.2, 1),
                "humidity": round(65.0 - (i % 4)*1.5, 1),
                "vibration": round(0.05 + (i % 6)*0.03, 2),
                "battery": round(95.0 - i*0.5, 1),
                "loc_x": 120.0 + i*2,
                "loc_y": 80.0 + i,
                "tunnel_id": "Tunnel A"
            })
        if format == "csv":
            return export_csv(synthetic)
        return synthetic

    data_list = []
    for r in records:
        data_list.append({
            "id": r.id,
            "rover_id": r.rover_id,
            "timestamp": r.timestamp.isoformat() + "Z",
            "gas": r.gas,
            "temperature": r.temperature,
            "humidity": r.humidity,
            "vibration": r.vibration,
            "battery": r.battery,
            "loc_x": r.loc_x,
            "loc_y": r.loc_y,
            "tunnel_id": r.tunnel_id
        })

    if format == "csv":
        return export_csv(data_list)
    return data_list

def export_csv(data: List[Dict[str, Any]]):
    output = io.StringIO()
    if not data:
        return Response(content="", media_type="text/csv")
    fieldnames = list(data[0].keys())
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for row in data:
        writer.writerow(row)
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=mine_telemetry_export.csv"}
    )
