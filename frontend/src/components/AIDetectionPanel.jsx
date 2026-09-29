import React from 'react';
import { Cpu, CheckCircle, AlertTriangle, Eye, Flame, Mic, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AIDetectionPanel({ aiRisk, isDemoMode }) {
  const { t } = useLanguage();
  const isHuman = aiRisk?.modalities?.rgb_vision === 'SUPPORTING EVIDENCE' || isDemoMode;
  const isThermal = aiRisk?.modalities?.thermal_ir === 'SUPPORTING EVIDENCE' || isDemoMode;
  const isAudio = aiRisk?.modalities?.audio_acoustic === 'SUPPORTING EVIDENCE' || isDemoMode;
  const confidence = aiRisk?.confidence || 91.0;

  return (
    <div className="control-card p-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <Cpu size={15} className="text-emerald" />
          </div>
          {t('aiDetectionTitle')}
        </div>
        <span className="badge-tactical badge-safe font-monospace">
          CONFIDENCE: {confidence}%
        </span>
      </div>

      {/* Main Detection Event Result Box */}
      <div 
        className={`p-3 rounded-4 mb-3 border ${isHuman ? 'border-warning text-white' : 'border-secondary border-opacity-25 text-light'}`} 
        style={{ background: isHuman ? 'rgba(245, 158, 11, 0.12)' : '#080c12' }}
      >
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fw-bold font-monospace fs-6 text-emerald">
            {isHuman ? t('workerConfirmed') : 'CLEAR RECONNAISSANCE PATH'}
          </span>
          {isHuman ? <AlertTriangle size={18} className="text-warning" /> : <ShieldCheck size={18} className="text-emerald" />}
        </div>
        <div className="small text-secondary font-monospace">
          {isHuman
            ? 'Multimodal evidence indicates potential trapped worker at Tunnel A Sector 4.'
            : 'No personnel distress signals or obstacle obstructions detected in active tunnel segment.'}
        </div>
      </div>

      {/* Evidence Breakdown Modalities */}
      <div className="vstack gap-2">
        {/* RGB Vision Evidence */}
        <div className="d-flex align-items-center justify-content-between p-2.5 rounded-3 border" style={{ background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2">
            <Eye size={16} className="text-emerald" />
            <span className="small text-light font-monospace">RGB Vision (YOLOv8)</span>
          </div>
          <span className={`badge-tactical ${isHuman ? 'badge-warning' : 'badge-safe'}`}>
            {isHuman ? 'DETECTED' : 'CLEAR'}
          </span>
        </div>

        {/* Thermal Infrared Evidence */}
        <div className="d-flex align-items-center justify-content-between p-2.5 rounded-3 border" style={{ background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2">
            <Flame size={16} className="text-emerald" />
            <span className="small text-light font-monospace">{t('thermalSignature')} (36.8°C)</span>
          </div>
          <span className={`badge-tactical ${isThermal ? 'badge-safe' : 'badge-safe'}`}>
            {isThermal ? 'CONFIRMED' : 'NORMAL'}
          </span>
        </div>

        {/* Acoustic Audio Evidence */}
        <div className="d-flex align-items-center justify-content-between p-2.5 rounded-3 border" style={{ background: '#080c12', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2">
            <Mic size={16} className="text-emerald" />
            <span className="small text-light font-monospace">{t('acousticDistress')}</span>
          </div>
          <span className={`badge-tactical ${isAudio ? 'badge-warning' : 'badge-safe'}`}>
            {isAudio ? 'SUPPORTING' : 'NO DISTRESS'}
          </span>
        </div>
      </div>

      {!isThermal && isHuman && (
        <div className="alert alert-warning p-2 mt-3 mb-0 small font-monospace d-flex align-items-center gap-2 rounded-3" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
          <AlertCircle size={14} /> Single modality detected. Evidence incomplete; requesting thermal scan confirmation.
        </div>
      )}
    </div>
  );
}
