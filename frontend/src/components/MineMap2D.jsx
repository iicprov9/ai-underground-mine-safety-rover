import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react';

export default function MineMap2D({ telemetry, events }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [zoom, setZoom] = useState(1.0);
  const [pathHistory, setPathHistory] = useState([]);

  // Track trajectory path history
  useEffect(() => {
    if (telemetry?.location) {
      setPathHistory(prev => {
        const newPoint = { x: telemetry.location.x, y: telemetry.location.y };
        return [...prev, newPoint].slice(-40);
      });
    }
  }, [telemetry?.location?.x, telemetry?.location?.y]);

  useEffect(() => {
    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.scale(zoom, zoom);

      // 1. Grid Layout
      ctx.strokeStyle = '#121d2e';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // 2. Underground Tunnels
      const tunnels = [
        { points: [[20, 80], [180, 80], [180, 160], [360, 160]] },
        { points: [[180, 80], [180, 20], [340, 20]] },
        { points: [[120, 80], [120, 220], [280, 220]] }
      ];

      tunnels.forEach(t => {
        ctx.beginPath();
        ctx.moveTo(t.points[0][0], t.points[0][1]);
        for (let i = 1; i < t.points.length; i++) {
          ctx.lineTo(t.points[i][0], t.points[i][1]);
        }
        ctx.lineWidth = 28;
        ctx.strokeStyle = '#0f1726';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#263b5c';
        ctx.stroke();
      });

      // 3. Hazard Zones & Trapped Worker Markers
      ctx.fillStyle = 'rgba(255, 59, 48, 0.15)';
      ctx.beginPath(); ctx.arc(124, 82, 35, 0, 2 * Math.PI); ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255, 59, 48, 0.6)'; ctx.stroke();

      ctx.fillStyle = '#ff3b30';
      ctx.font = '11px monospace';
      ctx.fillText('HAZARD: GAS & HEAT SPIKE', 70, 42);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath(); ctx.arc(156, 110, 25, 0, 2 * Math.PI); ctx.fill();

      ctx.fillStyle = '#00f0ff';
      ctx.font = '11px monospace';
      ctx.fillText('TRAPPED WORKER CONFIRMED (36.8°C)', 160, 102);

      // 4. Trajectory Path
      if (pathHistory.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pathHistory[0].x, pathHistory[0].y);
        for (let i = 1; i < pathHistory.length; i++) {
          ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
        }
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5. Rover Marker
      const rx = telemetry?.location?.x || 120;
      const ry = telemetry?.location?.y || 80;

      ctx.fillStyle = 'rgba(0, 230, 118, 0.25)';
      ctx.beginPath(); ctx.arc(rx, ry, 16, 0, 2 * Math.PI); ctx.fill();

      ctx.fillStyle = '#00e676';
      ctx.beginPath(); ctx.arc(rx, ry, 7, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rx, ry - 14);
      ctx.lineTo(rx - 5, ry - 6);
      ctx.lineTo(rx + 5, ry - 6);
      ctx.closePath();
      ctx.fillStyle = '#00e676';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('ROVER-01', rx - 24, ry + 22);

      ctx.restore();
    };

    animFrameRef.current = window.requestAnimationFrame(renderCanvas);
    return () => {
      if (animFrameRef.current) window.cancelAnimationFrame(animFrameRef.current);
    };
  }, [telemetry?.location?.x, telemetry?.location?.y, zoom, pathHistory]);

  const locX = telemetry?.location?.x || 120;
  const locY = telemetry?.location?.y || 80;
  const tunnelId = telemetry?.location?.tunnel_id || 'Tunnel A';

  return (
    <div className="control-card p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="control-card-title text-cyan">
          <MapPin size={18} /> 2D Underground Mine Map & Location System
        </div>
        <div className="d-flex align-items-center gap-1">
          <span className="badge bg-dark border border-secondary text-info font-monospace small me-1">
            LOCAL MESH (METERS)
          </span>
          <button
            className="btn btn-sm btn-dark border-secondary text-light min-touch-target p-2"
            onClick={() => setZoom(prev => Math.min(2.0, prev + 0.2))}
            aria-label="Zoom in map"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="btn btn-sm btn-dark border-secondary text-light min-touch-target p-2"
            onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))}
            aria-label="Zoom out map"
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="btn btn-sm btn-dark border-secondary text-light min-touch-target p-2"
            onClick={() => setZoom(1.0)}
            aria-label="Reset map zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Screen Reader ARIA Live Location Region */}
      <div className="visually-hidden" aria-live="polite">
        Rover position updated: {tunnelId}, X: {locX} meters, Y: {locY} meters.
      </div>

      <div className="mine-map-container" style={{ width: '100%', height: '310px' }}>
        <canvas ref={canvasRef} width={680} height={310} style={{ width: '100%', height: '100%' }} aria-label="Underground Mine Interactive Map Canvas" />

        <div className="position-absolute bottom-0 start-0 p-2 m-2 rounded bg-dark border border-secondary text-light font-monospace" style={{ fontSize: '0.78rem', backdropFilter: 'blur(6px)', opacity: 0.9 }}>
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1">
              <span className="status-indicator online"></span> Rover Position
            </span>
            <span className="d-flex align-items-center gap-1">
              <span className="badge bg-danger rounded-circle p-1"></span> Gas/Heat Hazard
            </span>
            <span className="d-flex align-items-center gap-1">
              <span className="badge bg-info rounded-circle p-1"></span> Trapped Worker
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
