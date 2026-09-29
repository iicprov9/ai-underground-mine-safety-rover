import React from 'react';
import { Camera, Eye, Flame, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CameraFeeds({ isDemoMode, telemetry }) {
  const { t } = useLanguage();
  const isHumanDetected = telemetry?.ai_risk?.modalities?.rgb_vision === 'SUPPORTING EVIDENCE' || isDemoMode;

  return (
    <div className="row g-3">
      {/* RGB Camera Feed */}
      <div className="col-md-6">
        <div className="control-card p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="control-card-title text-white">
              <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                <Camera size={15} className="text-emerald" />
              </div>
              {t('rgbOptical')} (YOLOv8)
            </span>
            <span className="badge-tactical badge-safe font-monospace small">
              30 FPS | 1080p MJPEG
            </span>
          </div>

          <div className="video-stream-box">
            {/* Background Simulated Tunnel Video Graphic */}
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center flex-column text-center position-relative"
              style={{
                background: 'radial-gradient(circle, #0e1724 0%, #030508 100%)',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.95)'
              }}
            >
              {/* Simulated Tunnel Walls Canvas Effect */}
              <div className="text-secondary opacity-75 font-monospace small mb-2">
                [ TUNNEL A - ADVANCING 0.65 m/s ]
              </div>

              {/* Bounding Box Detection Overlay when Human Detected */}
              {isHumanDetected ? (
                <div
                  className="position-absolute p-2 border border-2 border-emerald rounded-3 text-white font-monospace"
                  style={{
                    top: '25%',
                    left: '35%',
                    width: '30%',
                    height: '55%',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)',
                    background: 'rgba(34, 197, 94, 0.15)'
                  }}
                >
                  <div className="btn-codespot-primary text-dark px-1.5 py-0.5 small fw-bold" style={{ fontSize: '0.65rem' }}>
                    PERSON / MINER (91%)
                  </div>
                </div>
              ) : (
                <div className="text-muted font-monospace small">
                  Clear Path - No Obstacles Detected
                </div>
              )}

              {/* Live Badge */}
              <div className="video-overlay-badge text-emerald d-flex align-items-center gap-1.5">
                <span className="status-indicator online"></span> LIVE RGB
              </div>

              {isDemoMode && (
                <div className="position-absolute bottom-0 end-0 p-1 m-2 bg-warning text-dark font-monospace rounded-3 fw-bold" style={{ fontSize: '0.65rem' }}>
                  {t('demoSimulation')}
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
            <span className="control-card-title text-white">
              <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                <Flame size={15} className="text-emerald" />
              </div>
              {t('thermalIr')}
            </span>
            <span className="badge-tactical badge-safe font-monospace small">
              HEAT SIGNATURE: 36.8°C
            </span>
          </div>

          <div className="video-stream-box">
            {/* Heatmap Matrix Simulation */}
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center flex-column text-center position-relative"
              style={{
                background: 'linear-gradient(135deg, #09121d 0%, #0d3824 50%, #22c55e 100%)',
                opacity: 0.95
              }}
            >
              {/* Thermal Heat Hotspot Circle */}
              <div
                className="position-absolute rounded-circle border border-warning"
                style={{
                  top: '30%',
                  left: '42%',
                  width: '60px',
                  height: '60px',
                  background: 'radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0.2) 70%, transparent 100%)',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.8)',
                  animation: 'pulse-amber 1.5s infinite'
                }}
              ></div>

              <div className="position-absolute top-0 end-0 p-2 font-monospace small text-white opacity-75">
                MLX90640 (32x24 Matrix)
              </div>

              {/* Thermal Live Badge */}
              <div className="video-overlay-badge text-emerald d-flex align-items-center gap-1.5">
                <span className="status-indicator online"></span> THERMAL IR
              </div>

              <div className="position-absolute bottom-0 start-0 p-2 text-white font-monospace small" style={{ fontSize: '0.72rem' }}>
                MAX: 37.2°C | MIN: 21.4°C | DELTA: +15.8°C
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
