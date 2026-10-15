import React from 'react';
import { ArrowLeft, FileText, LayoutDashboard, Sparkles } from 'lucide-react';
import { useRouter } from '../../../../app/hooks';
import Button from '../../../../shared/ui/Button';
import DesignReview from '../DesignReview';

/** Step 3: the review sheet plus links back to editing and on to the 3D studio / report. */
export default function ReviewStep({ saveState, onBack }) {
  const { navigate } = useRouter();

  return (
    <section className="designer-step-section" aria-label="Step 3: Review design">
      <DesignReview
        saveState={saveState}
        onEditDesign={onBack}
        onContinue={() => navigate('measurement')}
        onViewReport={() => navigate('design-report')}
      />

      <div className="review-bottom-nav">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back to Customization
        </Button>
        <Button variant="outline" size="sm" icon={Sparkles} onClick={() => navigate('preview3d')}>
          Inspect in 3D Studio
        </Button>
        <Button variant="outline" size="sm" icon={FileText} onClick={() => navigate('design-report')}>
          Export Design Report
        </Button>
        <Button variant="ghost" size="sm" icon={LayoutDashboard} onClick={() => navigate('dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </section>
  );
}
