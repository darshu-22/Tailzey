import React from 'react';
import { FileText, Palette, Ruler } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';

/** Shown instead of the report when there is no design and no measurement to report on. */
export default function ReportEmptyState() {
  const { navigate } = useRouter();

  return (
    <div className="report-empty-state">
      <div className="report-empty-icon" aria-hidden="true">
        <FileText size={26} />
      </div>
      <h2 className="report-empty-title">Nothing to report yet</h2>
      <p className="report-empty-desc">
        Your design report combines your outfit design with your measurements. Start a design or take your
        measurements, then come back here to print or save it as a PDF.
      </p>
      <div className="report-empty-actions">
        <Button variant="primary" size="md" icon={Palette} onClick={() => navigate('designer')}>
          Start a design
        </Button>
        <Button variant="outline" size="md" icon={Ruler} onClick={() => navigate('measurement')}>
          Take measurements
        </Button>
      </div>
    </div>
  );
}
