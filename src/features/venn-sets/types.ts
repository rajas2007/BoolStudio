/**
 * Core type definitions for the Venn & Sets Lab feature.
 */

export type SetVarCount = 2 | 3;

/**
 * A region in an n-set Venn diagram is represented as an integer minterm bitmask:
 * Bits are ordered A B C with A as the most significant bit (MSB).
 *
 * For 3 sets (A, B, C):
 * - m0 = 000: A' ∩ B' ∩ C' (Outside)
 * - m1 = 001: A' ∩ B' ∩ C  (C only)
 * - m2 = 010: A' ∩ B ∩ C'  (B only)
 * - m3 = 011: A' ∩ B ∩ C   (B ∩ C only)
 * - m4 = 100: A ∩ B' ∩ C'  (A only)
 * - m5 = 101: A ∩ B' ∩ C   (A ∩ C only)
 * - m6 = 110: A ∩ B ∩ C'   (A ∩ B only)
 * - m7 = 111: A ∩ B ∩ C    (A ∩ B ∩ C)
 *
 * For 2 sets (A, B):
 * - m0 = 00: A' ∩ B' (Outside)
 * - m1 = 01: A' ∩ B  (B only)
 * - m2 = 10: A ∩ B'  (A only)
 * - m3 = 11: A ∩ B   (A ∩ B)
 */
export type RegionMask = number;

/**
 * A mapping of region masks to their shaded (active) state.
 */
export type RegionShading = Record<RegionMask, boolean>;

/**
 * Information describing a single atomic region in the Venn diagram.
 */
export interface RegionInfo {
  mask: RegionMask;
  label: string; // e.g. "A ∩ B' ∩ C" or "A' ∩ B' ∩ C'"
  shortLabel: string; // e.g. "A only", "A ∩ B only", "Outside"
  mintermIndex: number;
  binaryString: string; // e.g. "101"
  inA: boolean;
  inB: boolean;
  inC: boolean;
}

/**
 * AST Node representing a set-theoretic expression.
 */
export type SetASTNode =
  | { type: 'VARIABLE'; name: 'A' | 'B' | 'C' }
  | { type: 'EMPTY_SET' }
  | { type: 'UNIVERSAL_SET' }
  | { type: 'COMPLEMENT'; child: SetASTNode }
  | { type: 'INTERSECTION'; left: SetASTNode; right: SetASTNode }
  | { type: 'UNION'; left: SetASTNode; right: SetASTNode }
  | { type: 'DIFFERENCE'; left: SetASTNode; right: SetASTNode }
  | { type: 'SYMMETRIC_DIFFERENCE'; left: SetASTNode; right: SetASTNode };

/**
 * Result of parsing and evaluating a set expression.
 */
export interface ParsedSetExpr {
  originalExpr: string;
  normalizedExpr: string;
  ast: SetASTNode | null;
  variables: string[];
  valid: boolean;
  error?: string;
  errorIndex?: number;
  shadedMasks: number[];
  plainEnglish: string;
}

/**
 * Result of comparing two set expressions for logical identity/equivalence.
 */
export interface IdentityResult {
  leftExpr: string;
  rightExpr: string;
  leftValid: boolean;
  rightValid: boolean;
  equivalent: boolean;
  leftShaded: number[];
  rightShaded: number[];
  distinguishingMasks: number[];
  reason: string;
  matchingLaw?: string;
}

/**
 * Known preset set identity for demonstration.
 */
export interface IdentityPreset {
  name: string;
  category: 'De Morgan' | 'Distributive' | 'Absorption' | 'Difference' | 'Symmetric Difference' | 'Complement' | 'Identity';
  varCount: SetVarCount;
  leftExpr: string;
  rightExpr: string;
  description: string;
}

/**
 * Raw cardinalities input for Principle of Inclusion-Exclusion calculation.
 */
export interface InclusionExclusionInput {
  varCount: SetVarCount;
  universal?: number;
  cardA: number;
  cardB: number;
  cardC?: number;
  cardA_B: number;
  cardA_C?: number;
  cardB_C?: number;
  cardA_B_C?: number;
}

/**
 * Formatted step-by-step breakdown for inclusion-exclusion calculation.
 */
export interface InclusionExclusionSteps {
  formulaSymbolic: string;
  formulaSubstituted: string;
  formulaEvaluated: string;
  regionDerivations: Array<{
    mask: RegionMask;
    label: string;
    equation: string;
    result: number;
  }>;
}

/**
 * Evaluated result of Principle of Inclusion-Exclusion.
 */
export interface InclusionExclusionResult {
  valid: boolean;
  violations: string[];
  regionCounts: Record<RegionMask, number>;
  unionCount: number;
  outsideCount: number | null;
  steps: InclusionExclusionSteps;
}

/**
 * A curated real-world word problem scenario.
 */
export interface WordProblem {
  id: string;
  title: string;
  category: string;
  description: string;
  varCount: SetVarCount;
  setNames: { A: string; B: string; C?: string };
  inputs: InclusionExclusionInput;
  targetQuestion: string;
  targetRegionMasks: number[];
  expectedAnswer: number;
  explanation: string;
}

/**
 * Top-level view tabs inside the Venn & Sets Lab.
 */
export type VennLabTab =
  | 'expression'
  | 'manual'
  | 'identity'
  | 'inclusion-exclusion'
  | 'word-problems';
