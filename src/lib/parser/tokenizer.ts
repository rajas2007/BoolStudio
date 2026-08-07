import { Token } from '../types/boolean';

export function tokenize(expression: string): { tokens: Token[]; variables: string[] } {
  const tokens: Token[] = [];
  const variableSet = new Set<string>();

  const sanitized = expression
    .replace(/AND/gi, '&')
    .replace(/OR/gi, '|')
    .replace(/NOT/gi, '!')
    .replace(/XOR/gi, '^')
    .replace(/\+/g, '|')
    .replace(/\*/g, '&')
    .replace(/~/g, '!');

  let i = 0;
  while (i < sanitized.length) {
    const char = sanitized[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(', position: i });
      i++;
    } else if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')', position: i });
      i++;
    } else if (['&', '|', '!', '^'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char, position: i });
      i++;
    } else if (/[a-zA-Z]/.test(char)) {
      // Collect identifier/variable name
      let varName = '';
      let startPos = i;
      while (i < sanitized.length && /[a-zA-Z0-9_]/.test(sanitized[i])) {
        varName += sanitized[i];
        i++;
      }
      tokens.push({ type: 'VARIABLE', value: varName, position: startPos });
      variableSet.add(varName);
    } else {
      throw new Error(`Invalid character '${char}' at index ${i + 1}.`);
    }
  }

  // Sort variables alphabetically
  const variables = Array.from(variableSet).sort();
  return { tokens, variables };
}
