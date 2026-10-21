import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

function getStages(status, photoCount) {
  const failed = status === 'error';
  const done = status === 'success';
  return [
    {
      id: 'photos',
      name: 'Photos ready',
      desc: `${photoCount} view${photoCount === 1 ? '' : 's'} sent with your height`,
      state: 'done',
    },
    {
      id: 'analyse',
      name: 'Measuring',
      desc: 'Finding your pose and outline, then measuring each body level',
      state: failed ? 'failed' : done ? 'done' : 'current',
    },
    {
      id: 'review',
      name: 'Estimates ready',
      desc: 'Each value comes with a ± range and confidence',
      state: done ? 'done' : 'todo',
    },
  ];
}

const STATE_TEXT = { done: 'done', current: 'in progress', failed: 'failed', todo: 'waiting' };

function StageIcon({ state, index }) {
  if (state === 'done') return <Check size={16} strokeWidth={3} />;
  if (state === 'current') return <span className="loading-spinner analysis-stage-spinner" />;
  if (state === 'failed') return <AlertCircle size={18} />;
  return index + 1;
}

/**
 * Stages driven by the real request state. Upload and analysis happen in one request,
 * so they are shown as a single in-flight stage rather than faked steps.
 */
export default function AnalysisStages({ status, photoCount }) {
  return (
    <ol className="analysis-stages">
      {getStages(status, photoCount).map((stage, index) => (
        <li key={stage.id} className={`analysis-stage is-${stage.state}`}>
          <span className="analysis-stage-icon" aria-hidden="true">
            <StageIcon state={stage.state} index={index} />
          </span>
          <span className="analysis-stage-text">
            <span className="analysis-stage-name">
              {stage.name}
              <span className="sr-only"> ({STATE_TEXT[stage.state]})</span>
            </span>
            <span className="analysis-stage-desc">{stage.desc}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
