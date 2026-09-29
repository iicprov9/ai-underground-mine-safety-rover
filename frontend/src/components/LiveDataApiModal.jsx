import React, { useState } from 'react';
import { Terminal, Play, Square, RefreshCw, Code, Database, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function LiveDataApiModal({ show, onClose, telemetryData }) {
  const [activeTab, setActiveTab] = useState('raw'); // 'raw' or 'processed'
  const [fetchedData, setFetchedData] = useState(telemetryData || null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000/api/rover/ROVER-01/data');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [channelId, setChannelId] = useState('CH-7742');
  const [authToken, setAuthToken] = useState('Bearer mine_rescue_token_8849');
  const [lastStatusCode, setLastStatusCode] = useState(200);
  const [lastLatency, setLastLatency] = useState(18);

  if (!show) return null;

  const handleReadNow = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await api.getRoverData('ROVER-01');
      const end = performance.now();
      setFetchedData(res.data);
      setLastStatusCode(res.status);
      setLastLatency(Math.round(end - start));
    } catch (err) {
      setFetchedData({ error: 'Failed to fetch API endpoint', message: err.message });
      setLastStatusCode(500);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStream = () => {
    setStreaming(!streaming);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content dark-modal border-emerald">
          <div className="modal-header dark-modal-header border-bottom border-secondary border-opacity-25">
            <h5 className="modal-title text-white d-flex align-items-center gap-2 brand-font">
              <div className="icon-box-emerald" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                <Terminal size={18} className="text-emerald" />
              </div>
              Live ESP32 Telemetry Data Read API Monitor
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-bold">HTTP Method</label>
                <select className="form-select dark-input font-monospace text-emerald" value={httpMethod} onChange={(e) => setHttpMethod(e.target.value)}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold">Target API Endpoint URL</label>
                <input
                  type="text"
                  className="form-control dark-input font-monospace"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-secondary small fw-bold">Channel ID</label>
                <input
                  type="text"
                  className="form-control dark-input font-monospace"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold">Auth Token Header</label>
                <input
                  type="text"
                  className="form-control dark-input font-monospace"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                />
              </div>

              <div className="col-md-6 d-flex align-items-end gap-2">
                <button
                  className="btn btn-codespot-primary btn-sm fw-bold d-flex align-items-center gap-1.5 text-dark"
                  onClick={handleReadNow}
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
                  READ NOW
                </button>

                <button
                  className={`btn btn-sm font-monospace d-flex align-items-center gap-1.5 ${streaming ? 'btn-danger' : 'btn-codespot-secondary'}`}
                  onClick={handleToggleStream}
                >
                  {streaming ? <Square size={14} /> : <RefreshCw size={14} />}
                  {streaming ? 'STOP POLLING' : 'START 3s AUTO POLLING'}
                </button>
              </div>
            </div>

            {/* Status & Latency Pills */}
            <div className="d-flex align-items-center gap-3 mb-3 p-2.5 rounded-3 border border-secondary border-opacity-25" style={{ background: '#080c12' }}>
              <div className="d-flex align-items-center gap-1.5 font-monospace small">
                <span className="text-secondary">HTTP Status:</span>
                <span className={`badge-tactical ${lastStatusCode === 200 ? 'badge-safe' : 'badge-critical'}`}>
                  {lastStatusCode} OK
                </span>
              </div>
              <div className="d-flex align-items-center gap-1.5 font-monospace small">
                <span className="text-secondary">Latency:</span>
                <span className="text-emerald fw-bold">{lastLatency} ms</span>
              </div>
            </div>

            {/* JSON Output Viewer */}
            <div className="json-viewer">
              <pre className="mb-0 text-emerald">
                {fetchedData ? JSON.stringify(fetchedData, null, 2) : '// Click READ NOW to fetch live telemetry stream'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
