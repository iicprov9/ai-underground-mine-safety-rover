import React, { useState, useEffect } from 'react';
import { Download, Calendar, Activity, Flame, Thermometer, Droplets, Battery, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { api } from '../services/api';

export default function HistoricalDataPage({ roverId = 'ROVER-01' }) {
  const [timeRange, setTimeRange] = useState('30m');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory(roverId, timeRange, 'json');
      setHistoryData(res.data);
    } catch (err) {
      console.error('Failed to fetch historical telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [timeRange]);

  const handleExportCSV = async () => {
    try {
      const res = await api.getHistory(roverId, timeRange, 'csv');
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mine_telemetry_${roverId}_${timeRange}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to export CSV file.');
    }
  };

  const timestamps = historyData.map(h => new Date(h.timestamp).toLocaleTimeString());
  const gasValues = historyData.map(h => h.gas);
  const tempValues = historyData.map(h => h.temperature);
  const vibValues = historyData.map(h => h.vibration);
  const batteryValues = historyData.map(h => h.battery);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'sans-serif' } } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
    }
  };

  const multiSensorChart = {
    labels: timestamps.length > 0 ? timestamps : ['00:00', '00:05', '00:10', '00:15'],
    datasets: [
      {
        label: 'Gas Concentration (ppm)',
        data: gasValues.length > 0 ? gasValues : [12, 14, 28, 15],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Temperature (°C)',
        data: tempValues.length > 0 ? tempValues : [26, 27, 34, 28],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Vibration (g)',
        data: vibValues.length > 0 ? vibValues : [0.05, 0.08, 0.32, 0.09],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        fill: false,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="container-fluid py-4 px-4 vstack gap-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h3 className="text-white brand-font fw-bold mb-1">
            HISTORICAL TELEMETRY & HAZARD TRENDS
          </h3>
          <p className="text-secondary small mb-0 font-monospace">
            Review logged sensor metrics, historical risk fluctuations, and export raw logs for regulatory compliance.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Time Range Selector */}
          <div className="btn-group btn-group-sm font-monospace" style={{ borderRadius: '999px', overflow: 'hidden' }}>
            {['15m', '30m', '1h', '6h', '24h'].map(t => (
              <button
                key={t}
                className={`btn btn-sm ${timeRange === t ? 'btn-codespot-primary text-dark fw-bold' : 'btn-codespot-secondary text-light'}`}
                onClick={() => setTimeRange(t)}
                style={{ borderRadius: '0' }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            className="btn btn-codespot-primary btn-sm d-flex align-items-center gap-1.5 shadow-sm font-monospace"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Historical Chart */}
      <div className="control-card p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="control-card-title text-white">
            <Activity size={18} className="text-emerald" /> Multisensory Historical Time-Series
          </span>
          {loading && <RefreshCw size={16} className="spin text-emerald" />}
        </div>
        <div style={{ height: '360px' }}>
          <Line data={multiSensorChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
