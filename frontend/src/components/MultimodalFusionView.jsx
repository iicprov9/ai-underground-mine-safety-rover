import React from 'react';
import { GitMerge, Flame, Thermometer, Droplets, Activity, Eye, Mic, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MultimodalFusionView({ modalities, isDemoMode }) {
  const { t } = useLanguage();
  const modMap = modalities || {
    environmental: 'ACTIVE',
    rgb_vision: 'SUPPORTING EVIDENCE',
    thermal_ir: 'SUPPORTING EVIDENCE',
    audio_acoustic: 'ACTIVE',
    location_imu: 'ACTIVE'
  };

  const getModBadge = (status) => {
    switch (status) {
      case 'SUPPORTING EVIDENCE': return 'badge-safe';
      case 'WARNING': return 'badge-warning';
      case 'CRITICAL': return 'badge-critical';
      case 'INACTIVE': return 'badge-tactical bg-dark text-secondary';
      default: return 'badge-safe';
    }
  };

  return (
    <div className="control-card p-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <GitMerge size={15} className="text-emerald" />
          </div>
          {t('fusionTitle')}
        </div>
        <span className="badge-tactical badge-safe small">
          CROSS-MODAL CORRELATION
        </span>
      </div>

      <div className="row align-items-center g-2">
        {/* Modality Stream Nodes */}
        <div className="col-md-5">
          <div className="vstack gap-1.5">
            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ fontSize: '0.75rem', background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1.5">
                <Flame size={13} className="text-emerald" /> Gas Sensor (Methane/CO)
              </span>
              <span className={getModBadge(modMap.environmental)}>{modMap.environmental || 'ACTIVE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ fontSize: '0.75rem', background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1.5">
                <Thermometer size={13} className="text-emerald" /> Temperature Gradient
              </span>
              <span className={getModBadge(modMap.environmental)}>{modMap.environmental || 'ACTIVE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ fontSize: '0.75rem', background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1.5">
                <Activity size={13} className="text-emerald" /> {t('seismicVibration')}
              </span>
              <span className={getModBadge(modMap.location_imu)}>{modMap.location_imu || 'ACTIVE'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ fontSize: '0.75rem', background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1.5">
                <Eye size={13} className="text-emerald" /> RGB Camera (YOLO Person)
              </span>
              <span className={getModBadge(modMap.rgb_vision)}>{modMap.rgb_vision || 'SUPPORTING'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ fontSize: '0.75rem', background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1.5">
                <Flame size={13} className="text-emerald" /> {t('thermalSignature')}
              </span>
              <span className={getModBadge(modMap.thermal_ir)}>{modMap.thermal_ir || 'SUPPORTING'}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border" style={{ fontSize: '0.75rem', background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-light font-monospace d-flex align-items-center gap-1.5">
                <Mic size={13} className="text-emerald" /> {t('acousticDistress')}
              </span>
              <span className={getModBadge(modMap.audio_acoustic)}>{modMap.audio_acoustic || 'ACTIVE'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Connector Arrow */}
        <div className="col-md-2 text-center my-2 my-md-0">
          <div className="text-emerald font-monospace fw-bold" style={{ fontSize: '1.4rem' }}>
            ───►
          </div>
          <div className="text-secondary small font-monospace" style={{ fontSize: '0.65rem' }}>
            WEIGHTED EVIDENCE FUSION
          </div>
        </div>

        {/* Target Risk Assessment Output Node */}
        <div className="col-md-5">
          <div className="p-3.5 rounded-4 border text-center shadow-lg" style={{ background: '#080d15', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
            <div className="text-emerald font-monospace fw-bold mb-1">
              MULTIMODAL FUSION ENGINE
            </div>
            <div className="text-secondary small mb-2 font-monospace" style={{ fontSize: '0.72rem' }}>
              $R = 0.35 V_h + 0.25 G_a + 0.20 T_h + 0.20 A_d$
            </div>
            <div className="d-flex justify-content-center gap-2">
              <span className="badge-tactical badge-safe">Cross-Verified</span>
              <span className="badge-tactical badge-safe">P(Victim) &gt; 92%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
