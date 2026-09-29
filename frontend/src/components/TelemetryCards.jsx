import React, { useMemo } from 'react';
import { Flame, Thermometer, Droplets, Activity, Battery, Compass, MapPin } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useLanguage } from '../context/LanguageContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TelemetryCards({ telemetry, history }) {
  const { t } = useLanguage();
  if (!telemetry) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL': return 'badge-critical';
      case 'WARNING': return 'badge-warning';
      default: return 'badge-safe';
    }
  };

  const sparklineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 }, line: { borderWidth: 2 } }
  }), []);

  const historySlice = useMemo(() => (history || []).slice(-15), [history]);
  const labels = useMemo(() => historySlice.map((_, i) => `${i}s`), [historySlice]);
  const gasData = useMemo(() => historySlice.map(h => h.gas?.value || h.gas || 12), [historySlice]);
  const tempData = useMemo(() => historySlice.map(h => h.temperature?.value || h.temperature || 28), [historySlice]);
  const humData = useMemo(() => historySlice.map(h => h.humidity?.value || h.humidity || 65), [historySlice]);
  const vibData = useMemo(() => historySlice.map(h => h.vibration?.value || h.vibration || 0.05), [historySlice]);

  const chartDataGas = useMemo(() => ({
    labels: labels.length > 0 ? labels : ['0', '1', '2', '3', '4'],
    datasets: [{
      data: gasData.length > 0 ? gasData : [10, 12, 11, 14, 12],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
      fill: true,
      tension: 0.4
    }]
  }), [labels, gasData]);

  const chartDataTemp = useMemo(() => ({
    labels: labels.length > 0 ? labels : ['0', '1', '2', '3', '4'],
    datasets: [{
      data: tempData.length > 0 ? tempData : [26, 27, 28, 29, 28],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      fill: true,
      tension: 0.4
    }]
  }), [labels, tempData]);

  const chartDataHum = useMemo(() => ({
    labels: labels.length > 0 ? labels : ['0', '1', '2', '3', '4'],
    datasets: [{
      data: humData.length > 0 ? humData : [62, 64, 65, 63, 65],
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.12)',
      fill: true,
      tension: 0.4
    }]
  }), [labels, humData]);

  const chartDataVib = useMemo(() => ({
    labels: labels.length > 0 ? labels : ['0', '1', '2', '3', '4'],
    datasets: [{
      data: vibData.length > 0 ? vibData : [0.05, 0.06, 0.05, 0.08, 0.06],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.12)',
      fill: true,
      tension: 0.4
    }]
  }), [labels, vibData]);

  return (
    <div className="row g-3">
      {/* 1. Gas Concentration */}
      <div className="col-md-6 col-lg-3">
        <div className="control-card p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                <Flame size={15} className="text-emerald" />
              </div>
              {t('gasConcentration')}
            </span>
            <span className={`badge-tactical ${getStatusBadge(telemetry.gas?.status)}`}>
              {t((telemetry.gas?.status || 'SAFE').toLowerCase()) || telemetry.gas?.status || 'SAFE'}
            </span>
          </div>
          <div className="d-flex align-items-baseline justify-content-between">
            <div>
              <span className="metric-value text-emerald">
                {typeof telemetry.gas?.value === 'number' ? telemetry.gas.value.toFixed(1) : (telemetry.gas || 12.0)}
              </span>
              <span className="metric-unit">{telemetry.gas?.unit || 'ppm'}</span>
            </div>
          </div>
          <div style={{ height: '42px' }} className="mt-2">
            <Line data={chartDataGas} options={sparklineOptions} />
          </div>
          <div className="text-muted small mt-2 font-monospace" style={{ fontSize: '0.75rem' }}>
            {t('gasLimit')}
          </div>
        </div>
      </div>

      {/* 2. Temperature */}
      <div className="col-md-6 col-lg-3">
        <div className="control-card p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                <Thermometer size={15} className="text-emerald" />
              </div>
              {t('temperature')}
            </span>
            <span className={`badge-tactical ${getStatusBadge(telemetry.temperature?.status)}`}>
              {t((telemetry.temperature?.status || 'SAFE').toLowerCase()) || telemetry.temperature?.status || 'SAFE'}
            </span>
          </div>
          <div className="d-flex align-items-baseline justify-content-between">
            <div>
              <span className="metric-value" style={{ color: '#f59e0b' }}>
                {typeof telemetry.temperature?.value === 'number' ? telemetry.temperature.value.toFixed(1) : (telemetry.temperature || 28.5)}
              </span>
              <span className="metric-unit">{telemetry.temperature?.unit || '°C'}</span>
            </div>
          </div>
          <div style={{ height: '42px' }} className="mt-2">
            <Line data={chartDataTemp} options={sparklineOptions} />
          </div>
          <div className="text-muted small mt-2 font-monospace" style={{ fontSize: '0.75rem' }}>
            {t('tempLimit')}
          </div>
        </div>
      </div>

      {/* 3. Humidity */}
      <div className="col-md-6 col-lg-3">
        <div className="control-card p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                <Droplets size={15} className="text-emerald" />
              </div>
              {t('humidity')}
            </span>
            <span className={`badge-tactical ${getStatusBadge(telemetry.humidity?.status)}`}>
              {t((telemetry.humidity?.status || 'SAFE').toLowerCase()) || telemetry.humidity?.status || 'SAFE'}
            </span>
          </div>
          <div className="d-flex align-items-baseline justify-content-between">
            <div>
              <span className="metric-value text-white">
                {typeof telemetry.humidity?.value === 'number' ? telemetry.humidity.value.toFixed(1) : (telemetry.humidity || 65.0)}
              </span>
              <span className="metric-unit">{telemetry.humidity?.unit || '%'}</span>
            </div>
          </div>
          <div style={{ height: '42px' }} className="mt-2">
            <Line data={chartDataHum} options={sparklineOptions} />
          </div>
          <div className="text-muted small mt-2 font-monospace" style={{ fontSize: '0.75rem' }}>
            {t('humidityLimit')}
          </div>
        </div>
      </div>

      {/* 4. Seismic Vibration */}
      <div className="col-md-6 col-lg-3">
        <div className="control-card p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                <Activity size={15} className="text-emerald" />
              </div>
              {t('vibrationSeismic')}
            </span>
            <span className={`badge-tactical ${getStatusBadge(telemetry.vibration?.status)}`}>
              {t((telemetry.vibration?.status || 'SAFE').toLowerCase()) || telemetry.vibration?.status || 'SAFE'}
            </span>
          </div>
          <div className="d-flex align-items-baseline justify-content-between">
            <div>
              <span className="metric-value" style={{ color: '#38bdf8' }}>
                {typeof telemetry.vibration?.value === 'number' ? telemetry.vibration.value.toFixed(2) : (telemetry.vibration || 0.08)}
              </span>
              <span className="metric-unit">{telemetry.vibration?.unit || 'g'}</span>
            </div>
          </div>
          <div style={{ height: '42px' }} className="mt-2">
            <Line data={chartDataVib} options={sparklineOptions} />
          </div>
          <div className="text-muted small mt-2 font-monospace" style={{ fontSize: '0.75rem' }}>
            {t('vibrationLimit')}
          </div>
        </div>
      </div>

      {/* Battery, IMU Orientation, and Location */}
      <div className="col-md-4">
        <div className="control-card p-3">
          <div className="d-flex align-items-center justify-content-between mb-1.5">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <Battery size={16} className="text-emerald" /> {t('batteryMonitor')}
            </span>
            <span className="text-emerald font-monospace fw-bold">{telemetry.battery || 94}%</span>
          </div>
          <div className="progress bg-dark border border-secondary" style={{ height: '8px', borderRadius: '999px' }} aria-label="Battery Status">
            <div
              className="progress-bar bg-success progress-bar-striped progress-bar-animated"
              style={{ width: `${telemetry.battery || 94}%`, borderRadius: '999px' }}
              role="progressbar"
              aria-valuenow={telemetry.battery || 94}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="control-card p-3">
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <Compass size={16} className="text-emerald" /> {t('imuAttitude')}
            </span>
            <span className="font-monospace small text-emerald">
              X:{telemetry.imu?.x || 0.01} Y:{telemetry.imu?.y || 0.02} Z:{telemetry.imu?.z || 0.98}
            </span>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="control-card p-3">
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-secondary small fw-bold d-flex align-items-center gap-1.5 font-monospace">
              <MapPin size={16} className="text-emerald" /> {t('minePosition')}
            </span>
            <span className="font-monospace small text-white">
              X:{telemetry.location?.x || 120} Y:{telemetry.location?.y || 80} ({telemetry.location?.tunnel_id || 'Tunnel A'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
