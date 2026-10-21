import React from 'react';
import { Camera, FileText, Palette, Shirt } from 'lucide-react';
import SectionHeading from '../../../shared/ui/SectionHeading';

const STEPS = [
  { icon: Palette, title: 'Design', description: 'Choose a garment, then its fabric, colour, fit and details.' },
  {
    icon: Camera,
    title: 'Measure with your camera',
    description: 'Take a guided front and side photo; we estimate your body measurements.',
  },
  { icon: Shirt, title: 'Try it on', description: 'Pick your size and see the outfit on you, or on a sample 3D mannequin.' },
  { icon: FileText, title: 'Order with a report', description: 'Print or save a report with your choices and measurements for your tailor.' },
];

/** The four-step journey, as a compact ordered list. */
export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="home-block" aria-labelledby="home-steps-title">
      <SectionHeading
        align="left"
        className="home-heading"
        eyebrow="How it works"
        title={<span id="home-steps-title">From idea to tailor in four steps</span>}
        description="All you need is a phone or laptop camera and a few minutes."
      />

      <ol className="home-steps">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <li key={title} className="home-step">
            <div className="home-step-top">
              <span className="home-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="home-step-title">{title}</h3>
              <Icon size={18} className="home-step-icon" aria-hidden="true" />
            </div>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
