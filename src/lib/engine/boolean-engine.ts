import { BooleanAnalysisResult } from '../types/boolean';
import { parseExpression } from '../parser/parser';
import { generateTruthTable } from '../truth-table/generator';
import { generateKMap } from '../kmap/kmap-generator';
import { simplifyBoolean } from '../simplifier/boolean-simplifier';
import { buildCircuit } from '../logic/circuit-builder';

export function analyzeBooleanExpression(
  expression: string,
  currentInputs: Record<string, boolean> = {}
): BooleanAnalysisResult {
  const trimmed = expression.trim();

  if (!trimmed) {
    return {
      expression: '',
      valid: false,
      error: 'Please enter a Boolean expression.',
      variables: [],
    };
  }

  try {
    const { ast, variables } = parseExpression(trimmed);

    // Merge missing inputs with defaults (true)
    const activeInputs: Record<string, boolean> = { ...currentInputs };
    variables.forEach((v) => {
      if (activeInputs[v] === undefined) {
        activeInputs[v] = true;
      }
    });

    const truthTable = generateTruthTable(ast, variables);
    const kmap = generateKMap(truthTable);
    const { steps, minimizedExpression } = simplifyBoolean(ast, trimmed, variables);
    const circuit = buildCircuit(ast, variables, activeInputs);

    return {
      expression: trimmed,
      valid: true,
      variables,
      ast,
      truthTable,
      circuit,
      kmap,
      simplificationSteps: steps,
      simplifiedExpression: minimizedExpression,
    };
  } catch (err) {
    return {
      expression: trimmed,
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid Boolean syntax.',
      variables: [],
    };
  }
}
