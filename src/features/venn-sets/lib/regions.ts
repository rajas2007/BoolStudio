import { RegionInfo, SetVarCount } from '../types';
import { mintermToBindings } from './evaluator';

/**
 * Generates descriptive information for each disjoint region in an n-set Venn diagram,
 * strictly ordered by minterm index with A as the most significant bit.
 */
export function getRegionInfoList(varCount: SetVarCount): RegionInfo[] {
  const totalRegions = Math.pow(2, varCount);
  const list: RegionInfo[] = [];

  for (let mask = 0; mask < totalRegions; mask++) {
    const bindings = mintermToBindings(mask, varCount);
    const inA = bindings.A;
    const inB = bindings.B;
    const inC = bindings.C;

    let label = '';
    let shortLabel = '';

    if (varCount === 2) {
      const partA = inA ? 'A' : "A'";
      const partB = inB ? 'B' : "B'";
      label = `${partA} ∩ ${partB}`;

      if (mask === 0) {
        shortLabel = 'Outside';
      } else if (mask === 1) {
        shortLabel = 'B only';
      } else if (mask === 2) {
        shortLabel = 'A only';
      } else if (mask === 3) {
        shortLabel = 'A ∩ B';
      }
    } else {
      // 3 sets: A as MSB, B as middle, C as LSB
      const partA = inA ? 'A' : "A'";
      const partB = inB ? 'B' : "B'";
      const partC = inC ? 'C' : "C'";
      label = `${partA} ∩ ${partB} ∩ ${partC}`;

      if (mask === 0) {
        shortLabel = 'Outside';
      } else if (mask === 1) {
        shortLabel = 'C only';
      } else if (mask === 2) {
        shortLabel = 'B only';
      } else if (mask === 3) {
        shortLabel = 'B ∩ C only';
      } else if (mask === 4) {
        shortLabel = 'A only';
      } else if (mask === 5) {
        shortLabel = 'A ∩ C only';
      } else if (mask === 6) {
        shortLabel = 'A ∩ B only';
      } else if (mask === 7) {
        shortLabel = 'A ∩ B ∩ C';
      }
    }

    const binaryString = mask.toString(2).padStart(varCount, '0');

    list.push({
      mask,
      label,
      shortLabel,
      mintermIndex: mask,
      binaryString,
      inA,
      inB,
      inC,
    });
  }

  return list;
}

/**
 * Formats a set of shaded region masks into canonical set notation.
 */
export function formatCanonicalExpression(
  shadedMasks: number[],
  varCount: SetVarCount
): string {
  const totalRegions = Math.pow(2, varCount);
  const sorted = [...shadedMasks].filter((m) => m >= 0 && m < totalRegions).sort((a, b) => a - b);

  if (sorted.length === 0) {
    return '∅ (Empty Set)';
  }

  if (sorted.length === totalRegions) {
    return 'U (Universal Set)';
  }

  // If outside is the ONLY unshaded region, it is the union of all sets
  const insideMasks = Array.from({ length: totalRegions - 1 }, (_, i) => i + 1);
  const isAllInside = insideMasks.every((m) => sorted.includes(m)) && !sorted.includes(0);
  if (isAllInside) {
    return varCount === 2 ? 'A ∪ B' : 'A ∪ B ∪ C';
  }

  const regionInfoMap = new Map(getRegionInfoList(varCount).map((r) => [r.mask, r]));

  const terms = sorted.map((mask) => {
    const info = regionInfoMap.get(mask);
    return info ? `(${info.label})` : `m${mask}`;
  });

  return terms.join(' ∪ ');
}
