# AI-Enabled Mobile Multisensory Rover and Rescue Command System for Underground Mines

A full-stack, public-facing Rescue Command Dashboard and real-time monitoring system designed for AI-assisted emergency reconnaissance in underground mines.

---

## 🌟 System Architecture Overview

```
                      UNDERGROUND MINE
                             │
                  ┌──────────┴──────────┐
                  │      ROVER          │
                  │                     │
                  │ Gas (Methane/CO)    │
                  │ Temperature         │
                  │ Humidity            │
                  │ Vibration / IMU     │
                  │ RGB Camera          │
                  │ Thermal Camera      │
                  │ Audio / Microphone  │
                  │ Ultrasonic Distance │
                  └──────────┬──────────┘
                             │
                           ESP32
                             │
                     Communication Layer
                    WiFi / MQTT / REST
                             │
                     Backend / FastAPI
                             │
               ┌─────────────┼─────────────┐
               │             │             │
            Database      AI Engine    WebSocket
               │             │             │
               └─────────────┼─────────────┘
                             │
                  RESCUE COMMAND DASHBOARD
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    Telemetry            AI/Risk             Rover Control
    Monitoring          Assessment             & Alerts
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- **Bootstrap 5** & **Bootstrap Icons** & **Lucide React**
- **Chart.js** & **react-chartjs-2**
- **WebSockets** for real-time bi-directional streaming telemetry
- **Canvas 2D** Underground Mine Map with zoom/pan controls

### Backend
- **Python 3.14 / FastAPI**
- **SQLite / SQLAlchemy** for local data persistence
- **WebSockets Manager** & **REST APIs**
- **Multimodal AI Risk Fusion Engine** (Environmental Anomaly Detection, Vision Evidence Interface, Thermal Heat Signature Processing, Audio Distress Signal Processing)
- **Deterministic Mining Safety Rules**

---

## 🚀 Quick Start Instructions

### 1. Backend Setup & Launch

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn Server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Backend API will be running at `http://127.0.0.1:8000`. Swagger API docs available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup & Launch

```bash
cd frontend

# Install npm packages
npm install

# Start Vite Development Server
npm run dev
```
Frontend web dashboard will be available at `http://127.0.0.1:5173`.

---

## 📡 REST API Endpoints

- `GET /api/health` - API health check
- `GET /api/rovers` - List rovers and statuses
- `POST /api/rover/connect` - Save ESP32 channel and IP settings
- `POST /api/rover/disconnect` - Disconnect rover
- `GET /api/rover/{rover_id}/data` - Retrieve latest telemetry & AI risk assessment
- `POST /api/rover/{rover_id}/data` - ESP32 telemetry packet ingestion
- `POST /api/rover/control` - Send remote control commands (FORWARD, LEFT, RIGHT, REVERSE, STOP, EMERGENCY_STOP)
- `GET /api/events` - List hazard & emergency events
- `POST /api/events/{event_id}/acknowledge` - Mark event acknowledged
- `GET /api/history` - Historical telemetry data & CSV export (`format=csv`)
- `WS /ws/telemetry/{rover_id}` - Real-time WebSocket streaming feed

---

## 🛡️ Safety & Mandatory Protocol Disclaimer
The AI Multimodal Risk Assessment Engine is designed as an operational decision-support tool for emergency rescue commanders and **does NOT replace statutory mine safety protocols or official authority**.
