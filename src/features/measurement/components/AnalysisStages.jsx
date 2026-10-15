import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

function getStages(status, photoCount) {
  const failed = status === 'error';
  const done = status === 'success';
  return [
    {
      id: 'photos',
      name: 'Photos prepared',
      desc: `${photoCount} view${photoCount === 1 ? '' : 's'} ready to send with your height`,
      state: 'done',
    },
    {
      id: 'analyse',
      name: 'Uploading and analysing',
      desc: 'Detecting your pose and outline, then measuring each body level',
      state: failed ? 'failed' : done ? 'done' : 'current',
    },
    {
      id: 'review',
      name: 'Estimates ready for review',
      desc: 'Each value comes with a ± range and confidence',
      state: done ? 'done' : 'pending',
    },
  ];
}

const BADGES = { done: 'Complete', current: 'In progress…', failed: 'Failed', pending: 'Waiting' };

function StageIcon({ state }) {
  if (state === 'done') return <CheckCircle2 size={20} className="stage-icon-done" />;
  if (state === 'current') return <div className="stage-spinner" />;
  if (state === 'failed') return <AlertCircle size={20} className="stage-icon-failed" />;
  return <Clock size={18} className="stage-icon-pending" />;
}

/**
 * Stage list driven by the real request state. Upload and analysis happen in one
 * request, so they are shown as a single in-flight stage rather than faked steps.
 */
export default function AnalysisStages({ status, photoCount }) {
  return (
    <div className="progress-stages-list">
      {getStages(status, photoCount).map((stage) => (
        <div
          key={stage.id}
          className={`progress-stage-item ${stage.state === 'done' ? 'is-completed' : ''} ${
            stage.state === 'current' ? 'is-current' : ''
          } ${stage.state === 'failed' ? 'is-failed' : ''}`}
        >
          <div className="stage-icon-wrap" aria-hidden="true">
            <StageIcon state={stage.state} />
          </div>
          <div className="stage-content">
            <h4 className="stage-name">{stage.name}</h4>
            <p className="stage-desc">{stage.desc}</p>
          </div>
          <span className="stage-badge">{BADGES[stage.state]}</span>
        </div>
      ))}
    </div>
  );
}
