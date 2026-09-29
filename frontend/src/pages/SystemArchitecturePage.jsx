import React from 'react';
import { Cpu, Radio, Server, Database, ShieldAlert, Activity, ArrowDown, GitBranch } from 'lucide-react';

export default function SystemArchitecturePage() {
  return (
    <div className="container-fluid py-4 px-4">
      <div className="control-card p-4 mb-4">
        <h3 className="text-white brand-font fw-bold mb-2">
          SYSTEM ARCHITECTURE & MULTISENSORY DATA PIPELINE
        </h3>
        <p className="text-secondary small mb-4">
          Hardware sensory integration, ESP32 packet forwarding, edge computing, FastAPI REST/WebSocket middleware, and multimodal AI risk fusion.
        </p>

        {/* Interactive Architecture Flow */}
        <div className="p-4 rounded-4 border font-monospace text-light mb-4 shadow" style={{ background: '#080c12', borderColor: 'rgba(34, 197, 94, 0.25)', fontSize: '0.85rem', lineHeight: '1.6' }}>
          <div className="text-center text-emerald fw-bold mb-2">UNDERGROUND MINE ATMOSPHERIC ENVIRONMENT</div>
          <div className="text-center text-secondary mb-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-8">
              <div className="p-3.5 rounded-4 border" style={{ background: '#0c121c', borderColor: 'rgba(34, 197, 94, 0.35)' }}>
                <div className="fw-bold text-emerald mb-2.5">MOBILE RECONNAISSANCE ROVER SENSOR SUITE</div>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <span className="badge-tactical badge-safe">MQ-4/MQ-7 Gas Sensors</span>
                  <span className="badge-tactical badge-safe">DHT22 Temp & Humidity</span>
                  <span className="badge-tactical badge-safe">MPU6050 6-DOF IMU</span>
                  <span className="badge-tactical badge-safe">RGB HD Camera (YOLOv8)</span>
                  <span className="badge-tactical badge-safe">MLX90640 Thermal IR Array</span>
                  <span className="badge-tactical badge-safe">Acoustic Microphone</span>
                  <span className="badge-tactical badge-safe">Ultrasonic Distance</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-6">
              <div className="p-3 rounded-3 border" style={{ background: '#0b1018', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="fw-bold text-white">ESP32 LOW-LEVEL SENSOR CONTROLLER</div>
                <div className="text-secondary small">ADC Sampling, I2C/SPI Sensor Bus & Packet Serializer</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-6">
              <div className="p-3 rounded-3 border" style={{ background: '#0b1018', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="fw-bold text-emerald">COMMUNICATION LAYER</div>
                <div className="text-secondary small">ThingSpeak IoT Channel / WiFi AP / MQTT Broker / WebSockets</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-6">
              <div className="p-3 rounded-3 border" style={{ background: '#0b1018', borderColor: 'rgba(34, 197, 94, 0.4)' }}>
                <div className="fw-bold text-emerald">PYTHON FASTAPI BACKEND ENGINE</div>
                <div className="text-secondary small">REST Endpoints, CORS Middleware, WebSocket Broadcast Engine</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">┌──────────────────────┼──────────────────────┐</div>
          <div className="row text-center g-2">
            <div className="col-md-4">
              <div className="p-2.5 rounded-3 border" style={{ background: '#0b1018', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fw-bold text-light">SQLITE / POSTGRES</div>
                <div className="text-secondary small">Telemetry & Event DB</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-2.5 rounded-3 border" style={{ background: '#0b1018', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                <div className="fw-bold text-emerald">AI RISK FUSION ENGINE</div>
                <div className="text-secondary small">Isolation Forest & Rules</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-2.5 rounded-3 border" style={{ background: '#0b1018', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="fw-bold text-light">WEBSOCKET MANAGER</div>
                <div className="text-secondary small">Real-Time Client Stream</div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary my-2">└──────────────────────┼──────────────────────┘</div>
          <div className="text-center text-secondary my-2">│</div>
          <div className="row justify-content-center text-center">
            <div className="col-md-8">
              <div className="p-3.5 rounded-4 border" style={{ background: '#0c121c', borderColor: 'rgba(34, 197, 94, 0.5)', boxShadow: '0 0 25px rgba(34, 197, 94, 0.15)' }}>
                <div className="fw-bold text-emerald">RESCUE COMMAND DASHBOARD (REACT 18)</div>
                <div className="text-secondary small">Live Telemetry Cards • 2D Mine Map • Video Feeds • AI Risk Panel • Rover Control</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
