import { RegionInfo, SetVarCount } from '../types';

/**
 * Generates descriptive information for each disjoint region in an n-set Venn diagram.
 */
export function getRegionInfoList(varCount: SetVarCount): RegionInfo[] {
  const totalRegions = Math.pow(2, varCount);
  const list: RegionInfo[] = [];

  for (let mask = 0; mask < totalRegions; mask++) {
    const inA = Boolean(mask & 1);
    const inB = Boolean(mask & 2);
    const inC = varCount === 3 ? Boolean(mask & 4) : false;

    let label = '';
    let shortLabel = '';

    if (varCount === 2) {
      if (mask === 0) {
        label = "Outside (A' ∩ B')";
        shortLabel = 'Outside';
      } else if (mask === 1) {
        label = "A ∩ B'";
        shortLabel = 'A only';
      } else if (mask === 2) {
        label = "A' ∩ B";
        shortLabel = 'B only';
      } else if (mask === 3) {
        label = 'A ∩ B';
        shortLabel = 'A ∩ B';
      }
    } else {
      // 3 sets: A, B, C
      const partA = inA ? 'A' : "A'";
      const partB = inB ? 'B' : "B'";
      const partC = inC ? 'C' : "C'";

      label = `${partA} ∩ ${partB} ∩ ${partC}`;

      if (mask === 0) {
        shortLabel = 'Outside';
      } else if (mask === 1) {
        shortLabel = 'A only';
      } else if (mask === 2) {
        shortLabel = 'B only';
      } else if (mask === 4) {
        shortLabel = 'C only';
      } else if (mask === 3) {
        shortLabel = 'A ∩ B only';
      } else if (mask === 5) {
        shortLabel = 'A ∩ C only';
      } else if (mask === 6) {
        shortLabel = 'B ∩ C only';
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

  const regionInfoMap = new Map(getRegionInfoList(varCount).map((r) => [r.mask, r]));

  // If outside is the ONLY unshaded region, it's the union of all sets
  const insideMasks = Array.from({ length: totalRegions - 1 }, (_, i) => i + 1);
  const isAllInside = insideMasks.every((m) => sorted.includes(m)) && !sorted.includes(0);
  if (isAllInside) {
    return varCount === 2 ? 'A ∪ B' : 'A ∪ B ∪ C';
  }

  // Construct canonical sum of minterms / union of disjoint regions
  const terms = sorted.map((mask) => {
    const info = regionInfoMap.get(mask);
    return info ? `(${info.label})` : `Region_${mask}`;
  });

  return terms.join(' ∪ ');
}
