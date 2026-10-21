import { useMemo, useState } from 'react';
import { Palette, Printer } from 'lucide-react';
import { useRouter, useToast, useWorkspace } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';
import PageHeader from '../../../shared/ui/PageHeader';
import ReportDocHead from '../components/ReportDocHead';
import ReportOutfitSection from '../components/ReportOutfitSection';
import ReportMeasurementsSection from '../components/ReportMeasurementsSection';
import ReportSizeSection from '../components/ReportSizeSection';
import ReportNotesSection from '../components/ReportNotesSection';
import ReportEmptyState from '../components/ReportEmptyState';
import ReportSaveNotice from '../components/ReportSaveNotice';
import {
  buildMeasurementRows,
  formatToday,
  hasDesignContent,
  reportReference,
  summarizeMeasurements,
} from '../lib/reportModel';

const PRINT_DELAY_MS = 300;

/**
 * Printable design specification built from the workspace design and measurement profile.
 * "Print / Save PDF" opens the browser print dialog; print.css lays the page out for A4.
 */
export default function DesignReportPage() {
  const { navigate } = useRouter();
  const { notify } = useToast();
  const { design, designStatus, measurement } = useWorkspace();
  const [generationDate] = useState(formatToday);

  const rows = useMemo(() => buildMeasurementRows(measurement), [measurement]);
  const summary = summarizeMeasurements(rows);

  if (!hasDesignContent(design) && summary.recorded === 0) {
    return (
      <div className="page report-page">
        <PageHeader title="Design report" description="A printable summary of your outfit and measurements." />
        <ReportEmptyState />
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window.print !== 'function') {
      notify({ title: 'Printing unavailable', message: 'Use your browser menu (File › Print) instead.', variant: 'error' });
      return;
    }
    notify({ title: 'Opening print dialog', message: 'Choose “Save as PDF” as the destination to export.', variant: 'info' });
    // Let the toast paint before the modal print dialog blocks the page.
    setTimeout(() => window.print(), PRINT_DELAY_MS);
  };

  const actions = (
    <>
      <Button variant="outline" icon={Palette} onClick={() => navigate('designer')}>
        Edit design
      </Button>
      <Button variant="primary" icon={Printer} onClick={handlePrint}>
        Print / Save PDF
      </Button>
    </>
  );

  return (
    <div className="page report-page">
      <PageHeader
        title="Design report"
        description="Your outfit specification and measurements, ready to print or share with a tailor."
        actions={actions}
      />

      <ReportSaveNotice status={designStatus} onEdit={() => navigate('designer')} />

      <article className="report-doc" aria-label="Design specification">
        <ReportDocHead
          design={design}
          reference={reportReference(design)}
          date={generationDate}
          status={designStatus}
          unit={measurement.unit}
        />
        <ReportOutfitSection design={design} />
        <ReportMeasurementsSection rows={rows} summary={summary} onMeasure={() => navigate('measurement')} />
        <ReportSizeSection fitId={design.fitId} measurement={measurement} adjustedCount={summary.adjusted} />
        <ReportNotesSection measurement={measurement} summary={summary} />

        <footer className="report-doc-foot">
          Tailzey design report · Reference {reportReference(design)} · Generated {generationDate}
        </footer>
      </article>
    </div>
  );
}
