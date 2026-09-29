import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, BellOff, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function EmergencyAlertBanner({ alert, onAcknowledge }) {
  const { t } = useLanguage();
  if (!alert) return null;

  return (
    <div
      className="alert alert-danger border border-2 border-danger text-white p-3 shadow-lg mb-3 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-2 animate__animated animate__pulse animate__infinite"
      style={{ background: '#14080b', boxShadow: '0 0 30px rgba(239, 68, 68, 0.45)' }}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="p-2.5 bg-danger rounded-3 text-white me-1 shadow">
          <ShieldAlert size={26} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge-tactical badge-critical font-monospace fw-bold px-2.5 py-1">
              {t('criticalEmergency')}
            </span>
            <span className="font-monospace text-warning fw-bold">
              {alert.rover_id || 'ROVER-01'}
            </span>
            <span className="text-secondary small font-monospace">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="fw-bold fs-6 text-white">
            {alert.event_type || 'Elevated Methane/CO Gas & Environmental Thermal Hazard Spike'}
          </div>
          <div className="small text-secondary font-monospace">
            {t('location')}: <span className="text-emerald">{alert.location?.tunnel_id || 'Tunnel A Sector 4'}</span> (X:{alert.location?.x || 124} / Y:{alert.location?.y || 82}) | {t('sensors')}: <span className="text-white">{alert.sensor_source || 'Gas sensor + Environmental Anomaly'}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-danger text-white fw-bold font-monospace btn-sm px-4 py-2 shadow d-flex align-items-center gap-1.5 rounded-pill"
          onClick={onAcknowledge}
          style={{ boxShadow: '0 0 16px rgba(239, 68, 68, 0.5)' }}
        >
          <CheckCircle size={16} /> {t('ackEmergencyAlert')}
        </button>
      </div>
    </div>
  );
}
