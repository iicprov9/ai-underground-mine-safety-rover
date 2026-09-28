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
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content dark-modal border-info">
          <div className="modal-header dark-modal-header border-bottom border-secondary">
            <h5 className="modal-title text-cyan d-flex align-items-center gap-2">
              <Terminal size={20} /> Live ESP32 Telemetry Data Read API Monitor
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-bold">HTTP Method</label>
                <select className="form-select dark-input font-monospace" value={httpMethod} onChange={(e) => setHttpMethod(e.target.value)}>
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
                  className="btn btn-cyan btn-sm fw-bold d-flex align-items-center gap-1 text-dark"
                  onClick={handleReadNow}
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
                  READ NOW
                </button>

                <button
                  className={`btn btn-sm d-flex align-items-center gap-1 font-monospace ${streaming ? 'btn-danger' : 'btn-outline-success'}`}
                  onClick={handleToggleStream}
                >
                  {streaming ? <Square size={14} /> : <Play size={14} />}
                  {streaming ? 'STOP STREAM' : 'START LIVE STREAM'}
                </button>

                <button
                  className="btn btn-outline-secondary text-light btn-sm font-monospace"
                  onClick={handleReadNow}
                >
                  TEST API
                </button>
              </div>
            </div>

            {/* Response Metadata Bar */}
            <div className="d-flex align-items-center justify-content-between p-2 rounded bg-dark border border-secondary mb-3 font-monospace small">
              <div className="d-flex align-items-center gap-3">
                <span>STATUS: <span className="text-success fw-bold">{lastStatusCode} OK</span></span>
                <span>LATENCY: <span className="text-info">{lastLatency}ms</span></span>
                <span>STREAM: <span className={streaming ? 'text-success fw-bold' : 'text-secondary'}>{streaming ? 'ACTIVE (2s interval)' : 'IDLE'}</span></span>
              </div>
              <div className="text-secondary">Content-Type: application/json</div>
            </div>

            {/* Viewer Tabs */}
            <ul className="nav nav-tabs border-secondary mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link text-light bg-transparent ${activeTab === 'raw' ? 'active border-info text-info fw-bold' : ''}`}
                  onClick={() => setActiveTab('raw')}
                >
                  <Code size={14} className="me-1" /> Raw JSON Response
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-light bg-transparent ${activeTab === 'processed' ? 'active border-info text-info fw-bold' : ''}`}
                  onClick={() => setActiveTab('processed')}
                >
                  <Database size={14} className="me-1" /> Processed Telemetry Model
                </button>
              </li>
            </ul>

            {/* JSON Content Display */}
            <div className="json-viewer">
              <pre className="m-0">
                {JSON.stringify(
                  activeTab === 'raw' 
                    ? (fetchedData || telemetryData || { message: "Press READ NOW to fetch latest ESP32 packet" })
                    : (fetchedData?.ai_risk || fetchedData || telemetryData), 
                  null, 
                  2
                )}
              </pre>
            </div>
          </div>

          <div className="modal-footer dark-modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close Monitor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
