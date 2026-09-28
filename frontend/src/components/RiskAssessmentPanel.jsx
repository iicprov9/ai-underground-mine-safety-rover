import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Shield, Info } from 'lucide-react';

export default function RiskAssessmentPanel({ aiRisk }) {
  const riskLevel = aiRisk?.risk_level || 'NORMAL';
  const confidence = aiRisk?.confidence || 85.0;
  const factors = aiRisk?.contributing_factors || ['Environmental telemetry within normal mine limits'];
  const rules = aiRisk?.rule_triggers || [];
  const action = aiRisk?.recommended_action || 'Maintain automated reconnaissance path. Monitor environmental telemetry.';

  const getRiskBg = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-danger text-white border-danger';
      case 'HIGH': return 'bg-warning text-dark border-warning';
      case 'MODERATE': return 'bg-info text-dark border-info';
      case 'LOW': return 'bg-primary text-white';
      default: return 'bg-success text-white';
    }
  };

  return (
    <div className="control-card p-3 h-100 border-warning">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="control-card-title text-warning">
          <ShieldAlert size={18} /> MULTIMODAL RISK ASSESSMENT ENGINE
        </div>
        <span className="text-secondary font-monospace small">
          Confidence: {confidence}%
        </span>
      </div>

      {/* Main Risk Level Badge Header */}
      <div className={`p-3 rounded mb-3 text-center fw-bold font-monospace border ${getRiskBg(riskLevel)}`}>
        <div className="fs-5 tracking-wider">RISK LEVEL: {riskLevel}</div>
        <div className="small font-monospace opacity-90 fw-normal">
          Safety Protocol Evaluation Active
        </div>
      </div>

      {/* Triggered Safety Rules & Factors */}
      <div className="mb-3">
        <label className="text-secondary small fw-bold mb-1">Main Contributing Hazard Factors:</label>
        <ul className="list-group list-group-flush bg-dark rounded border border-secondary p-1">
          {factors.map((factor, idx) => (
            <li key={idx} className="list-group-item bg-transparent text-light border-0 py-1 small font-monospace d-flex align-items-center gap-2">
              <AlertTriangle size={13} className="text-warning" />
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Action */}
      <div className="p-2.5 rounded bg-dark border border-secondary mb-3">
        <div className="text-info small fw-bold mb-1">RECOMMENDED OPERATOR ACTION:</div>
        <div className="text-light small font-monospace">{action}</div>
      </div>

      {/* Mandatory Statutory Safety Disclaimer */}
      <div className="p-2 rounded bg-secondary-dark border border-secondary text-muted small" style={{ fontSize: '0.68rem' }}>
        <Info size={12} className="me-1 text-info" />
        <strong>MANDATORY SAFETY PROTOCOL:</strong> AI risk assessment outputs provide decision support for rescue commanders and MUST NOT replace statutory mine safety officer authority or emergency evacuation guidelines.
      </div>
    </div>
  );
}
