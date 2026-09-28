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
        <div className="control-card-title text-cyan">
          <Flag size={18} /> EMERGENCY RECONNAISSANCE MISSION CONTROLLER
        </div>
        <span className={`badge ${status === 'ACTIVE' ? 'bg-success text-white' : (status === 'PAUSED' ? 'bg-warning text-dark' : 'bg-secondary text-white')} font-monospace`}>
          {status}
        </span>
      </div>

      <div className="row align-items-center g-3">
        <div className="col-md-6">
          <label className="form-label text-secondary small fw-bold mb-1">Active Mission Name</label>
          <input
            type="text"
            className="form-control dark-input font-monospace"
            value={missionName}
            onChange={(e) => setMissionName(e.target.value)}
          />
        </div>

        <div className="col-md-6 d-flex align-items-end gap-2">
          <button
            className={`btn btn-sm font-monospace fw-bold d-flex align-items-center gap-1 ${status === 'ACTIVE' ? 'btn-outline-success active' : 'btn-success text-dark'}`}
            onClick={() => handleToggleStatus('ACTIVE')}
          >
            <Play size={14} /> Start Mission
          </button>
          <button
            className={`btn btn-sm font-monospace fw-bold d-flex align-items-center gap-1 ${status === 'PAUSED' ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
            onClick={() => handleToggleStatus('PAUSED')}
          >
            <Pause size={14} /> Pause Mission
          </button>
          <button
            className={`btn btn-sm font-monospace fw-bold d-flex align-items-center gap-1 ${status === 'COMPLETED' ? 'btn-danger text-white' : 'btn-outline-danger'}`}
            onClick={() => handleToggleStatus('COMPLETED')}
          >
            <Square size={14} /> Complete Mission
          </button>
        </div>
      </div>
    </div>
  );
}
