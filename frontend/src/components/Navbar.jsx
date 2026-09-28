import React from 'react';
import { Activity, ShieldAlert, Cpu, Radio, Terminal, Settings, PlayCircle, Eye } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  roverStatus,
  backendConnected,
  riskLevel,
  isDemoMode,
  onToggleDemoMode,
  onOpenConnectModal,
  onOpenApiModal,
  lastPacketTime
}) {
  const getRiskBadgeClass = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-danger text-white border-danger shadow-sm';
      case 'HIGH': return 'bg-warning text-dark border-warning';
      case 'MODERATE': return 'bg-info text-dark border-info';
      case 'LOW': return 'bg-primary text-white';
      default: return 'bg-success text-white';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-control sticky-top">
      <div className="container-fluid px-3">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2 fw-bold text-cyan" href="#" onClick={() => setActiveTab('home')}>
          <div className="bg-gradient p-2 rounded text-cyan border border-cyan" style={{ background: '#122035' }}>
            <Cpu className="text-info" size={22} />
          </div>
          <div>
            <div className="lh-1 fs-6 text-white text-uppercase tracking-wider">MINE RESCUE AI</div>
            <small className="text-secondary font-monospace fs-7" style={{ fontSize: '0.68rem' }}>COMMAND & CONTROL SYSTEM</small>
          </div>
        </a>

        {/* Navigation Tabs */}
        <div className="d-flex align-items-center gap-1 mx-3">
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Eye size={16} /> Home Overview
          </button>
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={16} /> Rescue Dashboard
          </button>
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Radio size={16} /> System Architecture
          </button>
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Terminal size={16} /> Telemetry History
          </button>
        </div>

        {/* Real-time Status Badges & Quick Controls */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Backend Status */}
          <div className="d-none d-xl-flex align-items-center gap-1 px-2 py-1 rounded bg-dark border border-secondary" style={{ fontSize: '0.75rem' }}>
            <span className={`status-indicator ${backendConnected ? 'online' : 'offline'}`}></span>
            <span className="text-secondary">API:</span>
            <span className={backendConnected ? 'text-success fw-bold' : 'text-danger fw-bold'}>
              {backendConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {/* Rover Status Indicator */}
          <div className="d-flex align-items-center gap-2 px-2.5 py-1 rounded bg-secondary-dark border border-secondary" style={{ fontSize: '0.78rem' }}>
            <span className={`status-indicator ${roverStatus === 'CONNECTED' ? 'online' : 'offline'}`}></span>
            <span className="text-secondary font-monospace">ROVER-01:</span>
            <span className={`fw-bold font-monospace ${roverStatus === 'CONNECTED' ? 'text-success' : 'text-warning'}`}>
              {roverStatus}
            </span>
          </div>

          {/* Risk Level Indicator */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small d-none d-lg-inline">RISK:</span>
            <span className={`badge ${getRiskBadgeClass(riskLevel)} px-2.5 py-1 font-monospace`} style={{ fontSize: '0.78rem' }}>
              <ShieldAlert size={13} className="me-1" />
              {riskLevel}
            </span>
          </div>

          {/* Mode Switch (Simulation / Real ESP32) */}
          <button
            className={`btn btn-sm d-flex align-items-center gap-1 font-monospace ${isDemoMode ? 'btn-outline-warning' : 'btn-outline-info'}`}
            onClick={onToggleDemoMode}
            title="Switch between Real ESP32 and Demo Simulation Mode"
            style={{ fontSize: '0.75rem' }}
          >
            <PlayCircle size={14} />
            {isDemoMode ? 'DEMO SIMULATION' : 'REAL ESP32'}
          </button>

          {/* Live API Dialog Trigger */}
          <button
            className="btn btn-sm btn-outline-secondary text-light d-flex align-items-center gap-1"
            onClick={onOpenApiModal}
            style={{ fontSize: '0.75rem' }}
            title="Inspect Live Data Read API"
          >
            <Terminal size={14} />
            <span className="d-none d-md-inline">Live API</span>
          </button>

          {/* Connect Rover Configuration Trigger */}
          <button
            className="btn btn-sm btn-info text-dark fw-bold d-flex align-items-center gap-1 shadow-sm"
            onClick={onOpenConnectModal}
            style={{ fontSize: '0.78rem' }}
          >
            <Settings size={14} />
            Connect Rover
          </button>
        </div>
      </div>
    </nav>
  );
}
