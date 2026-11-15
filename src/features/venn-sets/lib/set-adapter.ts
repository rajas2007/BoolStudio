import { tokenize } from '@/lib/parser/tokenizer';
import { parse } from '@/lib/parser/parser';
import { ASTNode } from '@/lib/types/boolean';
import { ParsedSetExpr, SetVarCount } from '../types';
import { evaluateAST } from '@/lib/logic/evaluator';

/**
 * Normalizes postfix complement operators (e.g. A', Aᶜ, (A ∪ B)') into prefix negation (!A).
 */
export function normalizePostfixComplements(expr: string): string {
  let current = expr;

  // Replace superscript c and Unicode complement symbols with prime '
  current = current
    .replace(/ᶜ/g, "'")
    .replace(/\^c\b/gi, "'")
    .replace(/̅/g, "'");

  // Loop to convert parenthesized complements: (expr)' -> !(expr)
  let found = true;
  let iterations = 0;
  while (found && iterations < 15) {
    iterations++;
    const match = current.match(/\(([^()]+)\)'/);
    if (match && match.index !== undefined) {
      current = current.replace(/\(([^()]+)\)'/, '!($1)');
    } else {
      found = false;
    }
  }

  // Convert identifier complements: A' -> !A, B' -> !B
  current = current.replace(/([a-zA-Z0-9_]+)'/g, '!$1');

  return current;
}

/**
 * Adapts set mathematical notation into BoolStudio's Boolean expression grammar.
 */
export function adaptSetToBoolean(rawExpr: string): string {
  if (!rawExpr || rawExpr.trim() === '') {
    return '';
  }

  let s = rawExpr.trim();

  // Handle empty set constants
  s = s.replace(/∅|\\emptyset|\bphi\b|\bPHI\b|\{\}/g, '(A & !A)');

  // Handle universal set constant (when not adjacent to letters)
  s = s.replace(/𝕌/g, '(A | !A)');
  // Standalone 'U' as universal set if preceded or followed by operators or brackets
  s = s.replace(/(^|[\s(&|!^])U([\s)&|!^]|$)/g, '$1(A | !A)$2');

  // Normalize complements first
  s = normalizePostfixComplements(s);

  // Set operators to Boolean operators:
  // Union: ∪, OR, +
  s = s.replace(/∪/g, ' | ');

  // Intersection: ∩, AND, *
  s = s.replace(/∩/g, ' & ');

  // Symmetric Difference: △, Δ, XOR, ⊕, ^
  s = s.replace(/△|Δ|⊕|\bXOR\b/g, ' ^ ');

  // Set Difference: ∖, \, -
  // Replacing " \ " with " & !" works correctly with variables or parenthesized terms
  s = s.replace(/∖|\\/g, ' & !');
  s = s.replace(/\s*-\s*/g, ' & !');

  // Clean redundant whitespace
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

/**
 * Parses a set theory expression and computes which region masks it shades.
 */
export function parseSetExpression(
  expr: string,
  varCount: SetVarCount
): ParsedSetExpr {
  const trimmed = expr.trim();

  if (!trimmed) {
    return {
      originalExpr: expr,
      adaptedBoolExpr: '',
      ast: null,
      variables: [],
      valid: false,
      error: 'Please enter a set expression.',
      shadedMasks: [],
    };
  }

  try {
    const adapted = adaptSetToBoolean(trimmed);
    const { tokens, variables } = tokenize(adapted);

    // Validate that only allowed variables A, B, C (or subsets) are used
    const allowed = varCount === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
    const invalidVars = variables.filter((v) => !allowed.includes(v));

    if (invalidVars.length > 0) {
      return {
        originalExpr: expr,
        adaptedBoolExpr: adapted,
        ast: null,
        variables,
        valid: false,
        error: `Unknown set(s): ${invalidVars.join(', ')}. Please use ${allowed.join(', ')}.`,
        shadedMasks: [],
      };
    }

    const ast: ASTNode = parse(tokens);

    // Evaluate against each region mask
    const totalRegions = Math.pow(2, varCount);
    const shadedMasks: number[] = [];

    for (let mask = 0; mask < totalRegions; mask++) {
      const bindings: Record<string, boolean> = {
        A: Boolean(mask & 1),
        B: Boolean(mask & 2),
      };
      if (varCount === 3) {
        bindings.C = Boolean(mask & 4);
      }

      if (evaluateAST(ast, bindings)) {
        shadedMasks.push(mask);
      }
    }

    return {
      originalExpr: expr,
      adaptedBoolExpr: adapted,
      ast,
      variables,
      valid: true,
      shadedMasks,
    };
  } catch (err) {
    return {
      originalExpr: expr,
      adaptedBoolExpr: '',
      ast: null,
      variables: [],
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid set expression syntax.',
      shadedMasks: [],
    };
  }
}
