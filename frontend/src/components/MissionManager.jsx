import React, { useState } from 'react';
import { Play, Pause, Square, Clock, Flag, CheckCircle } from 'lucide-react';

export default function MissionManager({ mission, onMissionUpdate }) {
  const [status, setStatus] = useState(mission?.status || 'ACTIVE');
  const [missionName, setMissionName] = useState(mission?.name || 'Emergency Reconnaissance - Tunnel A');

  const handleToggleStatus = (newStatus) => {
    setStatus(newStatus);
    if (onMissionUpdate) {
      onMissionUpdate({ ...mission, status: newStatus, name: missionName });
    }
  };

  return (
    <div className="control-card p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <Flag size={15} className="text-emerald" />
          </div>
          EMERGENCY RECONNAISSANCE MISSION CONTROLLER
        </div>
        <span className={`badge-tactical ${status === 'ACTIVE' ? 'badge-safe' : (status === 'PAUSED' ? 'badge-warning' : 'badge-safe')}`}>
          {status}
        </span>
      </div>

      <div className="row align-items-center g-3">
        <div className="col-md-6">
          <label className="form-label text-secondary small fw-semibold mb-1">Active Mission Name</label>
          <input
            type="text"
            className="form-control dark-input font-monospace text-emerald"
            value={missionName}
            onChange={(e) => setMissionName(e.target.value)}
          />
        </div>

        <div className="col-md-6 d-flex align-items-end gap-2">
          <button
            className={`btn btn-sm font-monospace fw-bold d-flex align-items-center gap-1.5 rounded-pill ${status === 'ACTIVE' ? 'btn-codespot-primary text-dark' : 'btn-codespot-secondary'}`}
            onClick={() => handleToggleStatus('ACTIVE')}
          >
            <Play size={14} /> Start Mission
          </button>
          <button
            className={`btn btn-sm font-monospace fw-bold d-flex align-items-center gap-1.5 rounded-pill ${status === 'PAUSED' ? 'btn-warning text-dark' : 'btn-codespot-secondary'}`}
            onClick={() => handleToggleStatus('PAUSED')}
          >
            <Pause size={14} /> Pause Mission
          </button>
          <button
            className={`btn btn-sm font-monospace fw-bold d-flex align-items-center gap-1.5 rounded-pill ${status === 'COMPLETED' ? 'btn-danger text-white' : 'btn-codespot-secondary'}`}
            onClick={() => handleToggleStatus('COMPLETED')}
          >
            <Square size={14} /> Complete Mission
          </button>
        </div>
      </div>
    </div>
  );
}
