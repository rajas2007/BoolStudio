import { RegionMask, RegionShading, SetVarCount } from '../types';

/**
 * Converts a list of active mask numbers into a complete RegionShading map.
 */
export function masksToShadingMap(
  masks: number[],
  varCount: SetVarCount
): RegionShading {
  const total = Math.pow(2, varCount);
  const result: RegionShading = {};
  for (let i = 0; i < total; i++) {
    result[i] = masks.includes(i);
  }
  return result;
}

/**
 * Extracts all shaded mask indices from a RegionShading map.
 */
export function shadingMapToMasks(
  shading: RegionShading,
  varCount: SetVarCount
): number[] {
  const total = Math.pow(2, varCount);
  const result: number[] = [];
  for (let i = 0; i < total; i++) {
    if (shading[i]) {
      result.push(i);
    }
  }
  return result;
}

/**
 * Toggles a single region's shaded state.
 */
export function toggleRegion(
  current: RegionShading,
  mask: RegionMask
): RegionShading {
  return {
    ...current,
    [mask]: !current[mask],
  };
}

/**
 * Returns an empty shading map with all regions inactive.
 */
export function clearShading(varCount: SetVarCount): RegionShading {
  const total = Math.pow(2, varCount);
  const result: RegionShading = {};
  for (let i = 0; i < total; i++) {
    result[i] = false;
  }
  return result;
}

/**
 * Returns a shading map with all regions active (Universal Set).
 */
export function fillAllShading(varCount: SetVarCount): RegionShading {
  const total = Math.pow(2, varCount);
  const result: RegionShading = {};
  for (let i = 0; i < total; i++) {
    result[i] = true;
  }
  return result;
}

/**
 * Inverts the shading state of all regions (Complement).
 */
export function invertShading(
  current: RegionShading,
  varCount: SetVarCount
): RegionShading {
  const total = Math.pow(2, varCount);
  const result: RegionShading = {};
  for (let i = 0; i < total; i++) {
    result[i] = !current[i];
  }
  return result;
}
