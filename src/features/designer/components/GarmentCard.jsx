import React from 'react';
import { Check } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import GarmentCardArtwork from './GarmentCardArtwork';

/**
 * GarmentCard Component
 * Displays individual garment category options with rich visual illustrations,
 * descriptions, and accessible selection indicators.
 */
export default function GarmentCard({
  garment,
  isSelected = false,
  onSelect,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(garment.id);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(garment.id)}
      onKeyDown={handleKeyDown}
      className={`garment-selection-card ${isSelected ? 'is-selected' : ''}`}
      aria-label={`${garment.name} - ${garment.category}. ${garment.description}`}
    >
      {/* Visual Artwork Frame */}
      <div className="garment-card-art-frame">
        <GarmentCardArtwork garmentId={garment.id} />
        {isSelected && (
          <div className="garment-card-selected-glow" aria-hidden="true" />
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="garment-card-body">
        <div className="garment-card-header-row">
          <span className="garment-card-cat-badge">{garment.category}</span>
          {isSelected && (
            <StatusBadge variant="gold" icon={Check} className="garment-selected-badge">
              Active Selection
            </StatusBadge>
          )}
        </div>

        <h3 className="garment-card-title">{garment.name}</h3>
        <p className="garment-card-desc">{garment.description}</p>
      </div>

      {/* Selection Indicator Footer */}
      <div className="garment-card-footer">
        <span className="garment-card-action-text">
          {isSelected ? 'Selected for Customization' : 'Select Silhouette'}
        </span>
        <div
          className={`garment-card-radio-circle ${isSelected ? 'is-checked' : ''}`}
          aria-hidden="true"
        >
          {isSelected && <Check size={12} strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
}
