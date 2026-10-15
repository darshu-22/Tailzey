import React from 'react';

function Row({ label, children, highlight = false }) {
  return (
    <div className="spec-item-row">
      <span className="spec-item-label">{label}</span>
      <span className={`spec-item-val ${highlight ? 'highlight' : ''}`.trim()}>{children}</span>
    </div>
  );
}

/** Read-only breakdown of the design and the measurement profile shown beside the 3D stage. */
export default function OutfitSpecList({ garment, color, style, fit, measurement, recordedCount, totalFields }) {
  return (
    <div className="atelier-specs-grid">
      <Row label="Garment Piece:" highlight>
        {garment.name}
      </Row>
      <Row label="Color Tone:">
        <span className="color-dot-preview" style={{ backgroundColor: color.hex }} aria-hidden="true" />
        {color.name}
      </Row>
      <Row label="Style Mood:">{style.name}</Row>
      <Row label="Fit Drape Contour:" highlight>
        {fit.name}
      </Row>
      <Row label="Exploratory Size:">
        {measurement.selectedSize} <span className="spec-item-note">({measurement.selectedSizeType})</span>
      </Row>
      <Row label="Your Measurements:">
        {recordedCount > 0 ? (
          `${recordedCount} of ${totalFields} recorded (${measurement.unit.toUpperCase()})`
        ) : (
          <span className="spec-item-empty">None recorded yet</span>
        )}
      </Row>
    </div>
  );
}
