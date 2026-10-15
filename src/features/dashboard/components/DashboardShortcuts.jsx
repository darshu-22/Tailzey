import React from 'react';
import { FileText, Printer, Sparkles } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';

const SHORTCUTS = [
  {
    route: 'preview3d',
    icon: Sparkles,
    title: 'Interactive 3D Avatar & Outfit Studio',
    description:
      'Orbit 360°, inspect tailored garment drape, test luxury fabric palettes, and examine contours in real time.',
    actionLabel: 'Launch 3D Studio',
    actionIcon: Sparkles,
    variant: 'primary',
  },
  {
    route: 'design-report',
    icon: FileText,
    title: 'Custom Outfit Design Report & PDF Export',
    description:
      'Generate a client design dossier consolidating your silhouette styling, measurements, comfort ease, and preview.',
    actionLabel: 'Export Report',
    actionIcon: Printer,
    variant: 'outline',
  },
];

/** Quick links to the 3D studio and the design report, which work on the current workspace. */
export default function DashboardShortcuts() {
  const { navigate } = useRouter();

  return (
    <div className="dashboard-shortcuts">
      {SHORTCUTS.map(({ route, icon: Icon, title, description, actionLabel, actionIcon, variant }) => (
        <div key={route} className="dashboard-shortcut-box">
          <div className="dashboard-shortcut-info">
            <div className="dashboard-shortcut-icon" aria-hidden="true">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="dashboard-shortcut-title">{title}</h3>
              <p className="dashboard-shortcut-desc">{description}</p>
            </div>
          </div>
          <Button variant={variant} size="sm" icon={actionIcon} onClick={() => navigate(route)}>
            {actionLabel}
          </Button>
        </div>
      ))}
    </div>
  );
}
