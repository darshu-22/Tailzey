import React from 'react';
import { FileText, Ruler, Shirt } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';

/** Where to go from the 3D studio: one compact row of three links. */
export default function StudioNextSteps({ hasEstimates }) {
  const { navigate } = useRouter();

  return (
    <nav className="studio-section studio-next" aria-label="Next steps">
      <Button
        variant={hasEstimates ? 'primary' : 'outline'}
        icon={Ruler}
        onClick={() => navigate('measurement')}
        ariaLabel={hasEstimates ? 'Measure yourself' : 'Measure again'}
      >
        {hasEstimates ? 'Measure' : 'Re-measure'}
      </Button>
      <Button variant="outline" icon={Shirt} onClick={() => navigate('try-on')}>
        Try on
      </Button>
      <Button
        variant={hasEstimates ? 'outline' : 'primary'}
        icon={FileText}
        onClick={() => navigate('design-report')}
        ariaLabel="Design report"
      >
        Report
      </Button>
    </nav>
  );
}
