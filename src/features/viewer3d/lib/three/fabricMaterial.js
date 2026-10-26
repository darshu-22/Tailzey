import { Color, DoubleSide, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace, TextureLoader } from 'three';

/**
 * Materials for what the mannequin wears, by render mode:
 * - fabric: the garment's texture with its main fabric recoloured. The texture's alpha (128–255)
 *   marks the fabric, which keeps its weave and folds by scaling the colour with the texture's
 *   luminance relative to the fabric's average;
 * - plain: an untextured fabric (the tailored kurta) with a soft woven sheen;
 * - cutout: hair strands, cut out by the texture's alpha;
 * - original: as modelled (shoes);
 * - clay: the mannequin's own matte finish (eyes).
 */

export const CLAY = '#d9d4cc';
const loader = new TextureLoader();

function load(url, srgb, onLoad) {
  const texture = loader.load(url, onLoad);
  if (srgb) texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const TINT_FRAGMENT = /* glsl */ `
#ifdef USE_MAP
  vec4 texel = texture2D( map, vMapUv );
  float fabric = clamp( texel.a * 2.0 - 1.0, 0.0, 1.0 );
  float luminance = dot( texel.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
  vec3 tinted = tintColor * clamp( luminance / fabricLuminance, 0.0, 1.8 );
  diffuseColor.rgb *= mix( texel.rgb, tinted, fabric );
#endif`;

function fabric(look, onLoad, tint) {
  const material = new MeshStandardMaterial({
    map: load(look.texture, true, onLoad),
    normalMap: look.normalMap ? load(look.normalMap, false, onLoad) : null,
    roughness: 0.9,
    side: DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.tintColor = tint;
    shader.uniforms.fabricLuminance = { value: Math.max(look.fabricLuminance, 0.02) };
    shader.fragmentShader = `uniform vec3 tintColor;\nuniform float fabricLuminance;\n${shader.fragmentShader}`.replace(
      '#include <map_fragment>',
      TINT_FRAGMENT
    );
  };
  return material;
}

function create(look, onLoad, tint) {
  switch (look.mode) {
    case 'fabric':
      return fabric(look, onLoad, tint);
    case 'plain':
      return new MeshPhysicalMaterial({ roughness: 0.82, sheen: 0.6, sheenRoughness: 0.7, side: DoubleSide });
    case 'cutout':
      return new MeshStandardMaterial({
        map: load(look.texture, true, onLoad),
        alphaTest: 0.5,
        alphaToCoverage: true, // soft strand edges with the renderer's antialiasing
        roughness: 0.75,
        side: DoubleSide,
      });
    case 'original':
      return new MeshStandardMaterial({
        map: load(look.texture, true, onLoad),
        normalMap: look.normalMap ? load(look.normalMap, false, onLoad) : null,
        roughness: 0.6,
      });
    default:
      return new MeshStandardMaterial({ color: CLAY, roughness: 0.82 });
  }
}

/** @param look { mode, texture?, normalMap?, fabricLuminance }; onLoad re-renders once a texture arrives. */
export function createGarmentMaterial(look, onLoad) {
  const tint = { value: new Color('#ffffff') };
  const material = create(look, onLoad, tint);
  return {
    material,
    setTint(hex) {
      if (!hex) return;
      if (look.mode === 'fabric') tint.value.set(hex);
      else if (look.mode === 'plain') {
        material.color.set(hex);
        material.sheenColor.set(hex).lerp(new Color('#ffffff'), 0.35);
      }
    },
    dispose() {
      material.map?.dispose();
      material.normalMap?.dispose();
      material.dispose();
    },
  };
}
