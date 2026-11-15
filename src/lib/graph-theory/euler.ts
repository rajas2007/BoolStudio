import { Graph, EulerResult, AlgorithmOutput, StepInfo } from '../types/graph';
import { computeDegreesAndConnectivity } from './connectivity';

export function findEulerianPathOrCircuit(graph: Graph): AlgorithmOutput<EulerResult> {
  const n = graph.vertices.length;
  const m = graph.edges.length;

  if (m === 0) {
    const res: EulerResult = {
      hasCircuit: n <= 1,
      hasTrail: n <= 1,
      circuitOrTrail: n === 1 ? [graph.vertices[0].id] : [],
      circuitOrTrailEdges: [],
      oddVertices: [],
      isDisconnected: false,
      explanation: n === 0
        ? 'The empty graph has no edges to traverse.'
        : 'Graph has 0 edges. A single vertex trivially has an empty Euler circuit.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: res.circuitOrTrail, edges: [] },
      steps: [],
    };
  }

  // Check connectivity of vertices with non-zero degree
  const verticesWithEdges = new Set<string>();
  for (const e of graph.edges) {
    verticesWithEdges.add(e.source);
    verticesWithEdges.add(e.target);
  }

  const conn = computeDegreesAndConnectivity(graph);
  const componentsWithEdges = conn.result.components.groups.filter((comp) =>
    comp.some((vId) => verticesWithEdges.has(vId))
  );

  if (componentsWithEdges.length > 1) {
    const res: EulerResult = {
      hasCircuit: false,
      hasTrail: false,
      circuitOrTrail: [],
      circuitOrTrailEdges: [],
      oddVertices: conn.result.oddDegreeVertices,
      isDisconnected: true,
      explanation: 'Graph is disconnected: edges belong to multiple separated components. All edges must belong to a single connected component.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: conn.result.oddDegreeVertices, edges: [] },
      steps: [],
    };
  }

  if (graph.isDirected) {
    return findDirectedEuler(graph);
  } else {
    return findUndirectedEuler(graph, conn.result);
  }
}

function findUndirectedEuler(
  graph: Graph,
  connResult: { oddDegreeVertices: string[] }
): AlgorithmOutput<EulerResult> {
  const oddVertices = connResult.oddDegreeVertices;
  const hasCircuit = oddVertices.length === 0;
  const hasTrail = oddVertices.length === 2;

  if (!hasCircuit && !hasTrail) {
    const oddLabels = oddVertices.map(id => graph.vertices.find(v => v.id === id)?.label || id);
    const explanation = `No Euler tour or trail: Graph has ${oddVertices.length} odd-degree vertices (${oddLabels.join(', ')}). An Euler circuit requires 0 odd vertices; an Euler trail requires exactly 2.`;
    const res: EulerResult = {
      hasCircuit: false,
      hasTrail: false,
      circuitOrTrail: [],
      circuitOrTrailEdges: [],
      oddVertices,
      isDisconnected: false,
      explanation,
    };
    return {
      result: res,
      explanation,
      highlight: { vertices: oddVertices, edges: [] },
      steps: [],
    };
  }

  // Hierholzer's algorithm
  type EdgeRef = { target: string; edgeId: string; used: boolean };
  const adj = new Map<string, EdgeRef[]>();
  for (const v of graph.vertices) adj.set(v.id, []);

  const edgeMap = new Map<string, { u: string; v: string; used: boolean }>();
  for (const e of graph.edges) {
    edgeMap.set(e.id, { u: e.source, v: e.target, used: false });
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id, used: false });
    adj.get(e.target)?.push({ target: e.source, edgeId: e.id, used: false });
  }

  // Start vertex: one of the odd vertices for trail, or any vertex with edges for circuit
  const startId = hasTrail ? oddVertices[0] : (graph.edges[0]?.source || graph.vertices[0].id);

  const stack: string[] = [startId];
  const edgeStack: string[] = [];
  const finalPath: string[] = [];
  const finalEdges: string[] = [];

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const neighbors = adj.get(curr) || [];
    const nextEdge = neighbors.find((e) => !edgeMap.get(e.edgeId)?.used);

    if (nextEdge) {
      edgeMap.get(nextEdge.edgeId)!.used = true;
      stack.push(nextEdge.target);
      edgeStack.push(nextEdge.edgeId);
    } else {
      finalPath.push(stack.pop()!);
      if (edgeStack.length > 0) {
        finalEdges.push(edgeStack.pop()!);
      }
    }
  }

  finalPath.reverse();
  finalEdges.reverse();

  // Generate step-by-step frames for "Show steps"
  const steps: StepInfo[] = [];
  steps.push({
    stepIndex: 0,
    description: `Start at vertex '${graph.vertices.find(v => v.id === finalPath[0])?.label}'.`,
    highlight: { vertices: [finalPath[0]], edges: [] },
  });

  for (let i = 0; i < finalEdges.length; i++) {
    const subVertices = finalPath.slice(0, i + 2);
    const subEdges = finalEdges.slice(0, i + 1);
    const currentV = graph.vertices.find(v => v.id === finalPath[i + 1])?.label;
    steps.push({
      stepIndex: i + 1,
      description: `Step ${i + 1}: Traverse edge to vertex '${currentV}'.`,
      highlight: { vertices: subVertices, edges: subEdges },
    });
  }

  const startLabel = graph.vertices.find(v => v.id === finalPath[0])?.label;
  const endLabel = graph.vertices.find(v => v.id === finalPath[finalPath.length - 1])?.label;

  const explanation = hasCircuit
    ? `Euler Circuit found! All vertices have even degree. Traverses all ${graph.edges.length} edges, starting and ending at '${startLabel}'.`
    : `Euler Trail found! Exactly 2 odd-degree vertices. Traverses all ${graph.edges.length} edges from '${startLabel}' to '${endLabel}'.`;

  const res: EulerResult = {
    hasCircuit,
    hasTrail,
    circuitOrTrail: finalPath,
    circuitOrTrailEdges: finalEdges,
    oddVertices,
    isDisconnected: false,
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: { vertices: finalPath, edges: finalEdges },
    steps,
  };
}

