// src/components/FunnelChartBox.jsx
import { useState } from 'react';

export default function FunnelChartBox() {
  const [range, setRange] = useState('Week');

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Funnel Chart</h3>
        <select className="time-filter" value={range} onChange={(e) => setRange(e.target.value)}>
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>

      <div className="funnel-chart">
        <div className="funnel-step step-1" />
        <div className="funnel-step step-2" />
        <div className="funnel-step step-3" />
      </div>

      <div className="funnel-legend">
        <div className="legend-item">
          <span className="legend-dot manufacturing"></span>
          <span>Manufacturing</span>
          <strong>$30,000</strong>
        </div>
        <div className="legend-item">
          <span className="legend-dot marketing"></span>
          <span>Marketing</span>
          <strong>$35,000</strong>
        </div>
        <div className="legend-item">
          <span className="legend-dot branding"></span>
          <span>Branding</span>
          <strong>$35,000</strong>
        </div>
      </div>

      <p className="chart-description">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>
    </div>
  );
}
