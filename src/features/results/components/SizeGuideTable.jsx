import React from 'react';
import { STANDARD_LETTER_SIZES } from '../../../shared/data/resultsData';

/** Collapsible reference chart of letter sizes in the current unit. */
export default function SizeGuideTable({ unit, selectedSize }) {
  return (
    <details className="size-guide">
      <summary className="size-guide-summary">Size chart ({unit})</summary>
      <div className="size-guide-scroll">
        <table className="size-guide-table">
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Chest</th>
              <th scope="col">Waist</th>
            </tr>
          </thead>
          <tbody>
            {STANDARD_LETTER_SIZES.map((row) => (
              <tr key={row.id} className={selectedSize === row.id ? 'is-selected' : ''}>
                <th scope="row">
                  {row.label} <span className="size-guide-name">{row.name}</span>
                </th>
                <td>{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                <td>{unit === 'cm' ? row.waistCm : row.waistIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="size-guide-note">Typical ready-to-wear ranges, for reference only.</p>
    </details>
  );
}
