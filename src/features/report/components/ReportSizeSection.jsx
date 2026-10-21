import { FIT_PREFERENCES, STANDARD_LETTER_SIZES } from '../../../shared/data/resultsData';
import { getFitById } from '../../../shared/data/designerData';
import SpecList from './SpecList';

/** Section 3: chosen size with its ready-to-wear benchmark, the fit and any ease added. */
export default function ReportSizeSection({ fitId, measurement, adjustedCount }) {
  const designFit = getFitById(fitId);
  const fit = FIT_PREFERENCES.find((f) => f.id === fitId) || {
    name: `${designFit.name} fit`,
    subtext: designFit.subtitle,
  };
  const { selectedSize, selectedSizeType, unit } = measurement;
  const benchmark = STANDARD_LETTER_SIZES.find((s) => s.id === selectedSize);
  const range = (cm, inches) => (unit === 'in' ? `${inches} in` : `${cm} cm`);

  const items = [
    {
      label: 'Size',
      value: selectedSize || 'Not chosen',
      sub: selectedSizeType === 'numeric' ? 'Garment-specific numeric size' : 'Standard letter size',
    },
    ...(benchmark
      ? [
          { label: 'Chest guide', value: range(benchmark.chestCm, benchmark.chestIn), sub: 'Typical ready-to-wear range' },
          { label: 'Waist guide', value: range(benchmark.waistCm, benchmark.waistIn), sub: 'Typical ready-to-wear range' },
        ]
      : []),
    { label: 'Fit', value: fit.name, sub: fit.subtext },
    {
      label: 'Ease',
      value: adjustedCount > 0 ? `${adjustedCount} measurement${adjustedCount === 1 ? '' : 's'} adjusted` : 'No extra ease',
      sub: adjustedCount > 0 ? 'Comfort allowances you set on the Fit & Size page' : undefined,
    },
  ];

  return (
    <section className="report-section" aria-labelledby="report-size-title">
      <h2 id="report-size-title" className="report-section-title">
        Size and fit
      </h2>
      <SpecList items={items} className="report-spec-columns" />
    </section>
  );
}
