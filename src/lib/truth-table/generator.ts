import { ASTNode, TruthTableData, TruthTableRow } from '../types/boolean';
import { evaluateAST } from '../logic/evaluator';

export function generateTruthTable(ast: ASTNode, variables: string[]): TruthTableData {
  if (variables.length === 0) {
    return {
      variables: [],
      rows: [{ id: 0, inputs: {}, output: evaluateAST(ast, {}) }],
    };
  }

  const numVariables = variables.length;
  const numRows = Math.pow(2, numVariables);
  const rows: TruthTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    const inputs: Record<string, boolean> = {};

    for (let j = 0; j < numVariables; j++) {
      const varName = variables[j];
      // Determine bit value (MSB on the left)
      const bitShift = numVariables - 1 - j;
      const bitValue = Boolean((i >> bitShift) & 1);
      inputs[varName] = bitValue;
    }

    const output = evaluateAST(ast, inputs);

    rows.push({
      id: i,
      inputs,
      output,
    });
  }

  return {
    variables,
    rows,
  };
}
