import React from 'react';
import { Cpu, CheckCircle, AlertTriangle, Eye, Flame, Mic, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AIDetectionPanel({ aiRisk, isDemoMode }) {
  const isHuman = aiRisk?.modalities?.rgb_vision === 'SUPPORTING EVIDENCE' || isDemoMode;
  const isThermal = aiRisk?.modalities?.thermal_ir === 'SUPPORTING EVIDENCE' || isDemoMode;
  const isAudio = aiRisk?.modalities?.audio_acoustic === 'SUPPORTING EVIDENCE' || isDemoMode;
  const confidence = aiRisk?.confidence || 91.0;

  return (
    <div className="control-card p-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="control-card-title text-info">
          <Cpu size={18} /> AI MULTISENSORY EVIDENCE ANALYSIS
        </div>
        <span className="badge bg-dark border border-info text-info font-monospace">
          CONFIDENCE: {confidence}%
        </span>
      </div>

      {/* Main Detection Event Result Box */}
      <div className={`p-3 rounded mb-3 border ${isHuman ? 'bg-dark border-warning text-warning' : 'bg-dark border-secondary text-light'}`}>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fw-bold font-monospace fs-6">
            {isHuman ? 'POSSIBLE HUMAN DETECTED' : 'CLEAR RECONNAISSANCE PATH'}
          </span>
          {isHuman ? <AlertTriangle size={18} className="text-warning" /> : <ShieldCheck size={18} className="text-success" />}
        </div>
        <div className="small text-secondary">
          {isHuman
            ? 'Multimodal evidence indicates potential trapped worker at Tunnel A Sector 4.'
            : 'No personnel distress signals or obstacle obstructions detected in active tunnel segment.'}
        </div>
      </div>

      {/* Evidence Breakdown Modalities */}
      <div className="vstack gap-2">
        {/* RGB Vision Evidence */}
        <div className="d-flex align-items-center justify-content-between p-2 rounded bg-secondary-dark border border-secondary">
          <div className="d-flex align-items-center gap-2">
            <Eye size={16} className="text-info" />
            <span className="small text-light">RGB Vision Evidence</span>
          </div>
          <span className={`badge ${isHuman ? 'bg-success text-white' : 'bg-dark text-secondary'}`}>
            {isHuman ? 'DETECTED (YOLOv8)' : 'CLEAR'}
          </span>
        </div>

        {/* Thermal Infrared Evidence */}
        <div className="d-flex align-items-center justify-content-between p-2 rounded bg-secondary-dark border border-secondary">
          <div className="d-flex align-items-center gap-2">
            <Flame size={16} className="text-danger" />
            <span className="small text-light">Thermal Heat Signature (36.8°C)</span>
          </div>
          <span className={`badge ${isThermal ? 'bg-success text-white' : 'bg-dark text-secondary'}`}>
            {isThermal ? 'CONFIRMED' : 'NORMAL baseline'}
          </span>
        </div>

        {/* Acoustic Audio Evidence */}
        <div className="d-flex align-items-center justify-content-between p-2 rounded bg-secondary-dark border border-secondary">
          <div className="d-flex align-items-center gap-2">
            <Mic size={16} className="text-warning" />
            <span className="small text-light">Acoustic Distress Signal</span>
          </div>
          <span className={`badge ${isAudio ? 'bg-info text-dark' : 'bg-dark text-secondary'}`}>
            {isAudio ? 'SUPPORTING (HELP)' : 'NO DISTRESS'}
          </span>

        </div>
      </div>

      {!isThermal && isHuman && (
        <div className="alert alert-warning p-2 mt-3 mb-0 small font-monospace d-flex align-items-center gap-2">
          <AlertCircle size={14} /> Single modality detected. Evidence incomplete; requesting thermal scan confirmation.
        </div>
      )}
    </div>
  );
}
