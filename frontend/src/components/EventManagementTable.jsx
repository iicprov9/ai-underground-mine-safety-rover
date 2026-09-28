import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Search, Filter, AlertTriangle } from 'lucide-react';

export default function EventManagementTable({ events, onAcknowledgeEvent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const getRiskBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-danger text-white';
      case 'HIGH': return 'bg-warning text-dark';
      case 'MODERATE': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
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
        <div className="control-card-title text-cyan">
          <ShieldAlert size={18} /> HAZARD & EMERGENCY EVENT MANAGEMENT
        </div>

        {/* Search & Filter Controls */}
        <div className="d-flex align-items-center gap-2">
          <div className="input-group input-group-sm" style={{ width: '200px' }}>
            <span className="input-group-text dark-input text-secondary border-secondary"><Search size={14} /></span>
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
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MODERATE">MODERATE</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-dark table-hover align-middle font-monospace small mb-0">
          <thead>
            <tr className="text-secondary border-secondary">
              <th>EVENT ID</th>
              <th>TIMESTAMP</th>
              <th>ROVER</th>
              <th>LOCATION</th>
              <th>EVENT TYPE</th>
              <th>SENSOR SOURCE</th>
              <th>RISK LEVEL</th>
              <th>AI CONF.</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-secondary py-3">
                  No hazard events match criteria.
                </td>
              </tr>
            ) : (
              filteredEvents.map(evt => (
                <tr key={evt.event_id} className="border-secondary">
                  <td className="text-info font-monospace fw-bold">{evt.event_id}</td>
                  <td className="text-secondary">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                  <td className="text-light">{evt.rover_id}</td>
                  <td className="text-warning">{evt.tunnel_id} (X:{evt.loc_x}, Y:{evt.loc_y})</td>
                  <td className="text-light fw-bold">{evt.event_type}</td>
                  <td className="text-secondary" style={{ maxWidth: '180px' }}>{evt.sensor_source}</td>
                  <td>
                    <span className={`badge ${getRiskBadge(evt.risk_level)} px-2 py-1`}>
                      {evt.risk_level}
                    </span>
                  </td>
                  <td className="text-cyan">{evt.ai_confidence}%</td>
                  <td>
                    <span className={evt.acknowledged ? 'text-success' : 'text-danger fw-bold'}>
                      {evt.acknowledged ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED'}
                    </span>
                  </td>
                  <td>
                    {!evt.acknowledged ? (
                      <button
                        className="btn btn-outline-success btn-sm p-1.5 font-monospace min-touch-target"
                        onClick={() => onAcknowledgeEvent(evt.event_id)}
                        aria-label={`Acknowledge event ${evt.event_id}`}
                      >
                        <CheckCircle size={14} className="me-1" /> Acknowledge
                      </button>
                    ) : (
                      <span className="text-secondary small">OK</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (< 768px) */}
      <div className="d-md-none vstack gap-2">
        {filteredEvents.map(evt => (
          <div key={evt.event_id} className="p-3 rounded bg-dark border border-secondary">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-info font-monospace fw-bold">{evt.event_id}</span>
              <span className={`badge ${getRiskBadge(evt.risk_level)}`}>{evt.risk_level}</span>
            </div>
            <div className="text-light fw-bold mb-1">{evt.event_type}</div>
            <div className="text-warning small font-monospace mb-1">{evt.tunnel_id} (X:{evt.loc_x}, Y:{evt.loc_y})</div>
            <div className="text-secondary small mb-2">{evt.sensor_source}</div>
            <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary">
              <span className="text-cyan small font-monospace">CONF: {evt.ai_confidence}%</span>
              {!evt.acknowledged ? (
                <button
                  className="btn btn-success btn-sm text-dark font-monospace fw-bold px-3 py-1.5 min-touch-target"
                  onClick={() => onAcknowledgeEvent(evt.event_id)}
                >
                  <CheckCircle size={14} className="me-1" /> Acknowledge
                </button>
              ) : (
                <span className="text-success small fw-bold font-monospace">ACKNOWLEDGED</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
