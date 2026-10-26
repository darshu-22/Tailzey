import React from 'react';
import { Box, Ruler, ShieldCheck, Video } from 'lucide-react';
import SectionHeading from '../../../shared/ui/SectionHeading';

const FEATURES = [
  {
    icon: Ruler,
    title: 'Camera measurements',
    description:
      'Chest, waist, hips, shoulders and more from two photos. Each value shows its ± error, measured on real people.',
  },
  {
    icon: Video,
    title: 'Live virtual try-on',
    description: 'Point your camera at yourself and see the garment you designed follow your movement.',
  },
  {
    icon: Box,
    title: '3D preview',
    description: 'Turn your outfit around on a sample 3D mannequin to check colours, length and details.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    description: 'Photos are processed in memory for one request, then discarded. Never saved, logged or shared.',
  },
];

/** Compact grid of what the product does. */
export default function FeaturesSection() {
  return (
    <section id="features" className="home-block" aria-labelledby="home-features-title">
      <SectionHeading
        align="left"
        className="home-heading"
        eyebrow="Features"
        title={<span id="home-features-title">Made for a good fit</span>}
        description="Simple tools that turn a design idea into measurements a tailor can work with."
      />

      <ul className="home-features">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <li key={title} className="card home-feature">
            <div className="home-feature-top">
              <span className="home-feature-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <h3 className="home-feature-title">{title}</h3>
            </div>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
