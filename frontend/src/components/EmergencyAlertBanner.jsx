import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, BellOff, Volume2 } from 'lucide-react';

export default function EmergencyAlertBanner({ alert, onAcknowledge }) {
  if (!alert) return null;

  return (
    <div
      className="alert alert-danger border-2 border-danger bg-dark text-white p-3 shadow-lg mb-3 rounded d-flex align-items-center justify-content-between flex-wrap gap-2 animate__animated animate__pulse animate__infinite"
      style={{ boxShadow: '0 0 25px rgba(255, 59, 48, 0.4)' }}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="p-2.5 bg-danger rounded text-white me-1">
          <ShieldAlert size={26} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger text-white font-monospace fw-bold px-2 py-1">
              CRITICAL EMERGENCY EVENT
            </span>
            <span className="font-monospace text-warning font-weight-bold">
              {alert.rover_id || 'ROVER-01'}
            </span>
            <span className="text-secondary small font-monospace">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="fw-bold fs-6 text-danger">
            {alert.event_type || 'Elevated Methane/CO Gas & Environmental Thermal Hazard Spike'}
          </div>
          <div className="small text-light font-monospace">
            Location: <span className="text-warning">{alert.location?.tunnel_id || 'Tunnel A Sector 4'}</span> (X:{alert.location?.x || 124} / Y:{alert.location?.y || 82}) | Sensors: <span className="text-info">{alert.sensor_source || 'Gas sensor + Environmental Anomaly'}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-danger text-white fw-bold font-monospace btn-sm px-3 py-2 shadow-sm d-flex align-items-center gap-1"
          onClick={onAcknowledge}
        >
          <CheckCircle size={16} /> ACKNOWLEDGE EMERGENCY ALERT
        </button>
      </div>
    </div>
  );
}
