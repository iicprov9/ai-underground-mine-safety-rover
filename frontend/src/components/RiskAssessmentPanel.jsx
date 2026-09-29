import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Shield, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function RiskAssessmentPanel({ aiRisk }) {
  const { t } = useLanguage();
  const riskLevel = aiRisk?.risk_level || 'NORMAL';
  const confidence = aiRisk?.confidence || 85.0;
  const factors = aiRisk?.contributing_factors || ['Environmental telemetry within normal mine limits'];
  const action = aiRisk?.recommended_action || 'Maintain automated reconnaissance path. Monitor environmental telemetry.';

  const getRiskBg = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-danger text-white border-danger';
      case 'HIGH': return 'bg-warning text-dark border-warning';
      case 'MODERATE': return 'bg-info text-dark border-info';
      case 'LOW': return 'bg-success text-white';
      default: return 'bg-success text-white';
    }
  };

  return (
    <div className="control-card p-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <ShieldAlert size={15} className="text-emerald" />
          </div>
          {t('riskAssessmentTitle')}
        </div>
        <span className="text-emerald font-monospace small">
          Confidence: {confidence}%
        </span>
      </div>

      {/* Main Risk Level Badge Header */}
      <div className={`p-3 rounded-4 mb-3 text-center fw-bold font-monospace border ${getRiskBg(riskLevel)}`}>
        <div className="fs-5 tracking-wider">{t('risk')}: {t(riskLevel.toLowerCase()) || riskLevel}</div>
        <div className="small font-monospace opacity-90 fw-normal">
          Safety Protocol Evaluation Active
        </div>
      </div>

      {/* Triggered Safety Rules & Factors */}
      <div className="mb-3">
        <label className="text-secondary small fw-bold mb-1.5 font-monospace">Contributing Hazard Factors:</label>
        <ul className="list-group list-group-flush rounded-3 border border-secondary border-opacity-25 p-1" style={{ background: '#080c12' }}>
          {factors.map((factor, idx) => (
            <li key={idx} className="list-group-item bg-transparent text-light border-0 py-1 small font-monospace d-flex align-items-center gap-2">
              <AlertTriangle size={13} className="text-emerald" />
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Action */}
      <div className="p-2.5 rounded-3 border border-secondary border-opacity-25 mb-3" style={{ background: '#080c12' }}>
        <div className="text-emerald small fw-bold mb-1 font-monospace">RECOMMENDED OPERATOR ACTION:</div>
        <div className="text-light small font-monospace">{action}</div>
      </div>

      {/* Mandatory Statutory Safety Disclaimer */}
      <div className="p-2 rounded-3 border border-secondary border-opacity-25 text-muted small font-monospace" style={{ fontSize: '0.68rem', background: '#05070a' }}>
        <Info size={12} className="me-1 text-emerald" />
        <strong>MANDATORY PROTOCOL:</strong> {t('statutoryDisclaimer')}
      </div>
    </div>
  );
}
