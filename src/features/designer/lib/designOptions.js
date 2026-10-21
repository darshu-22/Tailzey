/** Design-name rules (mirror the backend: 1–120 characters). */
export const DESIGN_NAME_MAX = 120;

/** Client-side check mirroring the backend rule (1–120 characters). */
export function validateDesignName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return 'Give your design a name.';
  if (trimmed.length > DESIGN_NAME_MAX) return `Keep the name under ${DESIGN_NAME_MAX} characters.`;
  return null;
}
