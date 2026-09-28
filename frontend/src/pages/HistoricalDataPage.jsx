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
      legend: { labels: { color: '#8a99ad', font: { family: 'monospace' } } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { ticks: { color: '#58677c' }, grid: { color: '#121d2e' } },
      y: { ticks: { color: '#58677c' }, grid: { color: '#121d2e' } }
    }
  };

  const multiSensorChart = {
    labels: timestamps.length > 0 ? timestamps : ['00:00', '00:05', '00:10', '00:15'],
    datasets: [
      {
        label: 'Gas Concentration (ppm)',
        data: gasValues.length > 0 ? gasValues : [12, 14, 28, 15],
        borderColor: '#ffb703',
        backgroundColor: '#ffb70320',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Temperature (°C)',
        data: tempValues.length > 0 ? tempValues : [26, 27, 34, 28],
        borderColor: '#ff3b30',
        backgroundColor: '#ff3b3020',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Vibration (g)',
        data: vibValues.length > 0 ? vibValues : [0.05, 0.08, 0.32, 0.09],
        borderColor: '#00f0ff',
        backgroundColor: '#00f0ff20',
        fill: false,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="container-fluid py-4 px-4 vstack gap-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h3 className="text-cyan font-monospace fw-bold mb-1">
            HISTORICAL TELEMETRY & HAZARD TRENDS
          </h3>
          <p className="text-secondary small mb-0 font-monospace">
            Review logged sensor metrics, historical risk fluctuations, and export raw logs for regulatory compliance.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Time Range Selector */}
          <div className="btn-group btn-group-sm font-monospace">
            <button className={`btn ${timeRange === '5m' ? 'btn-info text-dark fw-bold' : 'btn-dark border-secondary text-light'}`} onClick={() => setTimeRange('5m')}>5 min</button>
            <button className={`btn ${timeRange === '30m' ? 'btn-info text-dark fw-bold' : 'btn-dark border-secondary text-light'}`} onClick={() => setTimeRange('30m')}>30 min</button>
            <button className={`btn ${timeRange === '1h' ? 'btn-info text-dark fw-bold' : 'btn-dark border-secondary text-light'}`} onClick={() => setTimeRange('1h')}>1 Hour</button>
            <button className={`btn ${timeRange === 'all' ? 'btn-info text-dark fw-bold' : 'btn-dark border-secondary text-light'}`} onClick={() => setTimeRange('all')}>All Logs</button>
          </div>

          <button className="btn btn-dark border-secondary text-light btn-sm" onClick={fetchHistory}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>

          {/* Export CSV Button */}
          <button className="btn btn-success text-dark font-monospace fw-bold btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={handleExportCSV}>
            <Download size={14} /> EXPORT CSV DATA
          </button>
        </div>
      </div>

      {/* Main Historical Chart */}
      <div className="control-card p-3">
        <div className="control-card-title text-cyan mb-3">
          <Activity size={18} /> MULTI-SENSOR HISTORICAL TIMELINE ({timeRange.toUpperCase()})
        </div>
        <div style={{ height: '340px' }}>
          <Line data={multiSensorChart} options={chartOptions} />
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="control-card p-3">
        <div className="control-card-title text-cyan mb-3">
          LOGGED SENSOR RECORDS ({historyData.length} PACKETS)
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover font-monospace small mb-0">
            <thead>
              <tr className="text-secondary border-secondary">
                <th>TIMESTAMP</th>
                <th>ROVER</th>
                <th>GAS (PPM)</th>
                <th>TEMP (°C)</th>
                <th>HUMIDITY (%)</th>
                <th>VIBRATION (G)</th>
                <th>BATTERY (%)</th>
                <th>LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map(h => (
                <tr key={h.id} className="border-secondary">
                  <td className="text-secondary">{new Date(h.timestamp).toLocaleTimeString()}</td>
                  <td className="text-light">{h.rover_id}</td>
                  <td className={h.gas > 25 ? 'text-warning fw-bold' : 'text-light'}>{h.gas}</td>
                  <td className={h.temperature > 34 ? 'text-danger fw-bold' : 'text-light'}>{h.temperature}</td>
                  <td className="text-light">{h.humidity}</td>
                  <td className={h.vibration > 0.25 ? 'text-cyan fw-bold' : 'text-light'}>{h.vibration}</td>
                  <td className="text-success">{h.battery}%</td>
                  <td className="text-warning">{h.tunnel_id || 'Tunnel A'} (X:{h.loc_x}, Y:{h.loc_y})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
