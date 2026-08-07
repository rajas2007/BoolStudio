import { ASTNode, SimplificationStep } from '../types/boolean';
import { generateKMap } from '../kmap/kmap-generator';
import { generateTruthTable } from '../truth-table/generator';

export function simplifyBoolean(
  ast: ASTNode,
  rawExpression: string,
  variables: string[]
): { steps: SimplificationStep[]; minimizedExpression: string } {
  const steps: SimplificationStep[] = [];
  let stepCount = 1;

  // Step 1: Initial Expression
  steps.push({
    stepNumber: stepCount++,
    expression: formatAST(ast),
    lawApplied: 'Original Expression',
    description: 'Initial parsed input expression.',
  });

  // Step 2: Apply Double Negation & Negation Rules
  let currentAST = ast;
  const { ast: step1AST, changed: changed1 } = applyDoubleNegation(currentAST);
  if (changed1) {
    currentAST = step1AST;
    steps.push({
      stepNumber: stepCount++,
      expression: formatAST(currentAST),
      lawApplied: 'Double Negation Law',
      description: 'Simplified double negations (!!A ≡ A).',
    });
  }

  // Step 3: Apply De Morgan's Laws
  const { ast: step2AST, changed: changed2 } = applyDeMorgan(currentAST);
  if (changed2) {
    currentAST = step2AST;
    steps.push({
      stepNumber: stepCount++,
      expression: formatAST(currentAST),
      lawApplied: "De Morgan's Law",
      description: 'Expanded negated expressions (!(A & B) ≡ !A | !B and !(A | B) ≡ !A & !B).',
    });
  }

  // Step 4: Apply Complement & Identity Laws
  const { ast: step3AST, changed: changed3 } = applyIdentityAndComplement(currentAST);
  if (changed3) {
    currentAST = step3AST;
    steps.push({
      stepNumber: stepCount++,
      expression: formatAST(currentAST),
      lawApplied: 'Identity & Complement Laws',
      description: 'Applied complement rules (A & !A ≡ 0, A | !A ≡ 1) and identity rules (A & 1 ≡ A, A | 0 ≡ A).',
    });
  }

  // Step 5: Quine-McCluskey / K-Map Minimization for final Sum of Products (Absorption / Distribution)
  const truthTable = generateTruthTable(ast, variables);
  const kmap = generateKMap(truthTable);
  const minimized = kmap.simplifiedExpression || formatAST(currentAST);

  const formattedCurrent = formatAST(currentAST);
  if (formattedCurrent !== minimized && minimized.length > 0) {
    steps.push({
      stepNumber: stepCount++,
      expression: minimized,
      lawApplied: 'Absorption & Consensus Laws',
      description: 'Combined adjacent minterms and absorbed redundant terms to form the minimal Sum of Products (SOP).',
    });
  }

  return {
    steps,
    minimizedExpression: minimized,
  };
}

function formatAST(node: ASTNode): string {
  switch (node.type) {
    case 'VARIABLE':
      return node.name;
    case 'NOT':
      if (node.child.type === 'VARIABLE') {
        return `!${node.child.name}`;
      }
      return `!(${formatAST(node.child)})`;
    case 'AND':
      return `${formatAST(node.left)} & ${formatAST(node.right)}`;
    case 'OR':
      return `(${formatAST(node.left)} | ${formatAST(node.right)})`;
    case 'XOR':
      return `(${formatAST(node.left)} ^ ${formatAST(node.right)})`;
    default:
      return '';
  }
}

function applyDoubleNegation(node: ASTNode): { ast: ASTNode; changed: boolean } {
  if (node.type === 'NOT') {
    if (node.child.type === 'NOT') {
      const inner = node.child.child;
      const res = applyDoubleNegation(inner);
      return { ast: res.ast, changed: true };
    }
    const childRes = applyDoubleNegation(node.child);
    return { ast: { type: 'NOT', child: childRes.ast }, changed: childRes.changed };
  }
  if (node.type === 'AND' || node.type === 'OR' || node.type === 'XOR') {
    const leftRes = applyDoubleNegation(node.left);
    const rightRes = applyDoubleNegation(node.right);
    return {
      ast: { type: node.type, left: leftRes.ast, right: rightRes.ast },
      changed: leftRes.changed || rightRes.changed,
    };
  }
  return { ast: node, changed: false };
}

function applyDeMorgan(node: ASTNode): { ast: ASTNode; changed: boolean } {
  if (node.type === 'NOT') {
    if (node.child.type === 'AND') {
      const newLeft: ASTNode = { type: 'NOT', child: node.child.left };
      const newRight: ASTNode = { type: 'NOT', child: node.child.right };
      return { ast: { type: 'OR', left: newLeft, right: newRight }, changed: true };
    }
    if (node.child.type === 'OR') {
      const newLeft: ASTNode = { type: 'NOT', child: node.child.left };
      const newRight: ASTNode = { type: 'NOT', child: node.child.right };
      return { ast: { type: 'AND', left: newLeft, right: newRight }, changed: true };
    }
  }

  if (node.type === 'AND' || node.type === 'OR' || node.type === 'XOR') {
    const leftRes = applyDeMorgan(node.left);
    const rightRes = applyDeMorgan(node.right);
    return {
      ast: { type: node.type, left: leftRes.ast, right: rightRes.ast },
      changed: leftRes.changed || rightRes.changed,
    };
  }

  return { ast: node, changed: false };
}

function applyIdentityAndComplement(node: ASTNode): { ast: ASTNode; changed: boolean } {
  if (node.type === 'AND' || node.type === 'OR' || node.type === 'XOR') {
    const leftRes = applyIdentityAndComplement(node.left);
    const rightRes = applyIdentityAndComplement(node.right);
    
    // Check if left and right are complement literals e.g. A and !A
    if (node.type === 'AND' && isComplement(leftRes.ast, rightRes.ast)) {
      return { ast: { type: 'VARIABLE', name: '0' }, changed: true };
    }
    if (node.type === 'OR' && isComplement(leftRes.ast, rightRes.ast)) {
      return { ast: { type: 'VARIABLE', name: '1' }, changed: true };
    }

    return {
      ast: { type: node.type, left: leftRes.ast, right: rightRes.ast },
      changed: leftRes.changed || rightRes.changed,
    };
  }

  return { ast: node, changed: false };
}

function isComplement(a: ASTNode, b: ASTNode): boolean {
  if (a.type === 'NOT' && areNodesEqual(a.child, b)) return true;
  if (b.type === 'NOT' && areNodesEqual(b.child, a)) return true;
  return false;
}

function areNodesEqual(a: ASTNode, b: ASTNode): boolean {
  if (a.type !== b.type) return false;
  if (a.type === 'VARIABLE' && b.type === 'VARIABLE') return a.name === b.name;
  if (a.type === 'NOT' && b.type === 'NOT') return areNodesEqual(a.child, b.child);
  if (
    (a.type === 'AND' || a.type === 'OR' || a.type === 'XOR') &&
    (b.type === 'AND' || b.type === 'OR' || b.type === 'XOR')
  ) {
    return areNodesEqual(a.left, b.left) && areNodesEqual(a.right, b.right);
  }
  return false;
}
