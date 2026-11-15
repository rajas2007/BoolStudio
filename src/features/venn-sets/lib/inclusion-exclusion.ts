import { InclusionExclusionInput, InclusionExclusionResult, RegionMask } from '../types';

/**
 * Validates and computes exact region counts using the Principle of Inclusion-Exclusion.
 */
export function computeInclusionExclusion(
  input: InclusionExclusionInput
): InclusionExclusionResult {
  const violations: string[] = [];
  const varCount = input.varCount;

  // Basic sanity check: non-negative values
  if (input.cardA < 0) violations.push('|A| cannot be negative.');
  if (input.cardB < 0) violations.push('|B| cannot be negative.');
  if (input.cardA_B < 0) violations.push('|A ∩ B| cannot be negative.');
  if (input.universal !== undefined && input.universal < 0) {
    violations.push('Universal set |U| cannot be negative.');
  }

  if (varCount === 2) {
    // 2-Set checks
    if (input.cardA_B > input.cardA) {
      violations.push(`|A ∩ B| (${input.cardA_B}) cannot exceed |A| (${input.cardA}).`);
    }
    if (input.cardA_B > input.cardB) {
      violations.push(`|A ∩ B| (${input.cardA_B}) cannot exceed |B| (${input.cardB}).`);
    }

    const r3 = input.cardA_B;
    const r1 = input.cardA - input.cardA_B;
    const r2 = input.cardB - input.cardA_B;
    const unionCount = input.cardA + input.cardB - input.cardA_B;

    let r0: number | null = null;
    if (input.universal !== undefined) {
      if (input.universal < unionCount) {
        violations.push(
          `Universal set |U| (${input.universal}) cannot be smaller than the union |A ∪ B| (${unionCount}).`
        );
      } else {
        r0 = input.universal - unionCount;
      }
    }

    const regionCounts: Record<RegionMask, number> = {
      0: r0 ?? 0,
      1: r1,
      2: r2,
      3: r3,
    };

    const formulaSymbolic = '|A ∪ B| = |A| + |B| − |A ∩ B|';
    const formulaSubstituted = `|A ∪ B| = ${input.cardA} + ${input.cardB} − ${input.cardA_B}`;
    const formulaEvaluated = `|A ∪ B| = ${unionCount}`;

    const regionDerivations = [
      {
        mask: 3,
        label: 'A ∩ B (Both)',
        equation: `|A ∩ B| = ${r3}`,
        result: r3,
      },
      {
        mask: 1,
        label: "A only (A ∩ B')",
        equation: `|A| − |A ∩ B| = ${input.cardA} − ${r3} = ${r1}`,
        result: r1,
      },
      {
        mask: 2,
        label: "B only (A' ∩ B)",
        equation: `|B| − |A ∩ B| = ${input.cardB} − ${r3} = ${r2}`,
        result: r2,
      },
    ];

    if (r0 !== null && input.universal !== undefined) {
      regionDerivations.unshift({
        mask: 0,
        label: 'Outside (Neither A nor B)',
        equation: `|U| − |A ∪ B| = ${input.universal} − ${unionCount} = ${r0}`,
        result: r0,
      });
    }

    return {
      valid: violations.length === 0,
      violations,
      regionCounts,
      unionCount,
      outsideCount: r0,
      steps: {
        formulaSymbolic,
        formulaSubstituted,
        formulaEvaluated,
        regionDerivations,
      },
    };
  }

  // 3-Set Inclusion-Exclusion
  const cardC = input.cardC ?? 0;
  const cardA_C = input.cardA_C ?? 0;
  const cardB_C = input.cardB_C ?? 0;
  const cardA_B_C = input.cardA_B_C ?? 0;

  if (cardC < 0) violations.push('|C| cannot be negative.');
  if (cardA_C < 0) violations.push('|A ∩ C| cannot be negative.');
  if (cardB_C < 0) violations.push('|B ∩ C| cannot be negative.');
  if (cardA_B_C < 0) violations.push('|A ∩ B ∩ C| cannot be negative.');

  // Pairwise vs single set checks
  if (input.cardA_B > input.cardA) violations.push(`|A ∩ B| (${input.cardA_B}) cannot exceed |A| (${input.cardA}).`);
  if (input.cardA_B > input.cardB) violations.push(`|A ∩ B| (${input.cardA_B}) cannot exceed |B| (${input.cardB}).`);
  if (cardA_C > input.cardA) violations.push(`|A ∩ C| (${cardA_C}) cannot exceed |A| (${input.cardA}).`);
  if (cardA_C > cardC) violations.push(`|A ∩ C| (${cardA_C}) cannot exceed |C| (${cardC}).`);
  if (cardB_C > input.cardB) violations.push(`|B ∩ C| (${cardB_C}) cannot exceed |B| (${input.cardB}).`);
  if (cardB_C > cardC) violations.push(`|B ∩ C| (${cardB_C}) cannot exceed |C| (${cardC}).`);

  // Triple intersection vs pairwise checks
  if (cardA_B_C > input.cardA_B) {
    violations.push(`|A ∩ B ∩ C| (${cardA_B_C}) cannot exceed pairwise intersection |A ∩ B| (${input.cardA_B}).`);
  }
  if (cardA_B_C > cardA_C) {
    violations.push(`|A ∩ B ∩ C| (${cardA_B_C}) cannot exceed pairwise intersection |A ∩ C| (${cardA_C}).`);
  }
  if (cardA_B_C > cardB_C) {
    violations.push(`|A ∩ B ∩ C| (${cardA_B_C}) cannot exceed pairwise intersection |B ∩ C| (${cardB_C}).`);
  }

  // Region calculations from inside out:
  const r7 = cardA_B_C;
  const r3 = input.cardA_B - r7; // A ∩ B only
  const r5 = cardA_C - r7; // A ∩ C only
  const r6 = cardB_C - r7; // B ∩ C only

  const r1 = input.cardA - r3 - r5 - r7; // A only
  const r2 = input.cardB - r3 - r6 - r7; // B only
  const r4 = cardC - r5 - r6 - r7; // C only

  if (r1 < 0) {
    violations.push(
      `Set A contains only ${input.cardA} items, but its shared overlaps require at least ${r3 + r5 + r7}.`
    );
  }
  if (r2 < 0) {
    violations.push(
      `Set B contains only ${input.cardB} items, but its shared overlaps require at least ${r3 + r6 + r7}.`
    );
  }
  if (r4 < 0) {
    violations.push(
      `Set C contains only ${cardC} items, but its shared overlaps require at least ${r5 + r6 + r7}.`
    );
  }

  // Full Inclusion-Exclusion formula for 3 sets:
  // |A ∪ B ∪ C| = (|A| + |B| + |C|) − (|A ∩ B| + |A ∩ C| + |B ∩ C|) + |A ∩ B ∩ C|
  const sumSingles = input.cardA + input.cardB + cardC;
  const sumPairs = input.cardA_B + cardA_C + cardB_C;
  const unionCount = sumSingles - sumPairs + cardA_B_C;

  let r0: number | null = null;
  if (input.universal !== undefined) {
    if (input.universal < unionCount) {
      violations.push(
        `Universal set |U| (${input.universal}) cannot be smaller than the union |A ∪ B ∪ C| (${unionCount}).`
      );
    } else {
      r0 = input.universal - unionCount;
    }
  }

  const regionCounts: Record<RegionMask, number> = {
    0: r0 ?? 0,
    1: r1,
    2: r2,
    3: r3,
    4: r4,
    5: r5,
    6: r6,
    7: r7,
  };

  const formulaSymbolic =
    '|A ∪ B ∪ C| = (|A| + |B| + |C|) − (|A ∩ B| + |A ∩ C| + |B ∩ C|) + |A ∩ B ∩ C|';
  const formulaSubstituted =
    `|A ∪ B ∪ C| = (${input.cardA} + ${input.cardB} + ${cardC}) − (${input.cardA_B} + ${cardA_C} + ${cardB_C}) + ${cardA_B_C}`;
  const formulaEvaluated =
    `|A ∪ B ∪ C| = ${sumSingles} − ${sumPairs} + ${cardA_B_C} = ${unionCount}`;

  const regionDerivations = [
    {
      mask: 7,
      label: 'A ∩ B ∩ C (All three)',
      equation: `|A ∩ B ∩ C| = ${r7}`,
      result: r7,
    },
    {
      mask: 3,
      label: 'A ∩ B only (no C)',
      equation: `|A ∩ B| − |A ∩ B ∩ C| = ${input.cardA_B} − ${r7} = ${r3}`,
      result: r3,
    },
    {
      mask: 5,
      label: 'A ∩ C only (no B)',
      equation: `|A ∩ C| − |A ∩ B ∩ C| = ${cardA_C} − ${r7} = ${r5}`,
      result: r5,
    },
    {
      mask: 6,
      label: 'B ∩ C only (no A)',
      equation: `|B ∩ C| − |A ∩ B ∩ C| = ${cardB_C} − ${r7} = ${r6}`,
      result: r6,
    },
    {
      mask: 1,
      label: 'A only',
      equation: `|A| − (r3 + r5 + r7) = ${input.cardA} − (${r3} + ${r5} + ${r7}) = ${r1}`,
      result: r1,
    },
    {
      mask: 2,
      label: 'B only',
      equation: `|B| − (r3 + r6 + r7) = ${input.cardB} − (${r3} + ${r6} + ${r7}) = ${r2}`,
      result: r2,
    },
    {
      mask: 4,
      label: 'C only',
      equation: `|C| − (r5 + r6 + r7) = ${cardC} − (${r5} + ${r6} + ${r7}) = ${r4}`,
      result: r4,
    },
  ];

  if (r0 !== null && input.universal !== undefined) {
    regionDerivations.unshift({
      mask: 0,
      label: 'Outside (None of A, B, C)',
      equation: `|U| − |A ∪ B ∪ C| = ${input.universal} − ${unionCount} = ${r0}`,
      result: r0,
    });
  }

  return {
    valid: violations.length === 0,
    violations,
    regionCounts,
    unionCount,
    outsideCount: r0,
    steps: {
      formulaSymbolic,
      formulaSubstituted,
      formulaEvaluated,
      regionDerivations,
    },
  };
}
