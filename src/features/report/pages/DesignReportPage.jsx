import React, { useMemo, useState } from 'react';
import { useRouter, useToast, useWorkspace } from '../../../app/hooks';
import ReportHeader from '../components/ReportHeader';
import ReportHighlights from '../components/ReportHighlights';
import ReportOutfitSpec from '../components/ReportOutfitSpec';
import ReportMeasurementSheet from '../components/ReportMeasurementSheet';
import ReportFitSummary from '../components/ReportFitSummary';
import ReportPreviewSection from '../components/ReportPreviewSection';
import ReportEmptyState from '../components/ReportEmptyState';
import {
  buildMeasurementRows,
  formatToday,
  hasDesignContent,
  reportReference,
  summarizeMeasurements,
} from '../lib/reportModel';

const PRINT_DELAY_MS = 300;

/**
 * Design report composed from the workspace design and measurement profile.
 * "Print / Save as PDF" uses the browser's print dialog with print-specific CSS.
 */
export default function DesignReportPage() {
  const { navigate } = useRouter();
  const { notify } = useToast();
  const { design, designStatus, measurement } = useWorkspace();
  const [generationDate] = useState(formatToday);

  const rows = useMemo(() => buildMeasurementRows(measurement), [measurement]);
  const summary = summarizeMeasurements(rows);
  const reportId = reportReference(design);

  if (!hasDesignContent(design) && summary.recorded === 0) {
    return (
      <div className="report-page-wrapper">
        <main className="report-document-container" id="main-content">
          <ReportEmptyState />
        </main>
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

  return (
    <div className="report-page-wrapper">
      <ReportHeader
        reportId={reportId}
        generationDate={generationDate}
        saveStatus={designStatus}
        onPrint={handlePrint}
      />

      <main className="report-document-container" id="main-content">
        <article className="report-document-sheet" aria-label="Design report">
          <ReportHighlights design={design} measurement={measurement} summary={summary} />

          <div className="report-sections-stack">
            <ReportOutfitSpec design={design} measurement={measurement} />
            <ReportMeasurementSheet
              rows={rows}
              summary={summary}
              measurement={measurement}
              onMeasure={() => navigate('measurement')}
            />
            <ReportFitSummary fitId={design.fitId} measurement={measurement} adjustedCount={summary.adjusted} />
            <ReportPreviewSection design={design} onOpen3DStudio={() => navigate('preview3d')} />

            <footer className="report-atelier-seal-block">
              <div className="report-seal-signature">
                <span className="report-seal-signature-line">TAILZEY ATELIER COUTURE</span>
                <span className="report-seal-signature-sub">
                  Design Report • Reference {reportId} • Generated {generationDate}
                </span>
              </div>
              <div className="report-watermark-tag">For design planning — not a guaranteed fit</div>
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}
