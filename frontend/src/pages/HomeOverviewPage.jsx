import React, { useState } from 'react';
import { Globe, Radio, Activity, Flame, Thermometer, Droplets, ArrowRight, Play, CheckCircle, Server, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function HomeOverviewPage({ onNavigate, onOpenConnectModal, onThingSpeakConnected }) {
  const [channelId, setChannelId] = useState('2481092');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleQuickThingSpeakConnect = async (e) => {
    e.preventDefault();
    if (!channelId) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const tsData = await api.fetchThingSpeakData(channelId, apiKey);
      setStatusMsg({
        success: true,
        text: `Connected! Channel ${channelId} | Entry #${tsData.entry_id} | Gas: ${tsData.gas.value} ppm, Temp: ${tsData.temperature.value}°C`
      });
      if (onThingSpeakConnected) {
        onThingSpeakConnected({
          comm_mode: 'ThingSpeak IoT',
          thingspeak_channel_id: channelId,
          thingspeak_read_api_key: apiKey,
          is_demo_mode: false
        });
      }
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } catch (err) {
      setStatusMsg({
        success: false,
        text: `Unable to fetch ThingSpeak Channel ${channelId}. Check your Channel ID or Read API key.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      {/* Hero Quick Connect Box */}
      <div className="p-4 p-md-5 rounded-4 control-card mb-4 border-cyan" style={{ background: 'linear-gradient(135deg, #0e1726 0%, #080d17 100%)' }}>
        <div className="row align-items-center">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <span className="badge bg-dark border border-cyan text-cyan font-monospace px-3 py-1.5 mb-3">
              LIVE MINE RESCUE MONITORING WEBSITE
            </span>
            <h1 className="fw-bold text-white display-6 mb-3">
              Underground Mine Rescue Rover Telemetry & Command Center
            </h1>
            <p className="text-secondary fs-6 mb-4">
              Get real-time gas levels, temperature, humidity, seismic vibration, and location data directly from your ESP32 rover or <strong>ThingSpeak IoT Channel</strong>.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <button
                className="btn btn-info text-dark fw-bold btn-lg px-4 d-flex align-items-center gap-2 shadow"
                onClick={() => onNavigate('dashboard')}
              >
                <Activity size={20} /> Open Monitoring Dashboard <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-outline-light text-white fw-bold btn-lg px-3 d-flex align-items-center gap-2"
                onClick={onOpenConnectModal}
              >
                <Server size={18} /> ESP32 Connection Settings
              </button>
            </div>
          </div>

          {/* Quick ThingSpeak Connect Card on Homepage */}
          <div className="col-lg-5">
            <div className="p-4 rounded-3 bg-dark border border-info shadow-lg">
              <h5 className="text-cyan fw-bold d-flex align-items-center gap-2 mb-3">
                <Globe size={20} /> Connect ThingSpeak IoT Rover
              </h5>

              {statusMsg && (
                <div className={`alert ${statusMsg.success ? 'alert-success bg-dark text-success border-success' : 'alert-danger bg-dark text-danger border-danger'} p-2 mb-3 small font-monospace`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleQuickThingSpeakConnect}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">ThingSpeak Channel ID</label>
                  <input
                    type="text"
                    className="form-control dark-input font-monospace border-info text-info fw-bold"
                    placeholder="Enter Channel ID (e.g. 2481092)"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Read API Key (If Private Channel)</label>
                  <input
                    type="text"
                    className="form-control dark-input font-monospace"
                    placeholder="Optional for public channels"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-cyan text-dark fw-bold w-100 font-monospace d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={16} className="spin" /> : <Globe size={16} />}
                  FETCH THINGSPEAK DATA NOW
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Overview */}
      <h5 className="text-light font-monospace fw-bold mb-3">LIVE MONITORED ROVER SENSORS</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <div className="control-card p-3 h-100">
            <Flame className="text-warning mb-2" size={24} />
            <h6 className="fw-bold text-light">Methane & CO Gas</h6>
            <div className="text-secondary small">Monitors hazardous gas spikes in ppm from ESP32 MQ-4/MQ-7 sensors.</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="control-card p-3 h-100">
            <Thermometer className="text-danger mb-2" size={24} />
            <h6 className="fw-bold text-light">Ambient Temperature</h6>
            <div className="text-secondary small">Continuous heat gradient tracking in °C for underground fire/heat warnings.</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="control-card p-3 h-100">
            <Droplets className="text-info mb-2" size={24} />
            <h6 className="fw-bold text-light">Relative Humidity</h6>
            <div className="text-secondary small">Tunnel moisture levels (%) monitoring for air quality assessment.</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="control-card p-3 h-100">
            <Activity className="text-primary mb-2" size={24} />
            <h6 className="fw-bold text-light">Seismic Vibration</h6>
            <div className="text-secondary small">3-Axis accelerometer vibration ($g$) monitoring for rockfall settling.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
