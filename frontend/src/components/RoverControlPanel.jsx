import React, { useState, useEffect } from 'react';
import { Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Octagon, Sun, Volume2, ShieldAlert, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function RoverControlPanel({ roverId = 'ROVER-01', isDemoMode }) {
  const { t } = useLanguage();
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
        text: `${t('cmdAck')}: ${t(cmdName.toLowerCase()) || cmdName} @ ${speed}% Speed`
      });
    } catch (err) {
      setLastCommandStatus({
        type: 'danger',
        text: `${t('cmdFail')}: Unable to send ${cmdName}`
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
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <Navigation size={15} className="text-emerald" />
          </div>
          {t('roverController')}
        </div>
        <span className="badge-tactical badge-safe font-monospace small d-flex align-items-center gap-1">
          <Keyboard size={12} /> {t('wasdEnabled')}
        </span>
      </div>

      {isDemoMode && (
        <div className="alert alert-warning py-1.5 px-2.5 mb-2 small font-monospace rounded-3" style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
          {t('simNotice')}
        </div>
      )}

      {lastCommandStatus && (
        <div className={`alert ${lastCommandStatus.type === 'success' ? 'alert-success bg-dark text-success border-success' : 'alert-danger bg-dark text-danger border-danger'} py-1.5 px-2.5 mb-2 small font-monospace d-flex align-items-center gap-1.5 rounded-3`} style={{ fontSize: '0.75rem' }}>
          {lastCommandStatus.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          {lastCommandStatus.text}
        </div>
      )}

      <div className="row align-items-center g-3">
        {/* Directional D-Pad Controls in Codespot Emerald */}
        <div className="col-md-6 text-center">
          <div className="d-inline-block p-2.5 rounded-4 border" style={{ background: '#080c12', borderColor: 'rgba(34, 197, 94, 0.25)' }}>
            {/* Forward Button */}
            <div className="mb-1.5">
              <button
                className={`teleop-btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'FORWARD' ? 'bg-success text-dark' : ''}`}
                onClick={() => handleSendCommand('FORWARD')}
                title="Drive Forward (W / Up Arrow)"
                aria-label="Drive Forward (W or Up Arrow)"
              >
                <ArrowUp size={16} /> {t('forward')}
              </button>
            </div>

            {/* Left - Stop - Right Row */}
            <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1.5">
              <button
                className={`teleop-btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'LEFT' ? 'bg-success text-dark' : ''}`}
                onClick={() => handleSendCommand('LEFT')}
                title="Turn Left (A / Left Arrow)"
                aria-label="Turn Left (A or Left Arrow)"
              >
                <ArrowLeft size={16} /> {t('left')}
              </button>
              <button
                className={`teleop-btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'STOP' ? 'bg-danger text-white' : ''}`}
                onClick={() => handleSendCommand('STOP')}
                title="Halt Rover (Spacebar)"
                aria-label="Halt Rover (Spacebar)"
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
              >
                <Octagon size={16} /> {t('stop')}
              </button>
              <button
                className={`teleop-btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'RIGHT' ? 'bg-success text-dark' : ''}`}
                onClick={() => handleSendCommand('RIGHT')}
                title="Turn Right (D / Right Arrow)"
                aria-label="Turn Right (D or Right Arrow)"
              >
                {t('right')} <ArrowRight size={16} />
              </button>
            </div>

            {/* Reverse Button */}
            <div>
              <button
                className={`teleop-btn font-monospace btn-sm fw-bold px-3 py-2 min-touch-target ${activeKey === 'REVERSE' ? 'bg-success text-dark' : ''}`}
                onClick={() => handleSendCommand('REVERSE')}
                title="Drive Reverse (S / Down Arrow)"
                aria-label="Drive Reverse (S or Down Arrow)"
              >
                <ArrowDown size={16} /> {t('reverse')}
              </button>
            </div>
          </div>
        </div>

        {/* Speed Slider & Preset Controls */}
        <div className="col-md-6">
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between text-secondary small font-monospace mb-1">
              <span>{t('driveSpeed')}:</span>
              <span className="text-emerald fw-bold">{speed}%</span>
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
          <div className="btn-group btn-group-sm w-100 mb-3 font-monospace" style={{ borderRadius: '999px', overflow: 'hidden' }}>
            {[25, 50, 75, 100].map(val => (
              <button
                key={val}
                className={`btn btn-sm ${speed === val ? 'btn-codespot-primary text-dark fw-bold' : 'btn-codespot-secondary text-light'}`}
                onClick={() => setSpeed(val)}
                style={{ borderRadius: '0' }}
              >
                {val}%
              </button>
            ))}
          </div>

          <div className="d-flex flex-wrap gap-2 mb-2.5">
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 font-monospace min-touch-target rounded-pill ${headlight ? 'btn-codespot-primary text-dark' : 'btn-codespot-secondary'}`}
              onClick={() => { setHeadlight(!headlight); handleSendCommand(headlight ? 'HEADLIGHT_OFF' : 'HEADLIGHT_ON'); }}
              aria-label="Toggle Headlight"
            >
              <Sun size={14} /> {t('headlight')} {headlight ? 'ON' : 'OFF'}
            </button>

            <button
              className={`btn btn-sm d-flex align-items-center gap-1 font-monospace min-touch-target rounded-pill ${buzzer ? 'btn-danger text-white' : 'btn-codespot-secondary'}`}
              onClick={() => { setBuzzer(!buzzer); handleSendCommand(buzzer ? 'BUZZER_OFF' : 'BUZZER_ON'); }}
              aria-label="Toggle Acoustic Buzzer"
            >
              <Volume2 size={14} /> {t('buzzer')} {buzzer ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Emergency Stop Button */}
          <button
            className="btn btn-danger text-white fw-bold w-100 btn-sm font-monospace d-flex align-items-center justify-content-center gap-2 shadow min-touch-target rounded-pill"
            onClick={() => handleSendCommand('EMERGENCY_STOP')}
            aria-label="Mandatory Emergency Hard Stop"
            style={{ boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)', padding: '9px 16px' }}
          >
            <ShieldAlert size={16} /> {t('emergencyStop')}
          </button>
        </div>
      </div>
    </div>
  );
}
