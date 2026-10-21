import { Box, FileText, LayoutDashboard, Palette, Ruler, Shirt, SlidersHorizontal } from 'lucide-react';

/** Primary navigation for signed-in pages, in workflow order. `id` is a route id. */
export const APP_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'designer', label: 'Design', icon: Palette },
  { id: 'measurement', label: 'Measure', icon: Ruler },
  { id: 'results', label: 'Fit & Size', icon: SlidersHorizontal },
  { id: 'try-on', label: 'Try On', icon: Shirt },
  { id: 'preview3d', label: '3D Studio', icon: Box },
  { id: 'design-report', label: 'Report', icon: FileText },
];
