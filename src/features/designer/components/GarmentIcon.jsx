/** Simple line drawings for the garment picker (stroke uses currentColor, fill a CSS token). */
const ART = {
  't-shirt': {
    body: 'M32 20 L22 28 L14 42 L24 48 L28 40 L28 82 L72 82 L72 40 L76 48 L86 42 L78 28 L68 20 C64 26 36 26 32 20 Z',
    lines: ['M38 22 C44 28 56 28 62 22', 'M28 77 L72 77'],
    dots: [],
  },
  shirt: {
    body: 'M34 18 L20 28 L12 56 L22 58 L26 36 L26 84 L74 84 L74 36 L78 58 L88 56 L80 28 L66 18 Z',
    lines: ['M50 26 L50 84', 'M34 18 L46 26 L50 20 L54 26 L66 18'],
    dots: [34, 46, 58, 70].map((y) => [50, y]),
  },
  jacket: {
    body: 'M32 18 L16 26 L8 64 L20 66 L24 40 L24 84 L76 84 L76 40 L80 66 L92 64 L84 26 L68 18 Z',
    lines: ['M36 18 L46 42 L50 48 L36 34 Z', 'M64 18 L54 42 L50 48 L64 34 Z', 'M50 48 L50 84', 'M28 64 L42 64', 'M58 64 L72 64'],
    dots: [[50, 56]],
  },
  trousers: {
    body: 'M26 18 L74 18 L72 86 L53 86 L50 44 L47 86 L28 86 Z',
    lines: ['M26 24 L74 24', 'M50 24 L50 44', 'M38 30 L38 84', 'M62 30 L62 84'],
    dots: [],
  },
  ethnic: {
    body: 'M34 16 L20 26 L12 60 L22 62 L26 38 L24 88 L76 88 L74 38 L78 62 L88 60 L80 26 L66 16 Z',
    lines: ['M42 14 L58 14 L58 19 L42 19 Z', 'M50 19 L50 88'],
    dots: [27, 35, 43, 51, 59].map((y) => [50, y]),
  },
};

export default function GarmentIcon({ garmentId }) {
  const art = ART[garmentId] || ART.ethnic;
  return (
    <svg viewBox="0 0 100 100" className="designer-garment-icon" aria-hidden="true">
      <path d={art.body} className="designer-garment-icon-body" />
      {art.lines.map((d) => (
        <path key={d} d={d} className="designer-garment-icon-line" />
      ))}
      {art.dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" className="designer-garment-icon-dot" />
      ))}
    </svg>
  );
}
