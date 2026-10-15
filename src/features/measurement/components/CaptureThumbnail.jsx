import React from 'react';
import { Check, SkipForward, Camera, RotateCcw } from 'lucide-react';

/** Thumbnail tile for one capture view: photo, skipped or pending, with a retake action. */
export default function CaptureThumbnail({
  step,
  isCurrent = false,
  capturedImage = null,
  isSkipped = false,
  onClick,
  onRetake,
}) {
  const isCaptured = Boolean(capturedImage);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`capture-thumbnail-item ${isCurrent ? 'is-current' : ''} ${
        isCaptured ? 'is-captured' : ''
      } ${isSkipped ? 'is-skipped' : ''}`.trim()}
      aria-label={`View ${step.id}: ${step.shortName}. Status: ${
        isCaptured ? 'Captured' : isSkipped ? 'Skipped' : 'Pending'
      }`}
    >
      {/* Thumbnail Frame */}
      <div className="capture-thumb-frame">
        {isCaptured ? (
          <img
            src={capturedImage}
            alt={`Captured frame for ${step.shortName}`}
            className="capture-thumb-img"
          />
        ) : isSkipped ? (
          <div className="capture-thumb-empty is-skipped">
            <SkipForward size={16} />
            <span>Skipped</span>
          </div>
        ) : (
          <div className="capture-thumb-empty">
            <Camera size={16} />
            <span>{step.id}</span>
          </div>
        )}

        {/* Status Badge in corner */}
        {isCaptured && (
          <div className="thumb-status-badge is-success" aria-label="Captured">
            <Check size={11} strokeWidth={3} />
          </div>
        )}
        {isSkipped && (
          <div className="thumb-status-badge is-skipped" aria-label="Skipped">
            <SkipForward size={10} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Label and Retake Action */}
      <div className="capture-thumb-meta">
        <span className="capture-thumb-label">{step.shortName}</span>
        {isCaptured && onRetake && (
          <button
            type="button"
            className="capture-thumb-retake-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRetake();
            }}
            aria-label={`Retake ${step.shortName}`}
            title={`Retake ${step.shortName}`}
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
