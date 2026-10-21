import React from 'react';
import { Check } from 'lucide-react';
import PoseIllustration from './PoseIllustration';

/** Each item matches a check the analysis runs on every photo. */
const CHECKLIST = [
  'Prop your phone or laptop at about waist height.',
  'Stand 2–3 m (6–9 ft) away so your whole body is in view.',
  'Wear fitted clothes; loose clothing adds to circumferences.',
  'Use a plain background and even light, with nobody else in frame.',
  'Hold your arms slightly out from your sides.',
  'Stand with your feet hip-width apart.',
];

/** Short setup checklist (two columns on wide screens) with a small pose illustration. */
export default function SetupChecklist() {
  return (
    <section className="card measure-card setup-card" aria-labelledby="setup-title">
      <h2 id="setup-title" className="measure-card-title">
        Get set up
      </h2>
      <ul className="setup-list">
        {CHECKLIST.map((item) => (
          <li key={item} className="setup-item">
            <Check size={16} className="setup-item-icon" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="setup-foot">
        <PoseIllustration />
        <p className="setup-note">
          You’ll take four photos: front, left side, right side and back. Each camera value comes with its own ± range,
          and you can correct anything afterwards.
        </p>
      </div>
    </section>
  );
}
