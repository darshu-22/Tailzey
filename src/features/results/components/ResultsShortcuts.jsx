import React from 'react';
import { Sparkles, Ruler, FileText } from 'lucide-react';
import Button from '../../../shared/ui/Button';

const SHORTCUTS = [
  { route: 'preview3d', label: 'Launch 3D Avatar Studio', icon: Sparkles, variant: 'primary' },
  { route: 'design-report', label: 'Export Design Report', icon: FileText, variant: 'outline' },
  { route: 'measurement', label: 'Guided Camera Capture Flow', icon: Ruler, variant: 'outline' },
  { route: 'designer', label: 'Open Dream Outfit Designer', icon: Sparkles, variant: 'ghost' },
];

/** Quick links from the studio to the other steps of the journey. */
export default function ResultsShortcuts({ onNavigate }) {
  return (
    <div className="results-shortcuts-card">
      {SHORTCUTS.map(({ route, label, icon, variant }) => (
        <Button key={route} variant={variant} size="sm" icon={icon} onClick={() => onNavigate(route)} className="results-shortcut-btn">
          {label}
        </Button>
      ))}
    </div>
  );
}
