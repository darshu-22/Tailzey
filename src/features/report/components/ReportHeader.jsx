import React from 'react';
import { ArrowLeft, Calendar, Hash, Info, LayoutDashboard, Printer } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';

const STATUS = {
  saved: {
    chip: 'Saved design',
    title: 'Saved design:',
    text: 'this report reflects the design stored in your account plus your current measurements.',
  },
  dirty: {
    chip: 'Unsaved changes',
    title: 'Unsaved changes:',
    text: 'this design has edits that are not saved to your account yet — save them from the designer.',
  },
  new: {
    chip: 'Unsaved draft',
    title: 'Unsaved draft:',
    text: 'this design is not stored in your account yet — save it from the designer to keep it.',
  },
};

/**
 * Screen-only action bar (print / navigation) plus the letterhead that also prints,
 * and a note on whether the design in this report is saved to the account.
 * @param {'new'|'saved'|'dirty'} props.saveStatus
 */
export default function ReportHeader({ reportId, generationDate, saveStatus, onPrint }) {
  const { navigate } = useRouter();
  const status = STATUS[saveStatus];

  return (
    <>
      <nav className="report-top-actions-bar no-print" aria-label="Report actions">
        <div className="report-top-actions-inner">
          <div className="report-nav-left">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('designer')}>
              Designer
            </Button>
            <div className="report-breadcrumb" aria-hidden="true">
              <span>Atelier</span>
              <span>/</span>
              <span>Outfit Studio</span>
              <span>/</span>
              <span className="report-breadcrumb-active">Design Report</span>
            </div>
          </div>

          <div className="report-nav-actions">
            <Button variant="primary" size="sm" icon={Printer} onClick={onPrint}>
              Print / Save as PDF
            </Button>
            <Button variant="outline" size="sm" icon={LayoutDashboard} onClick={() => navigate('dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <header className="report-letterhead">
        <div className="report-brand-lockup">
          <img src="/assets/tailzy-logo.png" alt="Tailzey" className="report-brand-logo" />
          <div className="report-brand-info">
            <span className="report-brand-name">TAILZEY</span>
            <span className="report-brand-subtitle">Haute Couture & Custom Atelier</span>
          </div>
        </div>

        <div className="report-title-block">
          <h1 className="report-doc-title">Custom Outfit Design Report</h1>
          <div className="report-doc-meta-row">
            <span className="report-meta-chip chip-gold" title="Report reference">
              <Hash size={12} aria-hidden="true" />
              <span>Ref: {reportId}</span>
            </span>
            <span className="report-meta-chip" title="Generation date">
              <Calendar size={12} aria-hidden="true" />
              <span>Date: {generationDate}</span>
            </span>
            <span className="report-meta-chip" title="Design status">
              <span>{status.chip}</span>
            </span>
          </div>
        </div>
      </header>

      <aside className="report-session-notice no-print" role="note">
        <div className="report-session-notice-left">
          <Info size={16} className="report-note-icon" aria-hidden="true" />
          <span>
            <strong>{status.title}</strong> {status.text}
          </span>
        </div>
        <StatusBadge variant="neutral">Print to PDF</StatusBadge>
      </aside>
    </>
  );
}
