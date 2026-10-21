import React from 'react';
import { Box, Camera, Palette, Shirt } from 'lucide-react';
import { useRouter } from '../../../app/hooks';

const ACTIONS = [
  { route: 'designer', icon: Palette, title: 'Design an outfit', description: 'Choose a garment, fabric and colour.' },
  { route: 'measurement', icon: Camera, title: 'Measure yourself', description: 'Two guided photos with your camera.' },
  { route: 'try-on', icon: Shirt, title: 'Try it on', description: 'See your design on you, live.' },
  { route: 'preview3d', icon: Box, title: '3D studio', description: 'View it on a sample 3D mannequin.' },
];

/** Compact shortcut tiles into the main tools; they continue the work currently in the workspace. */
export default function QuickActions() {
  const { navigate } = useRouter();

  return (
    <ul className="dash-quick" aria-label="Quick actions">
      {ACTIONS.map(({ route, icon: Icon, title, description }) => (
        <li key={route}>
          <a
            href={`#${route}`}
            className="card dash-quick-card"
            title={description}
            onClick={(event) => {
              event.preventDefault();
              navigate(route);
            }}
          >
            <span className="dash-quick-icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <span className="dash-quick-title">{title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
