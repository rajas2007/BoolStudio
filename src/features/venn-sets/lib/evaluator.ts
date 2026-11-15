import { ParsedSetExpr, SetASTNode, SetVarCount } from '../types';
import { parseSetTokens, tokenizeSetExpression, ParseError } from './parser';

/**
 * Maps an integer minterm mask to set membership boolean flags.
 * Minterm ordering (MSB to LSB):
 * - 3 Sets: A = Bit 2 (4), B = Bit 1 (2), C = Bit 0 (1)
 * - 2 Sets: A = Bit 1 (2), B = Bit 0 (1)
 */
export function mintermToBindings(
  mask: number,
  varCount: SetVarCount
): Record<'A' | 'B' | 'C', boolean> {
  if (varCount === 2) {
    return {
      A: Boolean((mask >> 1) & 1),
      B: Boolean(mask & 1),
      C: false,
    };
  }

  return {
    A: Boolean((mask >> 2) & 1),
    B: Boolean((mask >> 1) & 1),
    C: Boolean(mask & 1),
  };
}

/**
 * Single source of truth: evaluates an AST against specific set membership values.
 */
export function evaluateSetAST(
  node: SetASTNode,
  values: Record<'A' | 'B' | 'C', boolean>
): boolean {
  switch (node.type) {
    case 'VARIABLE':
      return values[node.name];
    case 'EMPTY_SET':
      return false;
    case 'UNIVERSAL_SET':
      return true;
    case 'COMPLEMENT':
      return !evaluateSetAST(node.child, values);
    case 'INTERSECTION':
      return evaluateSetAST(node.left, values) && evaluateSetAST(node.right, values);
    case 'UNION':
      return evaluateSetAST(node.left, values) || evaluateSetAST(node.right, values);
    case 'DIFFERENCE':
      return evaluateSetAST(node.left, values) && !evaluateSetAST(node.right, values);
    case 'SYMMETRIC_DIFFERENCE':
      return evaluateSetAST(node.left, values) !== evaluateSetAST(node.right, values);
  }
}

/**
 * Evaluates the parsed AST across all 2^n minterm regions and returns the array of shaded masks.
 */
export function getShadedMinterms(ast: SetASTNode, varCount: SetVarCount): number[] {
  const total = Math.pow(2, varCount);
  const shaded: number[] = [];

  for (let mask = 0; mask < total; mask++) {
    const bindings = mintermToBindings(mask, varCount);
    if (evaluateSetAST(ast, bindings)) {
      shaded.push(mask);
    }
  }

  return shaded;
}

/**
 * Extracts variable names used in the AST.
 */
export function extractVariables(node: SetASTNode): string[] {
  const vars = new Set<string>();

  function walk(n: SetASTNode) {
    if (n.type === 'VARIABLE') {
      vars.add(n.name);
    } else if (n.type === 'COMPLEMENT') {
      walk(n.child);
    } else if (
      n.type === 'INTERSECTION' ||
      n.type === 'UNION' ||
      n.type === 'DIFFERENCE' ||
      n.type === 'SYMMETRIC_DIFFERENCE'
    ) {
      walk(n.left);
      walk(n.right);
    }
  }

  walk(node);
  return Array.from(vars).sort();
}

/**
 * Translates a SetASTNode into clean, natural plain English.
 */
export function toPlainEnglish(node: SetASTNode): string {
  function describe(n: SetASTNode): string {
    switch (n.type) {
      case 'VARIABLE':
        return n.name;
      case 'EMPTY_SET':
        return 'the empty set (no elements)';
      case 'UNIVERSAL_SET':
        return 'the universal set (all elements)';
      case 'COMPLEMENT':
        if (n.child.type === 'VARIABLE') {
          return `elements not in ${n.child.name}`;
        }
        return `elements outside of (${describe(n.child)})`;
      case 'INTERSECTION':
        return `elements in both ${describe(n.left)} and ${describe(n.right)}`;
      case 'UNION':
        return `elements in ${describe(n.left)}, or ${describe(n.right)}, or both`;
      case 'DIFFERENCE':
        return `elements in ${describe(n.left)} that are not in ${describe(n.right)}`;
      case 'SYMMETRIC_DIFFERENCE':
        return `elements in either ${describe(n.left)} or ${describe(n.right)}, but not both`;
    }
  }

  return describe(node);
}

/**
 * Parses and evaluates a set expression with the single source of truth evaluator.
 */
export function parseAndEvaluate(
  rawExpr: string,
  varCount: SetVarCount
): ParsedSetExpr {
  const trimmed = rawExpr.trim();

  if (!trimmed) {
    return {
      originalExpr: rawExpr,
      normalizedExpr: '',
      ast: null,
      variables: [],
      valid: false,
      error: 'Enter a set expression above.',
      shadedMasks: [],
      plainEnglish: '',
    };
  }

  try {
    const tokens = tokenizeSetExpression(trimmed);
    const ast = parseSetTokens(tokens, trimmed.length);
    const variables = extractVariables(ast);

    // Validate variables against active set count
    const allowed = varCount === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
    const invalid = variables.filter((v) => !allowed.includes(v));

    if (invalid.length > 0) {
      return {
        originalExpr: rawExpr,
        normalizedExpr: trimmed,
        ast: null,
        variables,
        valid: false,
        error: `Unknown set '${invalid.join(', ')}'. Active diagram has: ${allowed.join(', ')}.`,
        shadedMasks: [],
        plainEnglish: '',
      };
    }

    const shadedMasks = getShadedMinterms(ast, varCount);
    const plainEnglish = toPlainEnglish(ast);

    return {
      originalExpr: rawExpr,
      normalizedExpr: trimmed,
      ast,
      variables,
      valid: true,
      shadedMasks,
      plainEnglish,
    };
  } catch (err) {
    if (err instanceof ParseError) {
      return {
        originalExpr: rawExpr,
        normalizedExpr: trimmed,
        ast: null,
        variables: [],
        valid: false,
        error: err.message,
        errorIndex: err.originalIndex,
        shadedMasks: [],
        plainEnglish: '',
      };
    }

    return {
      originalExpr: rawExpr,
      normalizedExpr: trimmed,
      ast: null,
      variables: [],
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid set expression syntax.',
      shadedMasks: [],
      plainEnglish: '',
    };
  }
}
