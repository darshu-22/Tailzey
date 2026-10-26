import { useId, useRef } from 'react';

const KEY_STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation): roving tabindex,
 * Left/Right (and Up/Down) move between tabs, Home/End jump to the ends.
 * Every panel stays mounted (inactive ones are `hidden`) so form state is never lost.
 * @param {Array<{id, label}>} props.tabs
 * @param {Record<string, React.ReactNode>} props.panels content per tab id
 * @param {string[]} [props.errorTabs] tab ids holding a validation error (marked on the tab)
 */
export default function DesignerTabs({ label, tabs, panels, activeId, onChange, errorTabs = [] }) {
  const uid = useId();
  const tabRefs = useRef({});

  const select = (index) => {
    const tab = tabs[(index + tabs.length) % tabs.length];
    onChange(tab.id);
    tabRefs.current[tab.id]?.focus();
  };

  const handleKeyDown = (event, index) => {
    if (event.key in KEY_STEPS) select(index + KEY_STEPS[event.key]);
    else if (event.key === 'Home') select(0);
    else if (event.key === 'End') select(tabs.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className="designer-tabs">
      <div className="designer-tablist" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId;
          const hasError = errorTabs.includes(tab.id);
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${uid}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`designer-tab${hasError ? ' has-error' : ''}`}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
              {hasError && <span className="sr-only"> (needs attention)</span>}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${uid}-panel-${tab.id}`}
          aria-labelledby={`${uid}-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="designer-tabpanel"
        >
          {panels[tab.id]}
        </div>
      ))}
    </div>
  );
}
