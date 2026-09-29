import React, { useState } from 'react';
import { Wifi, Save, CheckCircle, AlertTriangle, Radio, Server, RefreshCw, Globe } from 'lucide-react';
import { api } from '../services/api';

export default function ConnectRoverModal({ show, onClose, onConfigSaved, currentConfig }) {
  const [formData, setFormData] = useState(currentConfig || {
    rover_id: 'ROVER-01',
    comm_mode: 'ThingSpeak IoT',
    thingspeak_channel_id: '2481092',
    thingspeak_read_api_key: '',
    esp32_ip: '192.168.1.105',
    channel_id: 'CH-7742',
    api_base_url: 'http://192.168.1.105:8080',
    api_endpoint: '/api/rover/ROVER-01/data',
    mqtt_broker: 'broker.hivemq.com',
    mqtt_topic: 'mine/rover/ROVER-01/telemetry',
    is_demo_mode: false,
    refresh_interval: 3
  });

  const [testStatus, setTestStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setTestStatus(null);
    try {
      if (formData.comm_mode === 'ThingSpeak IoT') {
        if (!formData.thingspeak_channel_id) {
          setTestStatus({
            success: false,
            message: 'Please enter a valid ThingSpeak Channel ID (e.g. 2481092).'
          });
          setLoading(false);
          return;
        }
        const tsData = await api.fetchThingSpeakData(formData.thingspeak_channel_id, formData.thingspeak_read_api_key);
        setTestStatus({
          success: true,
          message: `CONNECTED TO THINGSPEAK IOT! Channel ${formData.thingspeak_channel_id} | Latest Entry #${tsData.entry_id} | Gas: ${tsData.gas.value} ppm, Temp: ${tsData.temperature.value}°C`
        });
      } else if (formData.is_demo_mode || formData.comm_mode === 'Simulation') {
        setTimeout(() => {
          setTestStatus({
            success: true,
            message: `CONNECTED: ESP32 ${formData.rover_id} (Simulation Mode active).`
          });
          setLoading(false);
        }, 500);
        return;
      } else {
        const res = await api.getRoverStatus(formData.rover_id);
        setTestStatus({
          success: true,
          message: `CONNECTED: ESP32 ${formData.rover_id} at IP ${formData.esp32_ip}.`
        });
      }
    } catch (err) {
      setTestStatus({
        success: false,
        message: `CONNECTION FAILED: Unable to fetch data from ${formData.comm_mode === 'ThingSpeak IoT' ? 'ThingSpeak Channel ' + formData.thingspeak_channel_id : formData.esp32_ip}. Check Channel ID or Read API key.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndConnect = async () => {
    setLoading(true);
    try {
      await api.connectRover(formData);
      onConfigSaved(formData);
      onClose();
    } catch (err) {
      onConfigSaved(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="connectRoverModalTitle" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content dark-modal border-emerald">
          <div className="modal-header dark-modal-header border-bottom border-secondary border-opacity-25">
            <h5 className="modal-title text-white d-flex align-items-center gap-2 brand-font" id="connectRoverModalTitle">
              <div className="icon-box-emerald" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                <Globe size={18} className="text-emerald" />
              </div>
              Connect Rover to ThingSpeak IoT / ESP32
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close modal"></button>
          </div>

          <div className="modal-body p-4">
            {testStatus && (
              <div className={`alert ${testStatus.success ? 'alert-success bg-dark text-success border-success' : 'alert-danger bg-dark text-danger border-danger'} d-flex align-items-center gap-2 small font-monospace mb-4 rounded-3`}>
                {testStatus.success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                <div>{testStatus.message}</div>
              </div>
            )}

            <div className="row g-3">
              {/* Communication Mode Selection */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold">Telemetry Protocol</label>
                <select
                  className="form-select dark-input font-monospace text-emerald fw-bold"
                  name="comm_mode"
                  value={formData.comm_mode}
                  onChange={handleChange}
                >
                  <option value="ThingSpeak IoT">ThingSpeak IoT (Cloud Channel)</option>
                  <option value="WiFi AP / HTTP REST">ESP32 WiFi Local REST API</option>
                  <option value="MQTT">MQTT Broker (Mine Mesh)</option>
                  <option value="Simulation">Built-in AI Simulation Loop</option>
                </select>
              </div>

              {/* Rover ID */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold">Rover Identifier</label>
                <input
                  type="text"
                  className="form-control dark-input font-monospace"
                  name="rover_id"
                  value={formData.rover_id}
                  onChange={handleChange}
                  placeholder="e.g. ROVER-01"
                />
              </div>

              {/* Conditional Fields based on Comm Mode */}
              {formData.comm_mode === 'ThingSpeak IoT' ? (
                <>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">ThingSpeak Channel ID</label>
                    <input
                      type="text"
                      className="form-control dark-input font-monospace text-emerald fw-bold"
                      name="thingspeak_channel_id"
                      value={formData.thingspeak_channel_id}
                      onChange={handleChange}
                      placeholder="e.g. 2481092"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Read API Key</label>
                    <input
                      type="text"
                      className="form-control dark-input font-monospace"
                      name="thingspeak_read_api_key"
                      value={formData.thingspeak_read_api_key}
                      onChange={handleChange}
                      placeholder="Optional for public channels"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">ESP32 IP Address / Host</label>
                    <input
                      type="text"
                      className="form-control dark-input font-monospace"
                      name="esp32_ip"
                      value={formData.esp32_ip}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">API Base URL</label>
                    <input
                      type="text"
                      className="form-control dark-input font-monospace"
                      name="api_base_url"
                      value={formData.api_base_url}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Polling Interval */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-bold">Refresh Rate</label>
                <div className="input-group">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className="form-control dark-input font-monospace"
                    name="refresh_interval"
                    value={formData.refresh_interval}
                    onChange={handleChange}
                  />
                  <span className="input-group-text dark-input text-secondary">seconds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer dark-modal-footer border-top border-secondary border-opacity-25 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-codespot-secondary font-monospace"
              onClick={handleTestConnection}
              disabled={loading}
            >
              {loading ? <RefreshCw size={14} className="spin" /> : <Radio size={14} />}
              TEST CONNECTION
            </button>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-codespot-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-codespot-primary text-dark font-monospace d-flex align-items-center gap-1"
                onClick={handleSaveAndConnect}
                disabled={loading}
              >
                <Save size={14} /> SAVE & CONNECT ROVER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
