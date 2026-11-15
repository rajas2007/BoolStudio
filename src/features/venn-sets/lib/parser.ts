import { SetASTNode } from '../types';

export type SetTokenType =
  | 'VAR'
  | 'EMPTY_SET'
  | 'UNIVERSAL_SET'
  | 'UNION'
  | 'INTERSECTION'
  | 'DIFFERENCE'
  | 'SYM_DIFF'
  | 'POSTFIX_COMP'
  | 'PREFIX_COMP'
  | 'LPAREN'
  | 'RPAREN';

export interface SetToken {
  type: SetTokenType;
  value: string;
  originalIndex: number;
  originalLength: number;
}

export class ParseError extends Error {
  originalIndex: number;

  constructor(message: string, originalIndex: number) {
    super(message);
    this.name = 'ParseError';
    this.originalIndex = originalIndex;
  }
}

/**
 * Tokenizes a raw set expression string into a sequence of strongly-typed tokens
 * with exact character offsets from the original string.
 */
export function tokenizeSetExpression(rawExpr: string): SetToken[] {
  const tokens: SetToken[] = [];
  let i = 0;
  const n = rawExpr.length;

  while (i < n) {
    const char = rawExpr[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }

    // Complements: postfix (' or ᶜ) vs prefix (! or ~)
    if (char === "'" || char === 'ᶜ' || char === '’') {
      tokens.push({ type: 'POSTFIX_COMP', value: "'", originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }
    if (char === '!' || char === '~') {
      tokens.push({ type: 'PREFIX_COMP', value: '!', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }

    // Difference: \ or -
    if (char === '\\' || char === '∖' || char === '-') {
      tokens.push({ type: 'DIFFERENCE', value: '\\', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }

    // Symmetric Difference: Δ, △, or ^^
    if (char === 'Δ' || char === '△') {
      tokens.push({ type: 'SYM_DIFF', value: 'Δ', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }
    if (rawExpr.startsWith('^^', i)) {
      tokens.push({ type: 'SYM_DIFF', value: '^^', originalIndex: i, originalLength: 2 });
      i += 2;
      continue;
    }

    // Union: ∪ or |
    if (char === '∪' || char === '|') {
      tokens.push({ type: 'UNION', value: '∪', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }

    // Intersection: ∩ or & or ^ (single ^)
    if (char === '∩' || char === '&' || char === '^') {
      tokens.push({ type: 'INTERSECTION', value: '∩', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }

    // Multi-character keywords: "union", "and", "phi"
    const remaining = rawExpr.slice(i);
    const wordUnionMatch = remaining.match(/^union\b/i);
    if (wordUnionMatch) {
      tokens.push({ type: 'UNION', value: '∪', originalIndex: i, originalLength: wordUnionMatch[0].length });
      i += wordUnionMatch[0].length;
      continue;
    }

    const wordAndMatch = remaining.match(/^and\b/i);
    if (wordAndMatch) {
      tokens.push({ type: 'INTERSECTION', value: '∩', originalIndex: i, originalLength: wordAndMatch[0].length });
      i += wordAndMatch[0].length;
      continue;
    }

    const wordPhiMatch = remaining.match(/^phi\b/i);
    if (wordPhiMatch) {
      tokens.push({ type: 'EMPTY_SET', value: 'Ø', originalIndex: i, originalLength: wordPhiMatch[0].length });
      i += wordPhiMatch[0].length;
      continue;
    }

    // Empty set constants: Ø, ø, ∅, {}
    if (char === 'Ø' || char === 'ø' || char === '∅') {
      tokens.push({ type: 'EMPTY_SET', value: 'Ø', originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }
    if (rawExpr.startsWith('{}', i)) {
      tokens.push({ type: 'EMPTY_SET', value: 'Ø', originalIndex: i, originalLength: 2 });
      i += 2;
      continue;
    }

    // Variable Operands: A, B, C (case-insensitive)
    if (/^[a-cA-C]$/.test(char)) {
      const upper = char.toUpperCase();
      tokens.push({ type: 'VAR', value: upper, originalIndex: i, originalLength: 1 });
      i++;
      continue;
    }

    // 'U' or 'u': Disambiguate between Union operator and Universal set operand!
    if (char === 'U' || char === 'u') {
      const lastToken = tokens[tokens.length - 1];
      const isPrecededByOperand =
        lastToken &&
        (lastToken.type === 'VAR' ||
          lastToken.type === 'EMPTY_SET' ||
          lastToken.type === 'UNIVERSAL_SET' ||
          lastToken.type === 'RPAREN' ||
          lastToken.type === 'POSTFIX_COMP');

      if (isPrecededByOperand) {
        // e.g. "A U B", "(A) U B", "A' U B" -> UNION operator
        tokens.push({ type: 'UNION', value: '∪', originalIndex: i, originalLength: 1 });
      } else {
        // e.g. "U \ A", "(U)", "A ∪ U", standalone "U" -> UNIVERSAL_SET operand
        tokens.push({ type: 'UNIVERSAL_SET', value: 'U', originalIndex: i, originalLength: 1 });
      }
      i++;
      continue;
    }

    // Unknown symbol
    throw new ParseError(`Unknown symbol '${char}' at index ${i + 1}.`, i);
  }

  return tokens;
}

/**
 * Parses a set expression into an AST with operator precedence:
 * Complement (') > Intersection (∩) > Union (∪) = Difference (\) = Symmetric Difference (Δ).
 * All binary operators are left-associative.
 */
export function parseSetTokens(tokens: SetToken[], rawLength: number): SetASTNode {
  if (tokens.length === 0) {
    throw new ParseError('Please enter a set expression.', 0);
  }

  let current = 0;

  function peek(): SetToken | undefined {
    return tokens[current];
  }

  function consume(): SetToken {
    const t = tokens[current];
    current++;
    return t;
  }

  // Expr -> UnionDifferenceExpr
  function parseExpr(): SetASTNode {
    return parseUnionDiff();
  }

  // UnionDiff -> Intersection ( ('∪' | '\' | 'Δ') Intersection )*
  function parseUnionDiff(): SetASTNode {
    let left = parseIntersection();

    while (
      peek() &&
      (peek()!.type === 'UNION' ||
        peek()!.type === 'DIFFERENCE' ||
        peek()!.type === 'SYM_DIFF')
    ) {
      const op = consume();
      if (!peek()) {
        throw new ParseError(
          `Expected set expression after '${op.value}' at index ${op.originalIndex + op.originalLength + 1}.`,
          op.originalIndex + op.originalLength
        );
      }
      const right = parseIntersection();
      if (op.type === 'UNION') {
        left = { type: 'UNION', left, right };
      } else if (op.type === 'DIFFERENCE') {
        left = { type: 'DIFFERENCE', left, right };
      } else {
        left = { type: 'SYMMETRIC_DIFFERENCE', left, right };
      }
    }

    return left;
  }

  // Intersection -> Complement ( '∩' Complement )*
  function parseIntersection(): SetASTNode {
    let left = parseComplement();

    while (peek() && peek()!.type === 'INTERSECTION') {
      const op = consume();
      if (!peek()) {
        throw new ParseError(
          `Expected set expression after '${op.value}' at index ${op.originalIndex + op.originalLength + 1}.`,
          op.originalIndex + op.originalLength
        );
      }
      const right = parseComplement();
      left = { type: 'INTERSECTION', left, right };
    }

    return left;
  }

  // Complement -> Primary ('\'* (postfix complement))
  function parseComplement(): SetASTNode {
    let expr = parsePrimary();

    while (peek() && peek()!.type === 'POSTFIX_COMP') {
      consume();
      expr = { type: 'COMPLEMENT', child: expr };
    }

    return expr;
  }

  // Primary -> PrefixComplement | VAR | EMPTY_SET | UNIVERSAL_SET | '(' Expr ')'
  function parsePrimary(): SetASTNode {
    const token = peek();

    if (!token) {
      throw new ParseError('Unexpected end of expression.', rawLength);
    }

    // Prefix complement: !A or ~A
    if (token.type === 'PREFIX_COMP') {
      consume();
      const child = parseComplement();
      return { type: 'COMPLEMENT', child };
    }

    // Variable
    if (token.type === 'VAR') {
      consume();
      return { type: 'VARIABLE', name: token.value as 'A' | 'B' | 'C' };
    }

    // Empty Set constant
    if (token.type === 'EMPTY_SET') {
      consume();
      return { type: 'EMPTY_SET' };
    }

    // Universal Set constant
    if (token.type === 'UNIVERSAL_SET') {
      consume();
      return { type: 'UNIVERSAL_SET' };
    }

    // Parenthesized expression: '(' Expr ')'
    if (token.type === 'LPAREN') {
      const openToken = consume();
      const inner = parseExpr();
      const closing = peek();
      if (!closing || closing.type !== 'RPAREN') {
        throw new ParseError(
          `Unclosed '(' starting at index ${openToken.originalIndex + 1}.`,
          openToken.originalIndex
        );
      }
      consume(); // consume ')'
      return inner;
    }

    throw new ParseError(
      `Unexpected token '${token.value}' at index ${token.originalIndex + 1}.`,
      token.originalIndex
    );
  }

  const ast = parseExpr();

  // If there are unconsumed tokens, flag missing operator (e.g. "A B")
  if (current < tokens.length) {
    const extra = tokens[current];
    throw new ParseError(
      `Unexpected '${extra.value}' at index ${extra.originalIndex + 1}; expected operator between sets.`,
      extra.originalIndex
    );
  }

  return ast;
}
