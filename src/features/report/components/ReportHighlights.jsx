import React from 'react';
import { getColorById, getFitById, getGarmentById } from '../../../shared/data/designerData';

function Highlight({ label, children, gold = false }) {
  return (
    <div className="report-highlight-card">
      <span className="report-highlight-label">{label}</span>
      <span className={`report-highlight-val ${gold ? 'highlight-gold' : ''}`.trim()}>{children}</span>
    </div>
  );
}

/** Strip of key facts at the top of the report. */
export default function ReportHighlights({ design, measurement, summary }) {
  const garment = getGarmentById(design.garmentId);
  const color = getColorById(design.colorId);
  const fit = getFitById(design.fitId);

  return (
    <div className="report-highlights-grid" aria-label="Key design facts">
      <Highlight label="Silhouette" gold>
        {garment.name}
      </Highlight>
      <Highlight label="Fabric Color">
        <span className="report-color-dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />
        {color.name}
      </Highlight>
      <Highlight label="Fit Drape">{fit.name}</Highlight>
      <Highlight label="Size Benchmark" gold>
        {measurement.selectedSize}
      </Highlight>
      <Highlight label="Unit Scale">{measurement.unit.toUpperCase()}</Highlight>
      <Highlight label="Measurements">
        {summary.recorded > 0 ? `${summary.recorded} of ${summary.total}` : 'None yet'}
      </Highlight>
    </div>
  );
}
