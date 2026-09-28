import React, { useState, useEffect } from 'react';
import { Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Octagon, Sun, Volume2, ShieldAlert, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';
import { api } from '../services/api';

export default function RoverControlPanel({ roverId = 'ROVER-01', isDemoMode }) {
  const [speed, setSpeed] = useState(50);
  const [headlight, setHeadlight] = useState(true);
  const [buzzer, setBuzzer] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [lastCommandStatus, setLastCommandStatus] = useState(null);

  const handleSendCommand = async (cmdName) => {
    setActiveKey(cmdName);
    setTimeout(() => setActiveKey(null), 300);
    try {
      await api.sendRoverControl({
        rover_id: roverId,
        command: cmdName,
        speed: speed
      });
      setLastCommandStatus({
        type: 'success',
        text: `COMMAND ACKNOWLEDGED: ${cmdName} @ ${speed}% Speed`
      });
    } catch (err) {
      setLastCommandStatus({
        type: 'danger',
        text: `COMMAND FAILED: Unable to send ${cmdName}`
      });
    }
  };

  // Keyboard Event Listener for WASD / Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        handleSendCommand('FORWARD');
      } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        handleSendCommand('LEFT');
      } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        handleSendCommand('REVERSE');
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        handleSendCommand('RIGHT');
      } else if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        handleSendCommand('STOP');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speed, roverId]);

  return (
    <div className="control-card p-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="control-card-title text-cyan">
          <Navigation size={18} /> REMOTE ROVER COMMAND CONTROLLER
        </div>
        <span className="badge bg-dark border border-secondary text-info font-monospace small d-flex align-items-center gap-1">
          <Keyboard size={12} /> WASD / ARROWS ENABLED
        </span>
      </div>

      {isDemoMode && (
        <div className="alert alert-warning py-1 px-2 mb-2 small font-monospace" style={{ fontSize: '0.75rem' }}>
          SIMULATION MODE: WASD keys update simulated tunnel location coordinates.
        </div>
      )}

      {lastCommandStatus && (
        <div className={`alert ${lastCommandStatus.type === 'success' ? 'alert-success bg-dark text-success border-success' : 'alert-danger bg-dark text-danger border-danger'} py-1 px-2 mb-2 small font-monospace d-flex align-items-center gap-1`} style={{ fontSize: '0.75rem' }}>
          {lastCommandStatus.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {lastCommandStatus.text}
        </div>
      )}

      <div className="row align-items-center g-3">
        {/* Directional D-Pad Controls */}
        <div className="col-md-6 text-center">
          <div className="d-inline-block p-2 rounded bg-dark border border-secondary">
            {/* Forward Button */}
            <div className="mb-1">
              <button
                className={`btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'FORWARD' ? 'btn-cyan text-dark' : 'btn-outline-info'}`}
                onClick={() => handleSendCommand('FORWARD')}
                title="Drive Forward (W / Up Arrow)"
                aria-label="Drive Forward (W or Up Arrow)"
              >
                <ArrowUp size={16} /> FORWARD
              </button>
            </div>

            {/* Left - Stop - Right Row */}
            <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
              <button
                className={`btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'LEFT' ? 'btn-cyan text-dark' : 'btn-outline-info'}`}
                onClick={() => handleSendCommand('LEFT')}
                title="Turn Left (A / Left Arrow)"
                aria-label="Turn Left (A or Left Arrow)"
              >
                <ArrowLeft size={16} /> LEFT
              </button>
              <button
                className={`btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'STOP' ? 'btn-danger text-white' : 'btn-outline-warning'}`}
                onClick={() => handleSendCommand('STOP')}
                title="Halt Rover (Spacebar)"
                aria-label="Halt Rover (Spacebar)"
              >
                <Octagon size={16} /> STOP
              </button>
              <button
                className={`btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'RIGHT' ? 'btn-cyan text-dark' : 'btn-outline-info'}`}
                onClick={() => handleSendCommand('RIGHT')}
                title="Turn Right (D / Right Arrow)"
                aria-label="Turn Right (D or Right Arrow)"
              >
                RIGHT <ArrowRight size={16} />
              </button>
            </div>

            {/* Reverse Button */}
            <div>
              <button
                className={`btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'REVERSE' ? 'btn-cyan text-dark' : 'btn-outline-info'}`}
                onClick={() => handleSendCommand('REVERSE')}
                title="Drive Reverse (S / Down Arrow)"
                aria-label="Drive Reverse (S or Down Arrow)"
              >
                <ArrowDown size={16} /> REVERSE
              </button>
            </div>
          </div>
        </div>

        {/* Speed Slider & Preset Controls */}
        <div className="col-md-6">
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between text-secondary small font-monospace mb-1">
              <span>Drive Speed Slider:</span>
              <span className="text-cyan fw-bold">{speed}%</span>
            </div>
            <input
              type="range"
              className="form-range"
              min="10"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              aria-label="Drive Speed Slider"
            />
          </div>

          {/* Speed Presets */}
          <div className="btn-group btn-group-sm w-100 mb-3 font-monospace">
            {[25, 50, 75, 100].map(val => (
              <button
                key={val}
                className={`btn btn-sm ${speed === val ? 'btn-info text-dark fw-bold' : 'btn-dark border-secondary text-light'}`}
                onClick={() => setSpeed(val)}
              >
                {val}%
              </button>
            ))}
          </div>

          <div className="d-flex flex-wrap gap-2 mb-2">
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 font-monospace min-touch-target ${headlight ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
              onClick={() => { setHeadlight(!headlight); handleSendCommand(headlight ? 'HEADLIGHT_OFF' : 'HEADLIGHT_ON'); }}
              aria-label="Toggle Headlight"
            >
              <Sun size={14} /> Headlight {headlight ? 'ON' : 'OFF'}
            </button>

            <button
              className={`btn btn-sm d-flex align-items-center gap-1 font-monospace min-touch-target ${buzzer ? 'btn-info text-dark' : 'btn-outline-secondary'}`}
              onClick={() => { setBuzzer(!buzzer); handleSendCommand(buzzer ? 'BUZZER_OFF' : 'BUZZER_ON'); }}
              aria-label="Toggle Acoustic Buzzer"
            >
              <Volume2 size={14} /> Buzzer {buzzer ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Emergency Stop Button */}
          <button
            className="btn btn-danger text-white fw-bold w-100 btn-sm font-monospace d-flex align-items-center justify-content-center gap-2 shadow-sm min-touch-target"
            onClick={() => handleSendCommand('EMERGENCY_STOP')}
            aria-label="Mandatory Emergency Hard Stop"
          >
            <ShieldAlert size={16} /> EMERGENCY HARD STOP
          </button>
        </div>
      </div>
    </div>
  );
}
