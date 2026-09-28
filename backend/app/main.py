import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.database import engine, Base, SessionLocal
from app.api.routes import router as api_router
from app.services.telemetry_service import ws_manager, process_and_store_telemetry
from app.services.simulation_service import simulation_service
from app.database.models import SystemConfigModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MineRescueBackend")

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Enabled Underground Mine Rescue Rover Command API",
    description="Multisensory telemetry ingestion, AI risk fusion, and command & control system.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST API Router
app.include_router(api_router, prefix="/api")

# WebSocket Real-Time Endpoint
@app.websocket("/ws/telemetry/{rover_id}")
async def websocket_telemetry_endpoint(websocket: WebSocket, rover_id: str):
    await ws_manager.connect(websocket)
    logger.info(f"Dashboard WebSocket Client Connected for rover {rover_id}")
    try:
        while True:
            # Keep connection alive and accept client commands if sent
            data = await websocket.receive_text()
            logger.info(f"Received WS message: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        logger.info(f"Dashboard WebSocket Client Disconnected for rover {rover_id}")

# Background simulation task generator
async def background_simulation_loop():
    logger.info("Starting background telemetry generator loop...")
    while True:
        try:
            db = SessionLocal()
            try:
                # Check system config for demo mode status
                cfg = db.query(SystemConfigModel).filter(SystemConfigModel.rover_id == "ROVER-01").first()
                is_demo = cfg.is_demo_mode if cfg else True
                
                if is_demo:
                    sim_payload = simulation_service.generate_telemetry("ROVER-01")
                    broadcast_data = process_and_store_telemetry(db, sim_payload, is_demo=True)
                    await ws_manager.broadcast(broadcast_data)
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error in background simulation loop: {e}")
        
        await asyncio.sleep(2.0)

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(background_simulation_loop())

@app.get("/")
def root():
    return {
        "message": "AI-Enabled Mobile Multisensory Rover and Rescue Command System API",
        "documentation": "/docs",
        "health": "/api/health"
    }
