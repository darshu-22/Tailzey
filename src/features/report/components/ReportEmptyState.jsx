import { FileText, Palette, Ruler } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';

/** Shown instead of the report when there is no design and no measurement to report on. */
export default function ReportEmptyState() {
  const { navigate } = useRouter();

  return (
    <div className="empty-state report-empty">
      <div className="empty-state-icon" aria-hidden="true">
        <FileText size={24} />
      </div>
      <h2 className="empty-state-title">Nothing to report yet</h2>
      <p className="empty-state-description">
        Your report combines your outfit design with your measurements. Start a design or take your measurements,
        then come back here to print it or save it as a PDF.
      </p>
      <div className="cluster report-empty-actions">
        <Button variant="primary" icon={Palette} onClick={() => navigate('designer')}>
          Start a design
        </Button>
        <Button variant="outline" icon={Ruler} onClick={() => navigate('measurement')}>
          Take measurements
        </Button>
      </div>
    </div>
  );
}
