import { ASTNode, CircuitData, CircuitNode, CircuitWire } from '../types/boolean';
import { evaluateAST } from './evaluator';

export function buildCircuit(
  ast: ASTNode,
  variables: string[],
  currentInputs: Record<string, boolean>
): CircuitData {
  const nodes: CircuitNode[] = [];
  const wires: CircuitWire[] = [];

  // Create input nodes at x = 60
  const inputYSpacing = 100;
  const inputStartY = 80;
  const inputNodeMap = new Map<string, string>(); // varName -> nodeId

  variables.forEach((varName, idx) => {
    const id = `input_${varName}`;
    inputNodeMap.set(varName, id);
    nodes.push({
      id,
      type: 'INPUT',
      label: varName,
      x: 80,
      y: inputStartY + idx * inputYSpacing,
      inputs: [],
      value: currentInputs[varName] ?? true,
    });
  });

  let gateCounter = 1;
  
  // Recursively process AST to build gate nodes and collect depth layers
  function processNode(node: ASTNode, layer: number): { nodeId: string; depth: number } {
    if (node.type === 'VARIABLE') {
      const inputId = inputNodeMap.get(node.name) || `input_${node.name}`;
      return { nodeId: inputId, depth: 0 };
    }

    if (node.type === 'NOT') {
      const childRes = processNode(node.child, layer);
      const gateDepth = childRes.depth + 1;
      const id = `gate_not_${gateCounter++}`;

      nodes.push({
        id,
        type: 'NOT',
        label: 'NOT',
        x: 0, // Will be laid out by depth
        y: 0,
        inputs: [childRes.nodeId],
        value: !evaluateAST(node.child, currentInputs),
      });

      return { nodeId: id, depth: gateDepth };
    }

    const leftRes = processNode(node.left, layer);
    const rightRes = processNode(node.right, layer);

    if (node.type === 'IMPLIES') {
      // Convert P -> Q into !P | Q for the circuit
      const notId = `gate_not_${gateCounter++}`;
      const leftVal = evaluateAST(node.left, currentInputs);
      const notDepth = leftRes.depth + 1;

      nodes.push({
        id: notId,
        type: 'NOT',
        label: 'NOT',
        x: 0,
        y: 0,
        inputs: [leftRes.nodeId],
        value: !leftVal,
      });

      const orId = `gate_or_${gateCounter++}`;
      const orDepth = Math.max(notDepth, rightRes.depth) + 1;
      const rightVal = evaluateAST(node.right, currentInputs);

      nodes.push({
        id: orId,
        type: 'OR',
        label: 'OR',
        x: 0,
        y: 0,
        inputs: [notId, rightRes.nodeId],
        value: !leftVal || rightVal,
      });

      return { nodeId: orId, depth: orDepth };
    }
    
    if (node.type === 'IFF') {
      // Convert A <=> B into (A & B) | (!A & !B) for the circuit
      
      const leftVal = evaluateAST(node.left, currentInputs);
      const rightVal = evaluateAST(node.right, currentInputs);

      // A & B
      const andId1 = `gate_and_${gateCounter++}`;
      const andDepth1 = Math.max(leftRes.depth, rightRes.depth) + 1;
      nodes.push({
        id: andId1,
        type: 'AND',
        label: 'AND',
        x: 0,
        y: 0,
        inputs: [leftRes.nodeId, rightRes.nodeId],
        value: leftVal && rightVal,
      });

      // !A
      const notIdA = `gate_not_${gateCounter++}`;
      const notDepthA = leftRes.depth + 1;
      nodes.push({
        id: notIdA,
        type: 'NOT',
        label: 'NOT',
        x: 0,
        y: 0,
        inputs: [leftRes.nodeId],
        value: !leftVal,
      });

      // !B
      const notIdB = `gate_not_${gateCounter++}`;
      const notDepthB = rightRes.depth + 1;
      nodes.push({
        id: notIdB,
        type: 'NOT',
        label: 'NOT',
        x: 0,
        y: 0,
        inputs: [rightRes.nodeId],
        value: !rightVal,
      });

      // !A & !B
      const andId2 = `gate_and_${gateCounter++}`;
      const andDepth2 = Math.max(notDepthA, notDepthB) + 1;
      nodes.push({
        id: andId2,
        type: 'AND',
        label: 'AND',
        x: 0,
        y: 0,
        inputs: [notIdA, notIdB],
        value: (!leftVal) && (!rightVal),
      });

      // (A & B) | (!A & !B)
      const orId = `gate_or_${gateCounter++}`;
      const orDepth = Math.max(andDepth1, andDepth2) + 1;
      nodes.push({
        id: orId,
        type: 'OR',
        label: 'OR',
        x: 0,
        y: 0,
        inputs: [andId1, andId2],
        value: (leftVal && rightVal) || ((!leftVal) && (!rightVal)),
      });

      return { nodeId: orId, depth: orDepth };
    }

    const gateDepth = Math.max(leftRes.depth, rightRes.depth) + 1;
    const id = `gate_${node.type.toLowerCase()}_${gateCounter++}`;

    const evaluatedVal = evaluateAST(node, currentInputs);

    nodes.push({
      id,
      type: node.type,
      label: node.type,
      x: 0,
      y: 0,
      inputs: [leftRes.nodeId, rightRes.nodeId],
      value: evaluatedVal,
    });

    return { nodeId: id, depth: gateDepth };
  }

  const rootRes = processNode(ast, 0);

  // Add final output indicator node
  const finalOutputId = 'output_final';
  const finalVal = evaluateAST(ast, currentInputs);
  nodes.push({
    id: finalOutputId,
    type: 'OUTPUT',
    label: 'OUT',
    x: 0,
    y: 0,
    inputs: [rootRes.nodeId],
    value: finalVal,
  });

  // Calculate layout coordinates by depth layer
  const depthGroups = new Map<number, CircuitNode[]>();
  nodes.forEach((n) => {
    if (n.type === 'INPUT') return;
    let depth = 1;
    if (n.id === finalOutputId) {
      depth = rootRes.depth + 1;
    } else {
      // Find node depth
      const maxInputDepth = n.inputs.reduce((acc, inputId) => {
        const parentNode = nodes.find((p) => p.id === inputId);
        if (!parentNode || parentNode.type === 'INPUT') return acc;
        return Math.max(acc, (parentNode as any).depth || 1);
      }, 0);
      depth = maxInputDepth + 1;
      (n as any).depth = depth;
    }

    if (!depthGroups.has(depth)) depthGroups.set(depth, []);
    depthGroups.get(depth)!.push(n);
  });

  const xSpacing = 180;
  const startX = 260;

  depthGroups.forEach((groupNodes, depth) => {
    const layerX = startX + (depth - 1) * xSpacing;
    const groupYSpacing = 110;
    const startY = 80 + (variables.length > 3 ? (variables.length - 3) * 20 : 0);

    groupNodes.forEach((n, idx) => {
      n.x = layerX;
      n.y = startY + idx * groupYSpacing;
    });
  });

  // Generate Wires between nodes
  const nodeMap = new Map<string, CircuitNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  let wireCounter = 1;
  nodes.forEach((targetNode) => {
    targetNode.inputs.forEach((sourceId) => {
      const sourceNode = nodeMap.get(sourceId);
      if (sourceNode) {
        wires.push({
          id: `wire_${wireCounter++}`,
          fromId: sourceNode.id,
          toId: targetNode.id,
          fromPoint: { x: sourceNode.x + (sourceNode.type === 'INPUT' ? 40 : 60), y: sourceNode.y },
          toPoint: { x: targetNode.x - (targetNode.type === 'OUTPUT' ? 20 : 40), y: targetNode.y },
          active: sourceNode.value,
        });
      }
    });
  });

  return {
    nodes,
    wires,
    inputs: currentInputs,
    output: finalVal,
  };
}
