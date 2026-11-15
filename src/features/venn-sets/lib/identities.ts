import { IdentityPreset, IdentityResult, SetVarCount } from '../types';
import { parseSetExpression } from './set-adapter';
import { getRegionInfoList } from './regions';

export const SET_IDENTITY_PRESETS: IdentityPreset[] = [
  // De Morgan's Laws
  {
    name: "De Morgan's First Law (2 Sets)",
    category: 'De Morgan',
    varCount: 2,
    leftExpr: "(A ∪ B)'",
    rightExpr: "A' ∩ B'",
    description: 'The complement of the union equals the intersection of the complements.',
  },
  {
    name: "De Morgan's Second Law (2 Sets)",
    category: 'De Morgan',
    varCount: 2,
    leftExpr: "(A ∩ B)'",
    rightExpr: "A' ∪ B'",
    description: 'The complement of the intersection equals the union of the complements.',
  },
  {
    name: "De Morgan's Law (3 Sets)",
    category: 'De Morgan',
    varCount: 3,
    leftExpr: "(A ∪ B ∪ C)'",
    rightExpr: "A' ∩ B' ∩ C'",
    description: 'Extended De Morgan across three sets.',
  },

  // Distributive Laws
  {
    name: 'Distributive Law (∩ over ∪)',
    category: 'Distributive',
    varCount: 3,
    leftExpr: 'A ∩ (B ∪ C)',
    rightExpr: '(A ∩ B) ∪ (A ∩ C)',
    description: 'Intersection distributes over union.',
  },
  {
    name: 'Distributive Law (∪ over ∩)',
    category: 'Distributive',
    varCount: 3,
    leftExpr: 'A ∪ (B ∩ C)',
    rightExpr: '(A ∪ B) ∩ (A ∪ C)',
    description: 'Union distributes over intersection.',
  },

  // Absorption Laws
  {
    name: 'Absorption Law (Union with Intersection)',
    category: 'Absorption',
    varCount: 2,
    leftExpr: 'A ∪ (A ∩ B)',
    rightExpr: 'A',
    description: 'Adding a subset to A absorbs into A.',
  },
  {
    name: 'Absorption Law (Intersection with Union)',
    category: 'Absorption',
    varCount: 2,
    leftExpr: 'A ∩ (A ∪ B)',
    rightExpr: 'A',
    description: 'Intersecting A with its superset absorbs into A.',
  },

  // Set Difference
  {
    name: 'Set Difference as Intersection with Complement',
    category: 'Difference',
    varCount: 2,
    leftExpr: 'A \\ B',
    rightExpr: "A ∩ B'",
    description: 'Elements in A that are not in B.',
  },
  {
    name: 'Successive Set Differences',
    category: 'Difference',
    varCount: 3,
    leftExpr: '(A \\ B) \\ C',
    rightExpr: 'A \\ (B ∪ C)',
    description: 'Subtracting B and then C is subtracting their union from A.',
  },

  // Symmetric Difference
  {
    name: 'Symmetric Difference (Disjoint Union Definition)',
    category: 'Symmetric Difference',
    varCount: 2,
    leftExpr: 'A △ B',
    rightExpr: '(A \\ B) ∪ (B \\ A)',
    description: 'Elements belonging to either A or B, but not both.',
  },
  {
    name: 'Symmetric Difference (Union Minus Intersection)',
    category: 'Symmetric Difference',
    varCount: 2,
    leftExpr: 'A △ B',
    rightExpr: '(A ∪ B) \\ (A ∩ B)',
    description: 'The union stripped of the mutual overlap.',
  },

  // Double Complement
  {
    name: 'Double Complement Law',
    category: 'Complement',
    varCount: 2,
    leftExpr: "(A')'",
    rightExpr: 'A',
    description: 'Taking the complement twice returns the original set.',
  },
];

/**
 * Compares two set expressions by evaluating their shaded region bitmasks.
 */
export function compareSetExpressions(
  leftExprStr: string,
  rightExprStr: string,
  varCount: SetVarCount
): IdentityResult {
  const left = parseSetExpression(leftExprStr, varCount);
  const right = parseSetExpression(rightExprStr, varCount);

  if (!left.valid) {
    return {
      leftExpr: leftExprStr,
      rightExpr: rightExprStr,
      leftValid: false,
      rightValid: right.valid,
      equivalent: false,
      leftShaded: [],
      rightShaded: right.shadedMasks,
      distinguishingMasks: [],
      reason: `Left expression error: ${left.error}`,
    };
  }

  if (!right.valid) {
    return {
      leftExpr: leftExprStr,
      rightExpr: rightExprStr,
      leftValid: true,
      rightValid: false,
      equivalent: false,
      leftShaded: left.shadedMasks,
      rightShaded: [],
      distinguishingMasks: [],
      reason: `Right expression error: ${right.error}`,
    };
  }

  const leftSet = new Set(left.shadedMasks);
  const rightSet = new Set(right.shadedMasks);

  // Find distinguishing masks (regions where one is shaded and the other is not)
  const total = Math.pow(2, varCount);
  const distinguishing: number[] = [];

  for (let mask = 0; mask < total; mask++) {
    const inLeft = leftSet.has(mask);
    const inRight = rightSet.has(mask);
    if (inLeft !== inRight) {
      distinguishing.push(mask);
    }
  }

  const equivalent = distinguishing.length === 0;

  // Check if this matches a known preset
  const matchingPreset = SET_IDENTITY_PRESETS.find(
    (p) =>
      p.varCount === varCount &&
      ((p.leftExpr === leftExprStr && p.rightExpr === rightExprStr) ||
        (p.leftExpr === rightExprStr && p.rightExpr === leftExprStr))
  );

  let reason = '';
  if (equivalent) {
    reason = `Identical shading across all ${total} Venn diagram regions. The two expressions represent the exact same set.`;
  } else {
    const regionInfoMap = new Map(getRegionInfoList(varCount).map((r) => [r.mask, r]));
    const exampleMask = distinguishing[0];
    const exampleInfo = regionInfoMap.get(exampleMask);
    const leftHasIt = leftSet.has(exampleMask);
    const whoHas = leftHasIt ? 'left expression shades it but right does not' : 'right expression shades it but left does not';

    reason = `Not equivalent: differs in ${distinguishing.length} region(s). Counterexample: Region "${exampleInfo?.label || exampleMask}" (${whoHas}).`;
  }

  return {
    leftExpr: leftExprStr,
    rightExpr: rightExprStr,
    leftValid: true,
    rightValid: true,
    equivalent,
    leftShaded: left.shadedMasks,
    rightShaded: right.shadedMasks,
    distinguishingMasks: distinguishing,
    reason,
    matchingLaw: matchingPreset?.name,
  };
}
