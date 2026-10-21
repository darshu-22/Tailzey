import React from 'react';
import { Camera, Check, SkipForward } from 'lucide-react';

const statusOf = (captured, skipped) => (captured ? 'Captured' : skipped ? 'Skipped' : 'Not taken yet');

/** The four views as thumbnails; selecting one makes it the active view (to retake it, for example). */
export default function ViewProgressList({ steps, activeIndex, images, skipped, onSelect }) {
  const done = Object.keys(images).length;

  return (
    <div className="view-progress">
      <p className="view-progress-count">
        <strong>{done}</strong> of {steps.length} photos taken
      </p>
      <ol className="view-progress-list">
        {steps.map((step, index) => {
          const image = images[step.key];
          const isSkipped = Boolean(skipped[step.key]);
          const isCurrent = index === activeIndex;
          return (
            <li key={step.key}>
              <button
                type="button"
                className={`view-thumb ${isCurrent ? 'is-current' : ''} ${image ? 'is-done' : ''}`.trim()}
                onClick={() => onSelect(index)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.name}: ${statusOf(Boolean(image), isSkipped)}`}
              >
                <span className="view-thumb-frame">
                  {image ? (
                    <img src={image} alt="" className="view-thumb-img" />
                  ) : isSkipped ? (
                    <SkipForward size={16} aria-hidden="true" />
                  ) : (
                    <Camera size={16} aria-hidden="true" />
                  )}
                  {image && (
                    <span className="view-thumb-check" aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="view-thumb-label">{step.shortName}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
