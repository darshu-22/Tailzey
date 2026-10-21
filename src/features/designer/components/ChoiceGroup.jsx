import { useId } from 'react';

/**
 * One labelled single-choice group of the designer, built on native radio inputs so
 * keyboard (arrow keys), screen readers and form semantics all work out of the box.
 * Compact by design: the heading line shows "Title · <selected value or its subtext>",
 * and option subtexts are kept as accessible descriptions and hover titles.
 * @param {'tiles'|'swatches'|'chips'} props.variant option layout
 * @param {Array<{id, label, subtext?, visual?}>} props.options
 * @param {string} [props.error] server validation message for this field
 */
export default function ChoiceGroup({ title, options, value, onChange, variant = 'chips', error }) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const errorId = error ? `${uid}-error` : undefined;
  const selected = options.find((o) => o.id === value);
  const hideLabel = variant === 'swatches';
  const headValue = hideLabel ? selected?.label : selected?.subtext;

  return (
    <section className={`designer-choice designer-choice-${variant}`} aria-labelledby={headingId}>
      <h2 className="designer-choice-head">
        <span id={headingId} className="designer-choice-title">
          {title}
        </span>
        {headValue && <span className="designer-choice-value"> · {headValue}</span>}
      </h2>

      <div className="designer-choice-options" role="radiogroup" aria-labelledby={headingId} aria-describedby={errorId}>
        {options.map((option) => {
          const inputId = `${uid}-${option.id}`;
          const subId = option.subtext ? `${inputId}-sub` : undefined;
          return (
            <div key={option.id} className="designer-choice-item">
              <input
                type="radio"
                id={inputId}
                name={uid}
                value={option.id}
                checked={option.id === value}
                onChange={() => onChange(option.id)}
                className="designer-choice-input"
                aria-describedby={subId}
              />
              <label
                htmlFor={inputId}
                className="designer-choice-label"
                title={hideLabel ? option.label : option.subtext}
              >
                {option.visual}
                <span className={hideLabel ? 'sr-only' : 'designer-choice-name'}>{option.label}</span>
              </label>
              {option.subtext && (
                <span id={subId} className="sr-only">
                  {option.subtext}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p id={errorId} className="designer-field-error">
          {error}
        </p>
      )}
    </section>
  );
}
