import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseAndEvaluate } from './evaluator';

describe('Venn & Sets Lab - Tokenizer and Parser Tests', () => {
  it('parses "A U B" without error and recognizes U as union', () => {
    const res = parseAndEvaluate('A U B', 3);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.error, undefined);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [2, 3, 4, 5, 6, 7]);
  });

  it('parses "A ∪ B" identically to "A U B"', () => {
    const res = parseAndEvaluate('A ∪ B', 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [2, 3, 4, 5, 6, 7]);
  });

  it('parses "A ∩ (B ∪ C)" with parentheses and operator precedence', () => {
    const res = parseAndEvaluate('A ∩ (B ∪ C)', 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [5, 6, 7]);
  });

  it('parses "(A ∪ B ∪ C)\'" and shades only the outside universe (m0)', () => {
    const res = parseAndEvaluate("(A ∪ B ∪ C)'", 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks, [0]);
  });

  it('parses "(A ∩ B) \\ C" and shades only A ∩ B only (m6)', () => {
    const res = parseAndEvaluate('(A ∩ B) \\ C', 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks, [6]);
  });

  it('parses "A Δ B" (symmetric difference) correctly', () => {
    const res = parseAndEvaluate('A Δ B', 3);
    assert.strictEqual(res.valid, true);
    // Elements in A or B, but not both: m2 (B only), m3 (BC only), m4 (A only), m5 (AC only)
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [2, 3, 4, 5]);
  });

  it('parses "A\'" and shades all regions not in A (m0, m1, m2, m3)', () => {
    const res = parseAndEvaluate("A'", 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [0, 1, 2, 3]);
  });

  it('parses "Ø" (empty set) and shades zero regions', () => {
    const res = parseAndEvaluate('Ø', 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks, []);
  });

  it('parses standalone "U" (universal set) and shades all 8 regions', () => {
    const res = parseAndEvaluate('U', 3);
    assert.strictEqual(res.valid, true);
    assert.deepStrictEqual(res.shadedMasks, [0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('correctly catches syntax error on "A ∪" and reports exact index', () => {
    const res = parseAndEvaluate('A ∪', 3);
    assert.strictEqual(res.valid, false);
    assert.ok(res.error?.includes("Expected set expression after '∪'"));
    assert.strictEqual(res.errorIndex, 3);
  });

  it('correctly catches syntax error on "(A" (unclosed parenthesis) and reports index', () => {
    const res = parseAndEvaluate('(A', 3);
    assert.strictEqual(res.valid, false);
    assert.ok(res.error?.includes("Unclosed '('"));
    assert.strictEqual(res.errorIndex, 0);
  });

  it('correctly catches syntax error on "A B" (missing operator) and reports index', () => {
    const res = parseAndEvaluate('A B', 3);
    assert.strictEqual(res.valid, false);
    assert.ok(res.error?.includes("Unexpected 'B'"));
    assert.strictEqual(res.errorIndex, 2);
  });
});

describe('Venn & Sets Lab - Hand-Computed Expected Set Evaluations (Unified Evaluator)', () => {
  // 1. A ∪ B on 3 sets: must be A only (m4), B only (m2), A∩B only (m6), A∩C only (m5), B∩C only (m3), A∩B∩C (m7)
  it('Evaluates "A ∪ B" on 3 sets to exactly [2, 3, 4, 5, 6, 7]', () => {
    const res = parseAndEvaluate('A ∪ B', 3);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [2, 3, 4, 5, 6, 7]);
  });

  // 2. A ∩ B on 3 sets: m6 and m7
  it('Evaluates "A ∩ B" on 3 sets to exactly [6, 7]', () => {
    const res = parseAndEvaluate('A ∩ B', 3);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [6, 7]);
  });

  // 3. De Morgan Law: (A ∪ B)' vs A' ∩ B' on 2 sets
  it('Verifies De Morgan (A ∪ B)\' == A\' ∩ B\' on 2 sets', () => {
    const lhs = parseAndEvaluate("(A ∪ B)'", 2);
    const rhs = parseAndEvaluate("A' ∩ B'", 2);
    assert.deepStrictEqual(lhs.shadedMasks, [0]);
    assert.deepStrictEqual(rhs.shadedMasks, [0]);
  });

  // 4. Distributive Law: A ∩ (B ∪ C) == (A ∩ B) ∪ (A ∩ C) on 3 sets
  it('Verifies Distributive A ∩ (B ∪ C) == (A ∩ B) ∪ (A ∩ C) on 3 sets', () => {
    const lhs = parseAndEvaluate('A ∩ (B ∪ C)', 3);
    const rhs = parseAndEvaluate('(A ∩ B) ∪ (A ∩ C)', 3);
    assert.deepStrictEqual(lhs.shadedMasks.sort((a, b) => a - b), [5, 6, 7]);
    assert.deepStrictEqual(rhs.shadedMasks.sort((a, b) => a - b), [5, 6, 7]);
  });

  // 5. Symmetric difference: A Δ B on 2 sets
  it('Evaluates "A Δ B" on 2 sets to B only (m1) and A only (m2)', () => {
    const res = parseAndEvaluate('A Δ B', 2);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [1, 2]);
  });

  // 6. Set Difference: A \ B on 2 sets
  it('Evaluates "A \\ B" on 2 sets to A only (m2)', () => {
    const res = parseAndEvaluate('A \\ B', 2);
    assert.deepStrictEqual(res.shadedMasks, [2]);
  });

  // 7. Relative complement: U \ A on 2 sets
  it('Evaluates "U \\ A" on 2 sets to Outside (m0) and B only (m1)', () => {
    const res = parseAndEvaluate('U \\ A', 2);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [0, 1]);
  });

  // 8. Triple Symmetric Difference: A Δ B Δ C on 3 sets
  // Elements in an odd number of sets: m1 (C), m2 (B), m4 (A), m7 (ABC)
  it('Evaluates "A Δ B Δ C" on 3 sets to [1, 2, 4, 7]', () => {
    const res = parseAndEvaluate('A Δ B Δ C', 3);
    assert.deepStrictEqual(res.shadedMasks.sort((a, b) => a - b), [1, 2, 4, 7]);
  });

  // 9. Absorption Law: A ∪ (A ∩ B) == A on 2 sets
  it('Verifies Absorption A ∪ (A ∩ B) == A on 2 sets', () => {
    const lhs = parseAndEvaluate('A ∪ (A ∩ B)', 2);
    const rhs = parseAndEvaluate('A', 2);
    assert.deepStrictEqual(lhs.shadedMasks.sort((a, b) => a - b), [2, 3]);
    assert.deepStrictEqual(rhs.shadedMasks.sort((a, b) => a - b), [2, 3]);
  });

  // 10. De Morgan Extended: (A ∪ B ∪ C)' == A' ∩ B' ∩ C' on 3 sets
  it('Verifies Extended De Morgan (A ∪ B ∪ C)\' == A\' ∩ B\' ∩ C\' on 3 sets', () => {
    const lhs = parseAndEvaluate("(A ∪ B ∪ C)'", 3);
    const rhs = parseAndEvaluate("A' ∩ B' ∩ C'", 3);
    assert.deepStrictEqual(lhs.shadedMasks, [0]);
    assert.deepStrictEqual(rhs.shadedMasks, [0]);
  });
});
