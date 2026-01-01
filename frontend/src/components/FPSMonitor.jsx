/**
 * FPS Monitor Component
 * Zeigt aktuelle Frames pro Sekunde an
 */

import React from 'react';
import './FPSMonitor.css';

function FPSMonitor({ fps, showWarning = true }) {
  // Bestimme Status basierend auf FPS
  const getStatus = () => {
    if (fps >= 13) return 'good'; // >= 13 FPS ist gut (Target: 15 FPS)
    if (fps >= 10) return 'okay'; // 10-12 FPS ist okay
    return 'poor'; // < 10 FPS ist schlecht
  };

  const status = getStatus();
  const showPerformanceWarning = showWarning && status === 'poor' && fps > 0;

  return (
    <div className={`fps-monitor fps-${status}`}>
      <div className="fps-value">
        <span className="fps-number">{fps}</span>
        <span className="fps-label">FPS</span>
      </div>
      {showPerformanceWarning && (
        <div className="fps-warning">
          ⚠️ Niedrige Performance
        </div>
      )}
    </div>
  );
}

export default FPSMonitor;


