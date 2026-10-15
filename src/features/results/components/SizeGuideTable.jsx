import React from 'react';
import { STANDARD_LETTER_SIZES } from '../../../shared/data/resultsData';

/** Collapsible benchmark table of letter sizes in the current unit. */
export default function SizeGuideTable({ unit, selectedSize }) {
  return (
    <div className="size-guide-drawer" role="region" aria-label="Exploratory Size Guide Benchmarks">
      <h4 className="size-guide-title">Ready-to-Wear Benchmark Table ({unit.toUpperCase()})</h4>
      <div className="size-guide-table-wrap">
        <table className="size-guide-table">
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Name</th>
              <th scope="col">Chest Range ({unit})</th>
              <th scope="col">Waist Range ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {STANDARD_LETTER_SIZES.map((row) => (
              <tr key={row.id} className={selectedSize === row.id ? 'is-highlighted-row' : ''}>
                <td>
                  <strong>{row.label}</strong>
                </td>
                <td>{row.name}</td>
                <td>{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                <td>{unit === 'cm' ? row.waistCm : row.waistIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="size-guide-footer-note">
        * Benchmark ranges are illustrative industry standards. Bespoke Tailzey garments are made from your
        individual measurements rather than generic off-the-rack size bands.
      </p>
    </div>
  );
}
