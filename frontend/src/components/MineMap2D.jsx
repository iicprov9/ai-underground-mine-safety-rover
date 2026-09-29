import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MineMap2D({ telemetry, events }) {
  const { t } = useLanguage();
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

      // Clear background - deep obsidian
      ctx.fillStyle = '#030508';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.scale(zoom, zoom);

      // 1. Grid Layout
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
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
        ctx.lineWidth = 30;
        ctx.strokeStyle = '#0a1017';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.stroke();
      });

      // 3. Hazard Zones & Trapped Worker Markers
      ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
      ctx.beginPath(); ctx.arc(124, 82, 35, 0, 2 * Math.PI); ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(t('hazardGasHeat'), 70, 42);

      ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
      ctx.beginPath(); ctx.arc(156, 110, 25, 0, 2 * Math.PI); ctx.fill();

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(t('workerConfirmed'), 160, 102);

      // 4. Trajectory Path
      if (pathHistory.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pathHistory[0].x, pathHistory[0].y);
        for (let i = 1; i < pathHistory.length; i++) {
          ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
        }
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5. Rover Marker
      const rx = telemetry?.location?.x || 120;
      const ry = telemetry?.location?.y || 80;

      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.beginPath(); ctx.arc(rx, ry, 18, 0, 2 * Math.PI); ctx.fill();

      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(rx, ry, 8, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rx, ry - 14);
      ctx.lineTo(rx - 5, ry - 6);
      ctx.lineTo(rx + 5, ry - 6);
      ctx.closePath();
      ctx.fillStyle = '#4ade80';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('ROVER-01', rx - 24, ry + 22);

      ctx.restore();
    };

    renderCanvas();
  }, [telemetry, zoom, pathHistory, t]);

  return (
    <div className="control-card p-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="control-card-title text-white">
          <div className="icon-box-emerald" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
            <MapPin size={15} className="text-emerald" />
          </div>
          {t('mineMapTitle')}
        </div>
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-codespot-secondary btn-sm"
            onClick={() => setZoom(z => Math.min(z + 0.2, 2.0))}
            aria-label="Zoom in on 2D mine map"
            style={{ borderRadius: '6px 0 0 6px', padding: '4px 10px' }}
          >
            <ZoomIn size={14} />
          </button>
          <button
            className="btn btn-codespot-secondary btn-sm"
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
            aria-label="Zoom out on 2D mine map"
            style={{ padding: '4px 10px' }}
          >
            <ZoomOut size={14} />
          </button>
          <button
            className="btn btn-codespot-secondary btn-sm"
            onClick={() => setZoom(1.0)}
            aria-label="Reset zoom on 2D mine map"
            style={{ borderRadius: '0 6px 6px 0', padding: '4px 10px' }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="mine-map-container" style={{ height: '250px' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={250}
          className="w-100 h-100 d-block"
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-2 font-monospace small text-muted">
        <span className="d-flex align-items-center gap-1.5">
          <span className="status-indicator online"></span>
          ROVER-01 (Sector 4)
        </span>
        <span className="text-emerald">Grid: 1m/px</span>
      </div>
    </div>
  );
}
