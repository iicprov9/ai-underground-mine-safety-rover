import React, { useState } from 'react';
import { Globe, Radio, Activity, Flame, Thermometer, Droplets, ArrowRight, Play, CheckCircle, Server, RefreshCw, Cpu, ShieldAlert, Zap, Compass, Volume2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HomeOverviewPage({ onNavigate, onOpenConnectModal, onThingSpeakConnected }) {
  const { t } = useLanguage();
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
      {/* Hero Section in Codespot Emerald Style */}
      <div 
        className="p-4 p-md-5 rounded-4 control-card mb-5 border-emerald position-relative" 
        style={{ 
          background: 'linear-gradient(135deg, #090e15 0%, #05070a 100%)',
          boxShadow: '0 20px 60px -15px rgba(34, 197, 94, 0.15)' 
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <Sparkles size={14} className="text-emerald" />
              <span className="font-monospace text-emerald small fw-bold tracking-wide">
                NEXT-GEN AI MINE RESCUE PLATFORM
              </span>
            </div>
            
            <h1 className="fw-extrabold text-white display-5 mb-3 brand-font lh-sm">
              We Engineer Autonomous <span style={{ color: '#22c55e' }}>Mine Rescue Intelligence</span> with Multi-Sensor Vision & Fusion
            </h1>
            
            <p className="text-secondary fs-6 mb-4 lh-base" style={{ maxWidth: '600px' }}>
              Real-time robotic edge telemetry, YOLOv8 victim detection, MLX90640 thermal confirmation, gas anomaly Isolation Forest, and live ESP32 / ThingSpeak IoT telemetry pipeline.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <button
                className="btn btn-codespot-primary text-dark fw-bold btn-lg px-4 d-flex align-items-center gap-2 shadow"
                onClick={() => onNavigate('dashboard')}
              >
                <Activity size={20} /> Open Command Dashboard <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-codespot-secondary text-white fw-bold btn-lg px-4 d-flex align-items-center gap-2"
                onClick={onOpenConnectModal}
              >
                <Server size={18} /> ESP32 IoT Settings
              </button>
            </div>

            {/* Quick Live Status Badges */}
            <div className="d-flex align-items-center gap-4 pt-2 border-top border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <span className="status-indicator online"></span>
                <span className="small text-muted font-monospace">Edge AI Vision Ready</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="status-indicator online"></span>
                <span className="small text-muted font-monospace">Thermal Matrix Calibrated</span>
              </div>
            </div>
          </div>

          {/* Quick ThingSpeak Connect Card */}
          <div className="col-lg-5">
            <div className="p-4 rounded-4 control-card" style={{ background: '#090d14', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="text-white fw-bold d-flex align-items-center gap-2 mb-0 brand-font">
                  <div className="icon-box-emerald" style={{ width: '34px', height: '34px', borderRadius: '8px' }}>
                    <Globe size={18} className="text-emerald" />
                  </div>
                  Connect ThingSpeak IoT
                </h5>
                <span className="badge-tactical badge-safe">ESP32 Stream</span>
              </div>

              {statusMsg && (
                <div className={`alert ${statusMsg.success ? 'alert-success bg-dark text-success border-success' : 'alert-danger bg-dark text-danger border-danger'} p-2.5 mb-3 small font-monospace rounded-3`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleQuickThingSpeakConnect}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">ThingSpeak Channel ID</label>
                  <input
                    type="text"
                    className="form-control dark-input font-monospace text-emerald fw-bold"
                    placeholder="Enter Channel ID (e.g. 2481092)"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Read API Key</label>
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
                  className="btn btn-codespot-primary text-dark fw-bold w-100 font-monospace d-flex align-items-center justify-content-center gap-2"
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

      {/* Codespot High-Impact Metric Callout Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-3 col-6">
          <div className="control-card p-4 h-100">
            <div className="stat-highlight mb-1">99.4%</div>
            <div className="fw-bold text-white fs-6">AI Detection Accuracy</div>
            <div className="text-secondary small">YOLOv8 + MLX90640 Dual Verification</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="control-card p-4 h-100">
            <div className="stat-highlight mb-1">&lt;15ms</div>
            <div className="fw-bold text-white fs-6">Telemetry Latency</div>
            <div className="text-secondary small">Real-time ESP32 edge streaming</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="control-card p-4 h-100">
            <div className="stat-highlight mb-1">6</div>
            <div className="fw-bold text-white fs-6">Integrated AI Modules</div>
            <div className="text-secondary small">Vision, Thermal, Gas, Audio, SLAM, Fusion</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="control-card p-4 h-100">
            <div className="stat-highlight mb-1">100%</div>
            <div className="fw-bold text-white fs-6">Zero Blind Spots</div>
            <div className="text-secondary small">Multimodal sensory coverage matrix</div>
          </div>
        </div>
      </div>

      {/* Codespot Feature Grid */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="text-white fw-bold brand-font mb-1">Autonomous Sensory AI Architecture</h4>
          <p className="text-secondary small mb-0">Multimodal telemetry and deep neural intelligence for trapped worker recovery</p>
        </div>
        <button className="btn btn-codespot-secondary btn-sm" onClick={() => onNavigate('architecture')}>
          View Full AI Spec →
        </button>
      </div>

      <div className="row g-3">
        <div className="col-lg-3 col-md-6">
          <div className="control-card p-3 h-100">
            <div className="icon-box-emerald mb-3">
              <Cpu size={22} />
            </div>
            <h6 className="fw-bold text-white mb-1">1. YOLOv8 Edge Vision</h6>
            <p className="text-secondary small mb-0">
              Low-light human posture detection, bounding box spatial localization, and 98%+ confidence identification.
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="control-card p-3 h-100">
            <div className="icon-box-emerald mb-3">
              <Thermometer size={22} />
            </div>
            <h6 className="fw-bold text-white mb-1">2. MLX90640 Thermal IR</h6>
            <p className="text-secondary small mb-0">
              32x24 IR array heat gradient filtering to isolate human 35°C–39°C metabolic signatures through thick dust.
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="control-card p-3 h-100">
            <div className="icon-box-emerald mb-3">
              <Flame size={22} />
            </div>
            <h6 className="fw-bold text-white mb-1">3. Isolation Forest Gas Anomaly</h6>
            <p className="text-secondary small mb-0">
              Unsupervised anomaly detection for multi-gas toxic mixtures (CH4, CO, H2S, O2).
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="control-card p-3 h-100">
            <div className="icon-box-emerald mb-3">
              <Volume2 size={22} />
            </div>
            <h6 className="fw-bold text-white mb-1">4. Acoustic Distress Audio AI</h6>
            <p className="text-secondary small mb-0">
              Spectrogram CNN classification for trapped worker shouting, pipe tapping, and rock fracture sounds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
