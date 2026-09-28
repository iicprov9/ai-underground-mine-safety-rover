import React from 'react';
import { Camera, Eye, Flame, AlertCircle, RefreshCw } from 'lucide-react';

export default function CameraFeeds({ isDemoMode, telemetry }) {
  const isHumanDetected = telemetry?.ai_risk?.modalities?.rgb_vision === 'SUPPORTING EVIDENCE' || isDemoMode;

  return (
    <div className="row g-3">
      {/* RGB Camera Feed */}
      <div className="col-md-6">
        <div className="control-card p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="control-card-title text-cyan">
              <Camera size={16} /> LIVE RGB CAMERA FEED (YOLOv8)
            </span>
            <span className="badge bg-dark border border-secondary text-success font-monospace small">
              30 FPS | 1080p MJPEG
            </span>
          </div>

          <div className="video-stream-box border border-secondary">
            {/* Background Simulated Tunnel Video Graphic */}
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center flex-column text-center position-relative"
              style={{
                background: 'radial-gradient(circle, #1a273d 0%, #05080e 100%)',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)'
              }}
            >
              {/* Simulated Tunnel Walls Canvas Effect */}
              <div className="text-secondary opacity-25 font-monospace small mb-2">
                [ TUNNEL A - ADVANCING 0.65 m/s ]
              </div>

              {/* Bounding Box Detection Overlay when Human Detected */}
              {isHumanDetected ? (
                <div
                  className="position-absolute p-2 border border-2 border-danger rounded text-danger font-monospace"
                  style={{
                    top: '25%',
                    left: '35%',
                    width: '30%',
                    height: '55%',
                    boxShadow: '0 0 15px rgba(255,59,48,0.5)',
                    background: 'rgba(255,59,48,0.1)'
                  }}
                >
                  <div className="bg-danger text-white px-1 py-0.5 rounded small" style={{ fontSize: '0.65rem' }}>
                    PERSON / MINER (91%)
                  </div>
                </div>
              ) : (
                <div className="text-muted font-monospace small">
                  Clear Path - No Obstacles Detected
                </div>
              )}

              {/* Live Badge */}
              <div className="video-overlay-badge text-danger border border-danger d-flex align-items-center gap-1">
                <span className="status-indicator critical"></span> LIVE RGB
              </div>

              {isDemoMode && (
                <div className="position-absolute bottom-0 end-0 p-1 m-2 bg-warning text-dark font-monospace rounded" style={{ fontSize: '0.65rem' }}>
                  DEMO SIMULATION FEED
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thermal IR Camera Feed */}
      <div className="col-md-6">
        <div className="control-card p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="control-card-title text-danger">
              <Flame size={16} /> LIVE THERMAL INFRARED FEED
            </span>
            <span className="badge bg-dark border border-secondary text-warning font-monospace small">
              HEAT SIGNATURE: 36.8°C
            </span>
          </div>

          <div className="video-stream-box border border-secondary">
            {/* Heatmap Matrix Simulation */}
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center flex-column text-center position-relative"
              style={{
                background: 'linear-gradient(135deg, #20002c 0%, #cbb4d4 50%, #c31432 100%)',
                opacity: 0.85
              }}
            >
              {/* Thermal Heat Hotspot Circle */}
              <div
                className="position-absolute rounded-circle border border-warning"
                style={{
                  top: '30%',
                  left: '40%',
                  width: '70px',
                  height: '70px',
                  background: 'radial-gradient(circle, #ff0055 0%, #ffcc00 60%, transparent 100%)',
                  boxShadow: '0 0 25px #ff0055',
                  animation: 'pulse-red 1.5s infinite'
                }}
              ></div>

              <div className="video-overlay-badge text-warning border border-warning d-flex align-items-center gap-1">
                <span className="status-indicator warning"></span> LIVE THERMAL FLIR
              </div>

              <div className="position-absolute bottom-0 start-0 p-1 m-2 bg-dark text-info font-monospace rounded border border-secondary" style={{ fontSize: '0.68rem' }}>
                Body Heat Target Confirmed (36.8°C)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
