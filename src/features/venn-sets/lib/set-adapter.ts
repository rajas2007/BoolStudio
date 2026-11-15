import { ParsedSetExpr, SetVarCount } from '../types';
import { parseAndEvaluate } from './evaluator';

/**
 * Adapter interfacing with the single-source-of-truth set expression parser and evaluator.
 */
export function parseSetExpression(
  expr: string,
  varCount: SetVarCount
): ParsedSetExpr {
  return parseAndEvaluate(expr, varCount);
}
