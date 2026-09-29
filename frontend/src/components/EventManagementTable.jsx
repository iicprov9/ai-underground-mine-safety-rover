import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Search, Filter, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function EventManagementTable({ events, onAcknowledgeEvent }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const getRiskBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-warning';
      case 'MODERATE': return 'badge-safe';
      default: return 'badge-tactical bg-dark text-secondary';
    }
  };

  const filteredEvents = (events || []).filter(evt => {
    const matchesSearch = evt.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.tunnel_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.event_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || evt.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="control-card p-3">
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <ShieldAlert size={15} className="text-emerald" />
          </div>
          {t('eventLogTitle')}
        </div>

        {/* Search & Filter Controls */}
        <div className="d-flex align-items-center gap-2">
          <div className="input-group input-group-sm" style={{ width: '210px' }}>
            <span className="input-group-text dark-input text-secondary border-secondary border-opacity-25"><Search size={14} /></span>
            <input
              type="text"
              className="form-control dark-input font-monospace"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search hazard events"
            />
          </div>

          <select
            className="form-select form-select-sm dark-input font-monospace"
            style={{ width: '140px' }}
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            aria-label="Filter events by risk level"
          >
            <option value="ALL">{t('filterAll')}</option>
            <option value="CRITICAL">{t('filterCritical')}</option>
            <option value="HIGH">{t('filterHigh')}</option>
            <option value="MODERATE">MODERATE</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-dark table-hover align-middle font-monospace small mb-0" style={{ background: '#080c12' }}>
          <thead>
            <tr className="text-secondary border-secondary border-opacity-25">
              <th>EVENT ID</th>
              <th>{t('timestamp')}</th>
              <th>ROVER</th>
              <th>{t('location')}</th>
              <th>{t('eventType')}</th>
              <th>{t('sensors')}</th>
              <th>{t('severity')}</th>
              <th>AI CONF.</th>
              <th>STATUS</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-secondary py-4">
                  No hazard events match criteria.
                </td>
              </tr>
            ) : (
              filteredEvents.map(evt => (
                <tr key={evt.event_id} className="border-secondary border-opacity-25">
                  <td className="text-emerald font-monospace fw-bold">{evt.event_id}</td>
                  <td className="text-secondary">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                  <td className="text-light">{evt.rover_id}</td>
                  <td className="text-white">{evt.tunnel_id} (X:{evt.loc_x}, Y:{evt.loc_y})</td>
                  <td className="text-light fw-bold">{evt.event_type}</td>
                  <td className="text-secondary" style={{ maxWidth: '180px' }}>{evt.sensor_source}</td>
                  <td>
                    <span className={`badge-tactical ${getRiskBadge(evt.risk_level)} px-2.5 py-1`}>
                      {t(evt.risk_level.toLowerCase()) || evt.risk_level}
                    </span>
                  </td>
                  <td className="text-emerald font-monospace">{evt.ai_confidence ? `${evt.ai_confidence}%` : '88%'}</td>
                  <td>
                    {evt.acknowledged ? (
                      <span className="badge-tactical badge-safe d-inline-flex align-items-center gap-1">
                        <CheckCircle size={12} /> ACK
                      </span>
                    ) : (
                      <span className="badge-tactical badge-critical d-inline-flex align-items-center gap-1">
                        <AlertTriangle size={12} /> UNACK
                      </span>
                    )}
                  </td>
                  <td>
                    {!evt.acknowledged && (
                      <button
                        className="btn btn-codespot-primary btn-sm py-1 px-2.5 font-monospace"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => onAcknowledgeEvent(evt.event_id)}
                      >
                        ACK
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card Event List */}
      <div className="vstack gap-2 d-md-none">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-secondary py-3 small font-monospace">
            No hazard events match criteria.
          </div>
        ) : (
          filteredEvents.map(evt => (
            <div key={evt.event_id} className="p-2.5 rounded-3 border border-secondary border-opacity-25" style={{ background: '#080c12' }}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="text-emerald font-monospace fw-bold small">{evt.event_id}</span>
                <span className={`badge-tactical ${getRiskBadge(evt.risk_level)} small`}>
                  {t(evt.risk_level.toLowerCase()) || evt.risk_level}
                </span>
              </div>
              <div className="text-light small fw-bold mb-1">{evt.event_type}</div>
              <div className="d-flex align-items-center justify-content-between text-secondary small font-monospace">
                <span>{evt.tunnel_id} (X:{evt.loc_x}, Y:{evt.loc_y})</span>
                <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
              </div>
              {!evt.acknowledged && (
                <div className="mt-2 text-end">
                  <button
                    className="btn btn-codespot-primary btn-sm py-1 px-3 font-monospace"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => onAcknowledgeEvent(evt.event_id)}
                  >
                    Acknowledge Event
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
