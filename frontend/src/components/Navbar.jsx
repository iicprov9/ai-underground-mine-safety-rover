import React from 'react';
import { Activity, ShieldAlert, Cpu, Radio, Terminal, Settings, PlayCircle, Eye, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { lang, changeLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  const getRiskBadgeClass = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-danger text-white border-danger shadow-sm';
      case 'HIGH': return 'bg-warning text-dark border-warning';
      case 'MODERATE': return 'bg-info text-dark border-info';
      case 'LOW': return 'bg-success text-white';
      default: return 'bg-success text-white';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-control sticky-top">
      <div className="container-fluid px-3">
        {/* Brand in Codespot Emerald & Pitch Black */}
        <a className="navbar-brand d-flex align-items-center gap-2.5 fw-bold text-decoration-none" href="#" onClick={() => setActiveTab('home')}>
          <div className="icon-box-emerald">
            <Cpu className="text-emerald" size={22} />
          </div>
          <div>
            <div className="lh-1 fs-5 text-white fw-bold brand-font" style={{ letterSpacing: '-0.02em' }}>{t('appName')}</div>
            <small className="text-muted font-monospace" style={{ fontSize: '0.7rem', color: '#4ade80' }}>{t('appSubtitle')}</small>
          </div>
        </a>

        {/* Navigation Tabs */}
        <div className="d-flex align-items-center gap-1 mx-3">
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Eye size={16} /> {t('homeTab')}
          </button>
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={16} /> {t('dashboardTab')}
          </button>
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Radio size={16} /> {t('archTab')}
          </button>
          <button
            className={`nav-link-custom border-0 bg-transparent ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Terminal size={16} /> {t('historyTab')}
          </button>
        </div>

        {/* Real-time Status Badges & Quick Controls */}
        <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
          {/* Language Selector Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-codespot-secondary font-monospace d-flex align-items-center gap-1.5 dropdown-toggle px-3 py-1.5"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: '0.8rem', borderRadius: '9999px' }}
            >
              <Globe size={14} className="text-emerald" />
              <span>{languages.find(l => l.code === lang)?.flag} {languages.find(l => l.code === lang)?.label}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border border-secondary" style={{ background: '#0c1017', minWidth: '150px', borderRadius: '12px' }} aria-labelledby="languageDropdown">
              {languages.map((l) => (
                <li key={l.code}>
                  <button
                    className={`dropdown-item d-flex align-items-center justify-content-between small py-2 px-3 ${lang === l.code ? 'active bg-success text-white' : 'text-light'}`}
                    onClick={() => changeLanguage(l.code)}
                    style={{ borderRadius: '8px' }}
                  >
                    <span>{l.flag} {l.label}</span>
                    {lang === l.code && <span className="badge bg-dark text-white ms-2">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Backend Status */}
          <div className="d-none d-xl-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill border" style={{ fontSize: '0.78rem', background: '#080c12', borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className={`status-indicator ${backendConnected ? 'online' : 'offline'}`}></span>
            <span className="text-muted">{t('apiStatus')}:</span>
            <span className={backendConnected ? 'text-emerald fw-bold' : 'text-danger fw-bold'}>
              {backendConnected ? t('online') : t('offline')}
            </span>
          </div>

          {/* Rover Status Indicator */}
          <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border" style={{ fontSize: '0.78rem', background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
            <span className={`status-indicator ${roverStatus.includes('CONNECTED') ? 'online' : 'offline'}`}></span>
            <span className="text-muted font-monospace">ROVER-01:</span>
            <span className={`fw-bold font-monospace ${roverStatus.includes('CONNECTED') ? 'text-emerald' : 'text-warning'}`}>
              {roverStatus}
            </span>
          </div>

          {/* Risk Level Indicator */}
          <div className="d-flex align-items-center gap-2">
            <span className={`badge ${getRiskBadgeClass(riskLevel)} px-3 py-1.5 font-monospace rounded-pill`} style={{ fontSize: '0.78rem' }}>
              <ShieldAlert size={13} className="me-1" />
              {t(riskLevel.toLowerCase()) || riskLevel}
            </span>
          </div>

          {/* Mode Switch (Simulation / Real ESP32) */}
          <button
            className={`btn btn-sm d-flex align-items-center gap-1 font-monospace ${isDemoMode ? 'btn-outline-warning' : 'btn-codespot-secondary'}`}
            onClick={onToggleDemoMode}
            title="Switch between Real ESP32 and Demo Simulation Mode"
            style={{ fontSize: '0.78rem', borderRadius: '9999px', padding: '6px 14px' }}
          >
            <PlayCircle size={14} />
            {isDemoMode ? t('demoSimulation') : t('realEsp32')}
          </button>

          {/* Live API Dialog Trigger */}
          <button
            className="btn btn-sm btn-codespot-secondary d-flex align-items-center gap-1"
            onClick={onOpenApiModal}
            style={{ fontSize: '0.78rem', borderRadius: '9999px', padding: '6px 14px' }}
            title="Inspect Live Data Read API"
          >
            <Terminal size={14} className="text-emerald" />
            <span className="d-none d-md-inline">{t('liveApi')}</span>
          </button>

          {/* Connect Rover Configuration Trigger */}
          <button
            className="btn btn-sm btn-codespot-primary text-dark fw-bold d-flex align-items-center gap-1.5 shadow-sm"
            onClick={onOpenConnectModal}
            style={{ fontSize: '0.8rem', padding: '8px 18px' }}
          >
            <Settings size={14} />
            {t('connectRover')}
          </button>
        </div>
      </div>
    </nav>
  );
}
