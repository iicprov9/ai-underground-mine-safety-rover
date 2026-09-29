import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ConnectRoverModal from './components/ConnectRoverModal';
import LiveDataApiModal from './components/LiveDataApiModal';
import HomeOverviewPage from './pages/HomeOverviewPage';
import RescueDashboardPage from './pages/RescueDashboardPage';
import SystemArchitecturePage from './pages/SystemArchitecturePage';
import HistoricalDataPage from './pages/HistoricalDataPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [roverStatus, setRoverStatus] = useState('CONNECTED');
  const [backendConnected, setBackendConnected] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [mission, setMission] = useState({
    name: 'Emergency Reconnaissance - Tunnel A',
    status: 'ACTIVE'
  });
  const [activeAlert, setActiveAlert] = useState(null);
  const [currentConfig, setCurrentConfig] = useState({
    rover_id: 'ROVER-01',
    comm_mode: 'ThingSpeak IoT',
    thingspeak_channel_id: '2481092',
    thingspeak_read_api_key: '',
    refresh_interval: 3,
    is_demo_mode: false
  });

  const wsRef = useRef(null);

  // 1. Initial & Recurring Telemetry & Event Fetch
  const fetchTelemetry = async () => {
    try {
      if (currentConfig.comm_mode === 'ThingSpeak IoT' && currentConfig.thingspeak_channel_id) {
        // Fetch direct from ThingSpeak IoT Channel
        const tsData = await api.fetchThingSpeakData(currentConfig.thingspeak_channel_id, currentConfig.thingspeak_read_api_key);
        setTelemetry(tsData);
        setHistory(prev => [...prev.slice(-30), tsData]);
        setRoverStatus('CONNECTED (ThingSpeak)');
        setBackendConnected(true);
      } else {
        // Fetch from FastAPI Backend
        const res = await api.getRoverData(currentConfig.rover_id || 'ROVER-01');
        setTelemetry(res.data);
        setHistory(prev => [...prev.slice(-30), res.data]);
        setBackendConnected(true);

        if (res.data?.ai_risk?.risk_level === 'CRITICAL' && !activeAlert) {
          setActiveAlert({
            rover_id: res.data.rover_id || 'ROVER-01',
            event_type: 'Multimodal AI Hazard Alert: Critical Methane / Thermal Anomaly Detected',
            location: res.data.location,
            sensor_source: 'Sensory Gas + Thermal Fusion'
          });
        }
      }

      // Sync latest hazard events
      const evRes = await api.getEvents();
      if (evRes.data) {
        setEvents(evRes.data);
        const unackCritical = evRes.data.find(e => (e.severity === 'CRITICAL' || e.severity === 'HIGH') && !e.acknowledged);
        if (unackCritical && !activeAlert) {
          setActiveAlert(unackCritical);
        }
      }
    } catch (err) {
      console.warn('Fallback to demo simulation telemetry', err);
      // Fallback demo data
      const res = await api.getRoverData('ROVER-01');
      if (res?.data) {
        setTelemetry(res.data);
        setHistory(prev => [...prev.slice(-30), res.data]);
      }
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // 2. Real-Time Polling Loop for ThingSpeak IoT / ESP32
  useEffect(() => {
    const intervalSec = (currentConfig.refresh_interval || 3) * 1000;
    const timer = setInterval(() => {
      fetchTelemetry();
    }, intervalSec);

    return () => clearInterval(timer);
  }, [currentConfig.comm_mode, currentConfig.thingspeak_channel_id, currentConfig.thingspeak_read_api_key, currentConfig.refresh_interval, activeAlert]);

  // Handlers
  const handleToggleDemoMode = async () => {
    const newDemoState = !isDemoMode;
    setIsDemoMode(newDemoState);
    setCurrentConfig(prev => ({
      ...prev,
      is_demo_mode: newDemoState,
      comm_mode: newDemoState ? 'Simulation' : 'ThingSpeak IoT'
    }));
  };

  const handleAcknowledgeAlert = () => {
    setActiveAlert(null);
  };

  const handleAcknowledgeEvent = async (eventId) => {
    try {
      await api.acknowledgeEvent(eventId);
      setEvents(prev => prev.map(e => e.event_id === eventId ? { ...e, acknowledged: true, status: 'ACKNOWLEDGED' } : e));
      if (activeAlert && activeAlert.event_id === eventId) {
        setActiveAlert(null);
      }
    } catch (err) {
      setEvents(prev => prev.map(e => e.event_id === eventId ? { ...e, acknowledged: true, status: 'ACKNOWLEDGED' } : e));
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-primary-dark text-light">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        roverStatus={roverStatus}
        backendConnected={backendConnected}
        riskLevel={telemetry?.ai_risk?.risk_level || 'NORMAL'}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenConnectModal={() => setShowConnectModal(true)}
        onOpenApiModal={() => setShowApiModal(true)}
        lastPacketTime={telemetry?.timestamp}
      />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {activeTab === 'home' && (
          <HomeOverviewPage
            onNavigate={setActiveTab}
            onOpenConnectModal={() => setShowConnectModal(true)}
            onThingSpeakConnected={(newCfg) => {
              setCurrentConfig(prev => ({ ...prev, ...newCfg }));
              setRoverStatus('CONNECTED (ThingSpeak)');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <RescueDashboardPage
            telemetry={telemetry}
            history={history}
            events={events}
            mission={mission}
            isDemoMode={isDemoMode}
            activeAlert={activeAlert}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onAcknowledgeEvent={handleAcknowledgeEvent}
            onMissionUpdate={setMission}
          />
        )}

        {activeTab === 'architecture' && <SystemArchitecturePage />}

        {activeTab === 'history' && <HistoricalDataPage roverId="ROVER-01" />}
      </main>

      {/* ESP32 / ThingSpeak Connection Dialog Modal */}
      <ConnectRoverModal
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        currentConfig={currentConfig}
        onConfigSaved={(cfg) => {
          setCurrentConfig(cfg);
          setIsDemoMode(cfg.is_demo_mode);
          setRoverStatus(cfg.comm_mode === 'ThingSpeak IoT' ? 'CONNECTED (ThingSpeak)' : 'CONNECTED');
          fetchTelemetry();
        }}
      />

      {/* Live Data API Monitor Modal */}
      <LiveDataApiModal
        show={showApiModal}
        onClose={() => setShowApiModal(false)}
        telemetryData={telemetry}
      />
    </div>
  );
}
