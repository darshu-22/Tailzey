/**
 * Push the front of a lofted torso out into a bust (see bustShape.js). Each side is a smooth
 * dome around its apex, (1 − r²)^1.5, which ends in a crease at the fold like the real one.
 * Only front-facing vertices move, along +z in proportion to how much they face forward.
 *
 * `drape` is for garment shells: fabric bridges the cleavage and falls from the apex instead
 * of following the fold, so the shell always stays outside the body.
 */
export function deformBust(geometry, bust, { drape = false } = {}) {
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const { y: apexY, apexX, rx, ryUp, ryDown, projection } = bust;
  const fall = drape ? ryDown * 1.8 : ryDown;

  for (let i = 0; i < position.count; i += 1) {
    const nz = normal.getZ(i);
    if (nz <= 0) continue;
    const across = Math.abs(position.getX(i)) - apexX;
    const dx = drape ? Math.max(0, across) : across;
    const dy = position.getY(i) - apexY;
    const r2 = (dx / rx) ** 2 + (dy / (dy > 0 ? ryUp : fall)) ** 2;
    if (r2 >= 1) continue;
    position.setZ(i, position.getZ(i) + projection * (1 - r2) ** 1.5 * nz);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
