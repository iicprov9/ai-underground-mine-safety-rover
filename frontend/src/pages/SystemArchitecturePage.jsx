import React from 'react';
import { Cpu, Radio, Server, Database, ShieldAlert, Activity, ArrowDown, GitBranch } from 'lucide-react';

export default function SystemArchitecturePage() {
  return (
    <div className="container-fluid py-4 px-4">
      <div className="control-card p-4 mb-4 border-info">
        <h3 className="text-cyan font-monospace fw-bold mb-2">
          SYSTEM ARCHITECTURE & MULTISENSORY DATA PIPELINE
        </h3>
        <p className="text-secondary small mb-4">
          Overview of hardware sensory integration, low-level ESP32 packet forwarding, edge computing, FastAPI REST/WebSocket middleware, and multimodal AI risk fusion.
        </p>

        {/* ASCII/Box Interactive Architecture Diagram */}
        <div className="bg-dark p-4 rounded border border-secondary font-monospace text-light mb-4 shadow-inner" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
          <div className="text-center text-warning fw-bold mb-2">UNDERGROUND MINE ATMOSPHERIC ENVIRONMENT</div>
          <div className="text-center text-secondary mb-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-8">
              <div className="p-3 rounded border border-warning bg-secondary-dark">
                <div className="fw-bold text-warning mb-2">MOBILE RECONNAISSANCE ROVER PAYLOAD</div>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <span className="badge bg-dark border border-secondary text-info">MQ-4/MQ-7 Gas Sensors</span>
                  <span className="badge bg-dark border border-secondary text-danger">DHT22 Temp & Humidity</span>
                  <span className="badge bg-dark border border-secondary text-primary">MPU6050 6-DOF IMU</span>
                  <span className="badge bg-dark border border-secondary text-success">RGB HD Camera (YOLO)</span>
                  <span className="badge bg-dark border border-secondary text-warning">Thermal IR Array</span>
                  <span className="badge bg-dark border border-secondary text-light">Acoustic Microphone</span>
                  <span className="badge bg-dark border border-secondary text-cyan">Ultrasonic Distance</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-6">
              <div className="p-2.5 rounded border border-info bg-dark">
                <div className="fw-bold text-info">ESP32 LOW-LEVEL SENSOR CONTROLLER</div>
                <div className="text-secondary small">ADC Sampling, I2C/SPI Sensor Bus & Packet Serializer</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-6">
              <div className="p-2 rounded border border-primary bg-dark">
                <div className="fw-bold text-primary">COMMUNICATION LAYER</div>
                <div className="text-secondary small">WiFi Access Point / MQTT Broker Protocol / HTTP REST / WebSockets</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-6">
              <div className="p-2.5 rounded border border-cyan bg-dark">
                <div className="fw-bold text-cyan">PYTHON FASTAPI BACKEND SERVER</div>
                <div className="text-secondary small">REST Endpoints, CORS Middleware, WebSocket Broadcast Engine</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">┌──────────────────────┼──────────────────────┐</div>
          <div className="row text-center g-2">
            <div className="col-md-4">
              <div className="p-2 rounded border border-secondary bg-dark">
                <div className="fw-bold text-light">SQLITE / POSTGRES</div>
                <div className="text-secondary small">Telemetry & Event DB</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-2 rounded border border-warning bg-dark">
                <div className="fw-bold text-warning">AI RISK FUSION ENGINE</div>
                <div className="text-secondary small">Isolation Forest & Rules</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-2 rounded border border-success bg-dark">
                <div className="fw-bold text-success">WEBSOCKET MANAGER</div>
                <div className="text-secondary small">Real-Time Client Stream</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">└──────────────────────┼──────────────────────┘</div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-8">
              <div className="p-3 rounded border border-success bg-secondary-dark">
                <div className="fw-bold text-success">RESCUE COMMAND DASHBOARD (REACT 18)</div>
                <div className="text-secondary small">Live Telemetry Cards • 2D Mine Map • Video Feeds • AI Risk Panel • Rover Control</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
