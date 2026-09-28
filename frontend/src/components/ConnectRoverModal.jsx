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
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="connectRoverModalTitle" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content dark-modal border-cyan">
          <div className="modal-header dark-modal-header border-bottom border-secondary">
            <h5 className="modal-title text-info d-flex align-items-center gap-2" id="connectRoverModalTitle">
              <Globe size={20} className="text-cyan" /> Connect Rover to ThingSpeak IoT / ESP32
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close modal"></button>
          </div>
          
          <div className="modal-body p-4">
            <p className="text-secondary small mb-3">
              Connect your website directly to your <strong>ThingSpeak IoT channel</strong> or physical <strong>ESP32 Rover</strong> to receive live underground telemetry data.
            </p>

            {testStatus && (
              <div className={`alert ${testStatus.success ? 'alert-success bg-dark text-success border-success' : 'alert-danger bg-dark text-danger border-danger'} p-2.5 mb-3 font-monospace small d-flex align-items-center gap-2`} role="alert">
                {testStatus.success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {testStatus.message}
              </div>
            )}

            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="comm_mode_select" className="form-label text-secondary small fw-bold">Connection Mode</label>
                <select
                  id="comm_mode_select"
                  name="comm_mode"
                  className="form-select dark-input font-monospace text-cyan fw-bold"
                  value={formData.comm_mode}
                  onChange={handleChange}
                  aria-label="Connection Mode"
                >
                  <option value="ThingSpeak IoT">🌐 ThingSpeak IoT Platform (Channel API)</option>
                  <option value="REST API">📡 Direct ESP32 IP / REST API</option>
                  <option value="Simulation">🧪 Demo / Simulation Mode</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="rover_id_input" className="form-label text-secondary small fw-bold">Rover Name / ID</label>
                <input
                  id="rover_id_input"
                  type="text"
                  name="rover_id"
                  className="form-control dark-input font-monospace"
                  value={formData.rover_id}
                  onChange={handleChange}
                  aria-label="Rover Name or ID"
                />
              </div>

              {formData.comm_mode === 'ThingSpeak IoT' ? (
                <>
                  <div className="col-md-6">
                    <label htmlFor="thingspeak_channel_input" className="form-label text-info small fw-bold">ThingSpeak Channel ID *</label>
                    <input
                      id="thingspeak_channel_input"
                      type="text"
                      name="thingspeak_channel_id"
                      className="form-control dark-input font-monospace border-info text-info fw-bold"
                      placeholder="e.g. 2481092"
                      value={formData.thingspeak_channel_id}
                      onChange={handleChange}
                      aria-label="ThingSpeak Channel ID"
                    />
                    <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                      Enter your public or private ThingSpeak Channel ID.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="thingspeak_key_input" className="form-label text-secondary small fw-bold">ThingSpeak Read API Key (Optional)</label>
                    <input
                      id="thingspeak_key_input"
                      type="text"
                      name="thingspeak_read_api_key"
                      className="form-control dark-input font-monospace"
                      placeholder="Optional for public channels"
                      value={formData.thingspeak_read_api_key}
                      onChange={handleChange}
                      aria-label="ThingSpeak Read API Key"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-6">
                    <label htmlFor="esp32_ip_input" className="form-label text-secondary small fw-bold">ESP32 IP Address</label>
                    <input
                      id="esp32_ip_input"
                      type="text"
                      name="esp32_ip"
                      className="form-control dark-input font-monospace"
                      value={formData.esp32_ip}
                      onChange={handleChange}
                      aria-label="ESP32 IP Address"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="api_base_url_input" className="form-label text-secondary small fw-bold">API Base URL</label>
                    <input
                      id="api_base_url_input"
                      type="text"
                      name="api_base_url"
                      className="form-control dark-input font-monospace"
                      value={formData.api_base_url}
                      onChange={handleChange}
                      aria-label="API Base URL"
                    />
                  </div>
                </>
              )}

              <div className="col-md-6">
                <label htmlFor="refresh_interval_input" className="form-label text-secondary small fw-bold">Auto-Refresh Interval (Seconds)</label>
                <input
                  id="refresh_interval_input"
                  type="number"
                  name="refresh_interval"
                  className="form-control dark-input font-monospace"
                  min="1"
                  max="60"
                  value={formData.refresh_interval}
                  onChange={handleChange}
                  aria-label="Auto-Refresh Interval in seconds"
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check form-switch bg-dark p-2.5 rounded border border-secondary w-100">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="checkbox"
                    id="demoModeSwitch"
                    name="is_demo_mode"
                    checked={formData.is_demo_mode}
                    onChange={handleChange}
                    aria-label="Fallback Simulation Mode"
                  />
                  <label className="form-check-label text-light small fw-bold ms-2" htmlFor="demoModeSwitch">
                    Fallback Simulation Mode
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer dark-modal-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1 min-touch-target"
              onClick={handleTestConnection}
              disabled={loading}
              aria-label="Test Connection to ThingSpeak or ESP32"
            >
              {loading ? <RefreshCw size={14} className="spin" /> : <Radio size={14} />}
              Test Connection
            </button>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-secondary btn-sm min-touch-target" onClick={onClose} aria-label="Cancel">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-info text-dark fw-bold btn-sm d-flex align-items-center gap-1 min-touch-target"
                onClick={handleSaveAndConnect}
                disabled={loading}
                aria-label="Save Configuration and Connect Rover"
              >
                <Save size={14} /> Connect Rover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
