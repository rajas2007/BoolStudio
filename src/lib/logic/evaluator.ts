import { ASTNode } from '../types/boolean';

export function evaluateAST(node: ASTNode, values: Record<string, boolean>): boolean {
  switch (node.type) {
    case 'VARIABLE': {
      const val = values[node.name];
      if (val === undefined) {
        return false;
      }
      return val;
    }
    case 'NOT':
      return !evaluateAST(node.child, values);
    case 'AND':
      return evaluateAST(node.left, values) && evaluateAST(node.right, values);
    case 'OR':
      return evaluateAST(node.left, values) || evaluateAST(node.right, values);
    case 'XOR':
      return evaluateAST(node.left, values) !== evaluateAST(node.right, values);
    case 'NAND':
      return !(evaluateAST(node.left, values) && evaluateAST(node.right, values));
    case 'NOR':
      return !(evaluateAST(node.left, values) || evaluateAST(node.right, values));
    case 'XNOR':
      return evaluateAST(node.left, values) === evaluateAST(node.right, values);
    case 'IMPLIES':
      return !evaluateAST(node.left, values) || evaluateAST(node.right, values);
    case 'IFF':
      return evaluateAST(node.left, values) === evaluateAST(node.right, values);
    default:
      return false;
  }
}
