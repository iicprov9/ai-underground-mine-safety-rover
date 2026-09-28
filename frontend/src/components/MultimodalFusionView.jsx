import React from 'react';
import { GitMerge, Flame, Thermometer, Droplets, Activity, Eye, Mic, MapPin } from 'lucide-react';

export default function MultimodalFusionView({ modalities, isDemoMode }) {
  const modMap = modalities || {
    environmental: 'ACTIVE',
    rgb_vision: 'SUPPORTING EVIDENCE',
    thermal_ir: 'SUPPORTING EVIDENCE',
    audio_acoustic: 'ACTIVE',
    location_imu: 'ACTIVE'
  };

  const getModBadge = (status) => {
    switch (status) {
      case 'SUPPORTING EVIDENCE': return 'bg-success text-white border-success';
      case 'WARNING': return 'bg-warning text-dark border-warning';
      case 'CRITICAL': return 'bg-danger text-white border-danger';
      case 'INACTIVE': return 'bg-dark text-secondary border-secondary';
      default: return 'bg-info text-dark border-info';
    }
  };

  return (
    <div className="control-card p-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="control-card-title text-cyan">
          <GitMerge size={18} /> MULTIMODAL SENSORY FUSION ARCHITECTURE
        </div>
        <span className="badge bg-dark border border-secondary text-info font-monospace small">
          CROSS-MODAL EVIDENCE CORRELATION
        </span>
      </div>

      <div className="row align-items-center g-2">
        {/* Modality Stream Nodes */}
        <div className="col-md-5">
          <div className="vstack gap-1">
            <div className="d-flex align-items-center justify-content-between p-1.5 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1">
                <Flame size={13} className="text-warning" /> Gas Sensor (Methane/CO)
              </span>
              <span className={`badge ${getModBadge(modMap.environmental)}`}>{modMap.environmental || 'ACTIVE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-1.5 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1">
                <Thermometer size={13} className="text-danger" /> Temperature Gradient
              </span>
              <span className={`badge ${getModBadge(modMap.environmental)}`}>{modMap.environmental || 'ACTIVE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-1.5 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1">
                <Activity size={13} className="text-primary" /> Vibration / IMU Seismic
              </span>
              <span className={`badge ${getModBadge(modMap.location_imu)}`}>{modMap.location_imu || 'ACTIVE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-1.5 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1">
                <Eye size={13} className="text-info" /> RGB Camera (YOLO Person)
              </span>
              <span className={`badge ${getModBadge(modMap.rgb_vision)}`}>{modMap.rgb_vision || 'SUPPORTING EVIDENCE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-1.5 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1">
                <Flame size={13} className="text-danger" /> Thermal IR Body Heat
              </span>
              <span className={`badge ${getModBadge(modMap.thermal_ir)}`}>{modMap.thermal_ir || 'SUPPORTING EVIDENCE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-1.5 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1">
                <Mic size={13} className="text-warning" /> Audio Distress Microphones
              </span>
              <span className={`badge ${getModBadge(modMap.audio_acoustic)}`}>{modMap.audio_acoustic || 'ACTIVE'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Connector Arrow */}
        <div className="col-md-2 text-center my-2 my-md-0">
          <div className="text-cyan font-monospace fw-bold" style={{ fontSize: '1.2rem' }}>
            ───►
          </div>
          <div className="text-secondary small font-monospace" style={{ fontSize: '0.65rem' }}>
            WEIGHTED EVIDENCE FUSION
          </div>
        </div>

        {/* Target Risk Assessment Output Node */}
        <div className="col-md-5">
          <div className="p-3 rounded bg-dark border border-cyan text-center shadow-lg">
            <div className="text-cyan font-monospace fw-bold mb-1">
              MULTIMODAL FUSION ENGINE
            </div>
            <div className="text-secondary small mb-2 font-monospace" style={{ fontSize: '0.72rem' }}>
              Correlates atmospheric telemetry with thermal IR signatures & computer vision confidence scores.
            </div>
            <div className="badge bg-warning text-dark px-3 py-1.5 font-monospace fw-bold">
              OUTPUT: HAZARD & VICTIM RISK CLASSIFICATION
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
