import { DoubleSide, Group, Mesh, MeshStandardMaterial } from 'three';
import { bodyDimensions } from '../bodyDimensions';
import { buildBodyParts } from './bodyGeometry';
import { buildGarmentParts } from './garmentGeometry';

/**
 * The mannequin plus the garment shell, as one group that can be rebuilt in place.
 * Materials live for the whole studio; geometries are disposed on every rebuild.
 */

const BODY_COLOR = '#d9d4cc';

function toMesh(part, material) {
  const mesh = new Mesh(part.geometry, material);
  if (part.position) mesh.position.set(...part.position);
  if (part.rotationZ) mesh.rotation.z = part.rotationZ;
  if (part.scale) mesh.scale.set(...part.scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function disposeChildren(group) {
  for (const child of [...group.children]) {
    child.geometry?.dispose();
    group.remove(child);
  }
}

export function createFigure() {
  const group = new Group();
  const bodyMaterial = new MeshStandardMaterial({ color: BODY_COLOR, roughness: 0.82, metalness: 0 });
  const garmentMaterial = new MeshStandardMaterial({ roughness: 0.92, metalness: 0, side: DoubleSide });
  let dims = null;

  return {
    group,
    /** Rebuild from resolved body centimetres and a garmentSpec(); returns the dimensions used. */
    update(bodyCm, spec) {
      disposeChildren(group);
      dims = bodyDimensions(bodyCm);
      for (const part of buildBodyParts(dims)) group.add(toMesh(part, bodyMaterial));
      if (spec) {
        garmentMaterial.color.set(spec.colorHex);
        for (const part of buildGarmentParts(dims, spec)) group.add(toMesh(part, garmentMaterial));
      }
      return dims;
    },
    get dimensions() {
      return dims;
    },
    dispose() {
      disposeChildren(group);
      bodyMaterial.dispose();
      garmentMaterial.dispose();
    },
  };
}