function findDirectedEuler(
  graph: Graph
): AlgorithmOutput<EulerResult> {
  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  for (const v of graph.vertices) {
    inDegree[v.id] = 0;
    outDegree[v.id] = 0;
  }

  for (const e of graph.edges) {
    outDegree[e.source]++;
    inDegree[e.target]++;
  }

  let startNode: string | null = null;
  let endNode: string | null = null;
  let unbalanced = 0;
  const unbalancedList: string[] = [];

  for (const v of graph.vertices) {
    const diff = outDegree[v.id] - inDegree[v.id];
    if (diff === 1) {
      startNode = v.id;
      unbalanced++;
      unbalancedList.push(v.id);
    } else if (diff === -1) {
      endNode = v.id;
      unbalanced++;
      unbalancedList.push(v.id);
    } else if (diff !== 0) {
      unbalanced++;
      unbalancedList.push(v.id);
    }
  }

  const hasCircuit = unbalanced === 0;
  const hasTrail = unbalanced === 2 && startNode !== null && endNode !== null;

  if (!hasCircuit && !hasTrail) {
    const explanation = `Directed graph has no Euler tour: in-degrees and out-degrees are unbalanced for ${unbalanced} vertices.`;
    const res: EulerResult = {
      hasCircuit: false,
      hasTrail: false,
      circuitOrTrail: [],
      circuitOrTrailEdges: [],
      oddVertices: [],
      unbalancedVertices: unbalancedList,
      isDisconnected: false,
      explanation,
    };
    return {
      result: res,
      explanation,
      highlight: { vertices: unbalancedList, edges: [] },
      steps: [],
    };
  }

  // Directed Hierholzer's
  const adj = new Map<string, { target: string; edgeId: string; used: boolean }[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id, used: false });
  }

  const effectiveStart = startNode || (graph.edges[0]?.source || graph.vertices[0].id);

  const stack: string[] = [effectiveStart];
  const edgeStack: string[] = [];
  const finalPath: string[] = [];
  const finalEdges: string[] = [];

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const neighbors = adj.get(curr) || [];
    const nextEdge = neighbors.find((e) => !e.used);

    if (nextEdge) {
      nextEdge.used = true;
      stack.push(nextEdge.target);
      edgeStack.push(nextEdge.edgeId);
    } else {
      finalPath.push(stack.pop()!);
      if (edgeStack.length > 0) {
        finalEdges.push(edgeStack.pop()!);
      }
    }
  }

  finalPath.reverse();
  finalEdges.reverse();

  const steps: StepInfo[] = [];
  steps.push({
    stepIndex: 0,
    description: `Start at vertex '${graph.vertices.find(v => v.id === finalPath[0])?.label}'.`,
    highlight: { vertices: [finalPath[0]], edges: [] },
  });

  for (let i = 0; i < finalEdges.length; i++) {
    const subVertices = finalPath.slice(0, i + 2);
    const subEdges = finalEdges.slice(0, i + 1);
    const currentV = graph.vertices.find(v => v.id === finalPath[i + 1])?.label;
    steps.push({
      stepIndex: i + 1,
      description: `Step ${i + 1}: Traverse directed arc to '${currentV}'.`,
      highlight: { vertices: subVertices, edges: subEdges },
    });
  }

  const explanation = hasCircuit
    ? `Directed Euler Circuit found! Every vertex has in-deg = out-deg.`
    : `Directed Euler Trail found from '${graph.vertices.find(v => v.id === startNode)?.label}' to '${graph.vertices.find(v => v.id === endNode)?.label}'.`;

  const res: EulerResult = {
    hasCircuit,
    hasTrail,
    circuitOrTrail: finalPath,
    circuitOrTrailEdges: finalEdges,
    oddVertices: [],
    unbalancedVertices: unbalancedList,
    isDisconnected: false,
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: { vertices: finalPath, edges: finalEdges },
    steps,
  };
}
