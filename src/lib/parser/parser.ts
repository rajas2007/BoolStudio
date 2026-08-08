import { Token, ASTNode } from '../types/boolean';
import { tokenize } from './tokenizer';

export function parse(tokens: Token[]): ASTNode {
  if (tokens.length === 0) {
    throw new Error('Expression is empty. Please enter a valid Boolean expression.');
  }

  let current = 0;

  function peek(): Token | undefined {
    return tokens[current];
  }

  function consume(): Token {
    const t = tokens[current];
    current++;
    return t;
  }

  // IffExpr -> ImpliesExpr (('<=>') ImpliesExpr)*
  function parseIff(): ASTNode {
    let left = parseImplies();

    while (peek() && peek()?.type === 'OPERATOR' && peek()?.value === '<=>') {
      consume(); // consume '<=>'
      const right = parseImplies();
      left = { type: 'IFF', left, right };
    }

    return left;
  }

  // ImpliesExpr -> OrExpr ('->' OrExpr)*
  function parseImplies(): ASTNode {
    let left = parseOr();

    while (peek() && peek()?.type === 'OPERATOR' && peek()?.value === '->') {
      consume(); // consume '->'
      const right = parseOr();
      left = { type: 'IMPLIES', left, right };
    }

    return left;
  }

  // OrExpr -> XorExpr (('|' | 'NOR') XorExpr)*
  function parseOr(): ASTNode {
    let left = parseXor();

    while (peek() && peek()?.type === 'OPERATOR' && (peek()?.value === '|' || peek()?.value === 'NOR')) {
      const op = consume().value;
      const right = parseXor();
      left = { type: op === '|' ? 'OR' : 'NOR', left, right };
    }

    return left;
  }

  // XorExpr -> AndExpr (('^' | 'XNOR') AndExpr)*
  function parseXor(): ASTNode {
    let left = parseAnd();

    while (peek() && peek()?.type === 'OPERATOR' && (peek()?.value === '^' || peek()?.value === 'XNOR')) {
      const op = consume().value;
      const right = parseAnd();
      left = { type: op === '^' ? 'XOR' : 'XNOR', left, right };
    }

    return left;
  }

  // AndExpr -> UnaryExpr (('&' | 'NAND') UnaryExpr)*
  function parseAnd(): ASTNode {
    let left = parseUnary();

    while (peek() && peek()?.type === 'OPERATOR' && (peek()?.value === '&' || peek()?.value === 'NAND')) {
      const op = consume().value;
      const right = parseUnary();
      left = { type: op === '&' ? 'AND' : 'NAND', left, right };
    }

    return left;
  }

  // UnaryExpr -> '!' UnaryExpr | PrimaryExpr
  function parseUnary(): ASTNode {
    if (peek() && peek()?.type === 'OPERATOR' && peek()?.value === '!') {
      consume(); // consume '!'
      const child = parseUnary();
      return { type: 'NOT', child };
    }
    return parsePrimary();
  }

  // PrimaryExpr -> VARIABLE | '(' Expression ')'
  function parsePrimary(): ASTNode {
    const token = peek();

    if (!token) {
      throw new Error('Unexpected end of expression.');
    }

    if (token.type === 'VARIABLE') {
      consume();
      return { type: 'VARIABLE', name: token.value };
    }

    if (token.type === 'LPAREN') {
      consume(); // consume '('
      const expr = parseIff();
      const nextToken = peek();
      if (!nextToken || nextToken.type !== 'RPAREN') {
        throw new Error('Missing closing parenthesis \')\'.');
      }
      consume(); // consume ')'
      return expr;
    }

    if (token.type === 'OPERATOR') {
      throw new Error(`Unexpected operator '${token.value}' at index ${token.position + 1}.`);
    }

    throw new Error(`Syntax error near '${token.value}'.`);
  }

  const ast = parseIff();

  if (current < tokens.length) {
    const extra = tokens[current];
    throw new Error(`Unexpected token '${extra.value}' at index ${extra.position + 1}.`);
  }

  return ast;
}

export function parseExpression(expressionString: string): { ast: ASTNode; variables: string[] } {
  const { tokens, variables } = tokenize(expressionString);
  const ast = parse(tokens);
  return { ast, variables };
}
