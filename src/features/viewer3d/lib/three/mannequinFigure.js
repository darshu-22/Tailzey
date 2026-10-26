import { BufferAttribute, BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { CLAY, createGarmentMaterial } from './fabricMaterial';

/**
 * The MakeHuman mannequin and everything it wears as Three.js meshes, rebuilt in place from
 * buildMannequin() output. Materials (and their textures) are created once per item and render
 * mode; the garment worn outermost (`front`) is drawn slightly in front, so it wins wherever it
 * lies close to another layer or the skin.
 */

function geometry({ positions, index, normals, uv }) {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(positions, 3));
  if (uv) g.setAttribute('uv', new BufferAttribute(uv, 2));
  g.setIndex(new BufferAttribute(index, 1));
  if (normals) g.setAttribute('normal', new BufferAttribute(normals, 3));
  else g.computeVertexNormals();
  return g;
}

function mesh(g, material) {
  const m = new Mesh(g, material);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function createMannequinFigure({ onChange } = {}) {
  const group = new Group();
  const bodyMaterial = new MeshStandardMaterial({ color: CLAY, roughness: 0.78, metalness: 0 });
  const materials = new Map();

  const clear = () => {
    for (const child of [...group.children]) {
      child.geometry.dispose();
      group.remove(child);
    }
  };

  return {
    group,
    /**
     * @param scene buildMannequin() output.
     * @param looks one per scene garment: { key, mode, texture?, normalMap?, fabricLuminance, colorHex, front }.
     */
    update(scene, looks) {
      clear();
      group.add(mesh(geometry(scene.body), bodyMaterial));
      scene.garments.forEach((arrays, i) => {
        const look = looks[i];
        if (!materials.has(look.key)) materials.set(look.key, createGarmentMaterial(look, onChange));
        const item = materials.get(look.key);
        item.setTint(look.colorHex);
        Object.assign(item.material, { polygonOffset: look.front, polygonOffsetFactor: 0, polygonOffsetUnits: -6 });
        group.add(mesh(geometry(arrays), item.material));
      });
    },
    dispose() {
      clear();
      bodyMaterial.dispose();
      for (const item of materials.values()) item.dispose();
      materials.clear();
    },
  };
}
