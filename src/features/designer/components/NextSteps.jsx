import { Box, FileText, Ruler, Shirt } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';

const SECONDARY = [
  { route: 'try-on', label: 'Try on', icon: Shirt },
  { route: 'preview3d', label: '3D studio', icon: Box },
  { route: 'design-report', label: 'Report', icon: FileText },
];

/** Where to go once the design is ready: measurements first, then the previews and report. */
export default function NextSteps() {
  const { navigate } = useRouter();

  return (
    <nav className="designer-next" aria-label="Continue with this design">
      <Button variant="primary" icon={Ruler} onClick={() => navigate('measurement')} className="designer-next-primary">
        Take measurements
      </Button>
      <div className="designer-next-links">
        {SECONDARY.map(({ route, label, icon }) => (
          <Button key={route} variant="ghost" size="sm" icon={icon} onClick={() => navigate(route)}>
            {label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
