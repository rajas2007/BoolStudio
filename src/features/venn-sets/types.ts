/**
 * Core type definitions for the Venn & Sets Lab feature.
 */

import { ASTNode } from '@/lib/types/boolean';

export type SetVarCount = 2 | 3;

/**
 * A region in an n-set Venn diagram is represented as an integer bitmask:
 * - Bit 0 (1): element belongs to set A
 * - Bit 1 (2): element belongs to set B
 * - Bit 2 (4): element belongs to set C (in 3-set diagrams)
 *
 * For 2 sets: masks are 0 (outside), 1 (only A), 2 (only B), 3 (A ∩ B).
 * For 3 sets: masks range from 0 (outside) to 7 (A ∩ B ∩ C).
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
  label: string; // e.g. "A ∩ B' ∩ C" or "Outside (U \ (A ∪ B))"
  shortLabel: string; // e.g. "A only", "A ∩ B", "Outside"
  mintermIndex: number;
  binaryString: string; // e.g. "101"
  inA: boolean;
  inB: boolean;
  inC: boolean;
}

/**
 * Result of adapting and parsing a set theory expression.
 */
export interface ParsedSetExpr {
  originalExpr: string;
  adaptedBoolExpr: string;
  ast: ASTNode | null;
  variables: string[];
  valid: boolean;
  error?: string;
  shadedMasks: number[];
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
  | 'manual'
  | 'expression'
  | 'identity'
  | 'inclusion-exclusion'
  | 'word-problems';
