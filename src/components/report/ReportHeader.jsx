import React from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  FileText,
  LayoutDashboard,
  Check,
  Info,
  Calendar,
  Hash,
  ShieldCheck,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';

/**
 * ReportHeader Component (Phase 7)
 * Displays:
 * 1. Screen-only action controls (Print / Save as PDF, Back, Dashboard shortcuts)
 * 2. Formal Atelier Letterhead for both screen & printed PDF output
 */
export default function ReportHeader({
  reportId,
  generationDate,
  onPrint,
  onNavigate,
  onBack,
}) {
  return (
    <>
      {/* 1. Top Screen-Only Navigation & Action Bar */}
      <nav className="report-top-actions-bar no-print" aria-label="Report Action Bar">
        <div className="report-top-actions-inner">
          <div className="report-nav-left">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={onBack || (() => onNavigate && onNavigate('dashboard'))}
              ariaLabel="Return to previous screen"
            >
              Back
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
            <Button
              variant="primary"
              size="sm"
              icon={Printer}
              onClick={onPrint}
              ariaLabel="Print or Save as PDF"
            >
              Print / Save as PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={LayoutDashboard}
              onClick={() => onNavigate && onNavigate('dashboard')}
              ariaLabel="Return to Atelier Dashboard"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. Formal Atelier Letterhead (Included in printed document) */}
      <header className="report-letterhead" role="banner">
        <div className="report-brand-lockup">
          <img
            src="/assets/tailzy-logo.png"
            alt="Tailzey Monogram"
            className="report-brand-logo"
          />
          <div className="report-brand-info">
            <span className="report-brand-name">TAILZEY</span>
            <span className="report-brand-subtitle">Haute Couture & Custom Atelier</span>
          </div>
        </div>

        <div className="report-title-block">
          <h1 className="report-doc-title">Custom Outfit Design Report</h1>
          <div className="report-doc-meta-row">
            <span className="report-meta-chip chip-gold" title="Unique in-memory session reference">
              <Hash size={12} aria-hidden="true" />
              <span>Ref: {reportId}</span>
            </span>

            <span className="report-meta-chip" title="Generation date">
              <Calendar size={12} aria-hidden="true" />
              <span>Date: {generationDate}</span>
            </span>

            <span className="report-meta-chip" title="Client session status">
              <span>Session: Active Draft</span>
            </span>
          </div>
        </div>
      </header>

      {/* In-Memory Client Session Disclaimer Banner */}
      <aside className="report-session-notice" role="note">
        <div className="report-session-notice-left">
          <Info size={16} style={{ color: 'var(--color-gold)', flexShrink: 0 }} aria-hidden="true" />
          <span>
            <strong>Client In-Memory Dossier:</strong> This report reflects your current active browser session. It has not been transmitted to an external server or permanently synchronized.
          </span>
        </div>
        <StatusBadge variant="neutral">Client-Side Export</StatusBadge>
      </aside>
    </>
  );
}
