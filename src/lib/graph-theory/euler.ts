import { Graph, EulerResult } from '../types/graph';
import { computeConnectedComponents } from './connectivity';

export function findEulerianPathOrCircuit(graph: Graph): EulerResult {
  const n = graph.vertices.length;
  const m = graph.edges.length;

  if (m === 0) {
    return {
      hasEulerCircuit: n <= 1,
      hasEulerTrail: n <= 1,
      circuitOrTrail: n === 1 ? [graph.vertices[0].id] : [],
      circuitOrTrailEdges: [],
      reason: n === 0
        ? 'The empty graph has no vertices or edges.'
        : 'Graph has 0 edges. A single vertex trivially has an empty Euler circuit.',
      oddDegreeVertices: [],
    };
  }

  // Check connectivity of non-isolated vertices
  const verticesWithEdges = new Set<string>();
  for (const e of graph.edges) {
    verticesWithEdges.add(e.source);
    verticesWithEdges.add(e.target);
  }

  const compResult = computeConnectedComponents(graph);
  // Count how many components have edges
  const componentsWithEdges = compResult.components.filter((comp) =>
    comp.some((vId) => verticesWithEdges.has(vId))
  );

  if (componentsWithEdges.length > 1) {
    return {
      hasEulerCircuit: false,
      hasEulerTrail: false,
      circuitOrTrail: [],
      circuitOrTrailEdges: [],
      reason: 'Graph is disconnected: edges belong to multiple separated components. All edges must belong to a single connected component.',
      oddDegreeVertices: [],
    };
  }

  if (graph.isDirected) {
    return findDirectedEuler(graph);
  } else {
    return findUndirectedEuler(graph);
  }
}

function findUndirectedEuler(graph: Graph): EulerResult {
  const degrees: Record<string, number> = {};
  for (const v of graph.vertices) degrees[v.id] = 0;
  for (const e of graph.edges) {
    degrees[e.source]++;
    degrees[e.target]++;
  }

  const oddDegreeVertices: string[] = [];
  for (const v of graph.vertices) {
    if (degrees[v.id] % 2 !== 0) {
      oddDegreeVertices.push(v.id);
    }
  }

  const hasEulerCircuit = oddDegreeVertices.length === 0;
  const hasEulerTrail = oddDegreeVertices.length === 2;

  let reason = '';
  if (hasEulerCircuit) {
    reason = 'All vertices have even degrees and all edges belong to a single connected component. An Euler Circuit exists.';
  } else if (hasEulerTrail) {
    const v1Label = graph.vertices.find((v) => v.id === oddDegreeVertices[0])?.label || oddDegreeVertices[0];
    const v2Label = graph.vertices.find((v) => v.id === oddDegreeVertices[1])?.label || oddDegreeVertices[1];
    reason = `Exactly two vertices have odd degree ('${v1Label}', '${v2Label}'). An open Euler Trail exists between them, but no closed circuit.`;
  } else {
    reason = `Graph has ${oddDegreeVertices.length} vertices with odd degree. An Euler path requires 0 (for circuit) or 2 (for open trail) odd vertices.`;
    return {
      hasEulerCircuit: false,
      hasEulerTrail: false,
      circuitOrTrail: [],
      circuitOrTrailEdges: [],
      reason,
      oddDegreeVertices,
    };
  }

  // Hierholzer's algorithm for undirected graph
  // Build adjacency list with edge references and tracking
  type EdgeRef = { target: string; edgeId: string; used: boolean };
  const adj = new Map<string, EdgeRef[]>();
  for (const v of graph.vertices) adj.set(v.id, []);

  const edgeMap = new Map<string, { u: string; v: string; used: boolean }>();
  for (const e of graph.edges) {
    edgeMap.set(e.id, { u: e.source, v: e.target, used: false });
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id, used: false });
    adj.get(e.target)?.push({ target: e.source, edgeId: e.id, used: false });
  }

  // Start vertex: if trail, one of the odd degree vertices; else any vertex with degree > 0
  const startVertex = hasEulerTrail
    ? oddDegreeVertices[0]
    : graph.vertices.find((v) => degrees[v.id] > 0)?.id || graph.vertices[0].id;

  const stack: { vertex: string; edgeId: string | null }[] = [{ vertex: startVertex, edgeId: null }];
  const path: string[] = [];
  const pathEdges: string[] = [];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = adj.get(current.vertex) || [];
    let foundUnused = false;

    for (const ref of neighbors) {
      const eInfo = edgeMap.get(ref.edgeId);
      if (eInfo && !eInfo.used) {
        eInfo.used = true;
        stack.push({ vertex: ref.target, edgeId: ref.edgeId });
        foundUnused = true;
        break;
      }
    }

    if (!foundUnused) {
      const popped = stack.pop()!;
      path.push(popped.vertex);
      if (popped.edgeId) {
        pathEdges.push(popped.edgeId);
      }
    }
  }

  path.reverse();
  pathEdges.reverse();

  return {
    hasEulerCircuit,
    hasEulerTrail,
    circuitOrTrail: path,
    circuitOrTrailEdges: pathEdges,
    reason,
    oddDegreeVertices,
  };
}

function findDirectedEuler(graph: Graph): EulerResult {
  const inDeg: Record<string, number> = {};
  const outDeg: Record<string, number> = {};
  for (const v of graph.vertices) {
    inDeg[v.id] = 0;
    outDeg[v.id] = 0;
  }
  for (const e of graph.edges) {
    outDeg[e.source]++;
    inDeg[e.target]++;
  }

  let startNode: string | null = null;
  let endNode: string | null = null;

  for (const v of graph.vertices) {
    const diff = outDeg[v.id] - inDeg[v.id];
    if (diff === 1) {
      if (startNode === null) startNode = v.id;
      else return {
        hasEulerCircuit: false,
        hasEulerTrail: false,
        circuitOrTrail: [],
        circuitOrTrailEdges: [],
        reason: 'More than one vertex has out-degree - in-degree = 1. Directed Euler trail is impossible.',
        oddDegreeVertices: [],
      };
    } else if (diff === -1) {
      if (endNode === null) endNode = v.id;
      else return {
        hasEulerCircuit: false,
        hasEulerTrail: false,
        circuitOrTrail: [],
        circuitOrTrailEdges: [],
        reason: 'More than one vertex has in-degree - out-degree = 1. Directed Euler trail is impossible.',
        oddDegreeVertices: [],
      };
    } else if (diff === 0) {
      // Balanced node
    } else {
      return {
        hasEulerCircuit: false,
        hasEulerTrail: false,
        circuitOrTrail: [],
        circuitOrTrailEdges: [],
        reason: `Vertex '${v.label}' has |in-degree - out-degree| > 1. Euler trail is impossible.`,
        oddDegreeVertices: [],
      };
    }
  }

  const hasEulerCircuit = startNode === null && endNode === null;
  const hasEulerTrail = (startNode !== null && endNode !== null) || hasEulerCircuit;

  if (!hasEulerTrail) {
    return {
      hasEulerCircuit: false,
      hasEulerTrail: false,
      circuitOrTrail: [],
      circuitOrTrailEdges: [],
      reason: 'Directed graph does not satisfy degree balance conditions.',
      oddDegreeVertices: [],
    };
  }

  const startVertex = startNode || graph.vertices.find((v) => outDeg[v.id] > 0)?.id || graph.vertices[0].id;

  // Hierholzer for directed
  type DirEdge = { target: string; edgeId: string; used: boolean };
  const adj = new Map<string, DirEdge[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id, used: false });
  }

  const stack: { vertex: string; edgeId: string | null }[] = [{ vertex: startVertex, edgeId: null }];
  const path: string[] = [];
  const pathEdges: string[] = [];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = adj.get(current.vertex) || [];
    const unusedEdge = neighbors.find((e) => !e.used);

    if (unusedEdge) {
      unusedEdge.used = true;
      stack.push({ vertex: unusedEdge.target, edgeId: unusedEdge.edgeId });
    } else {
      const popped = stack.pop()!;
      path.push(popped.vertex);
      if (popped.edgeId) {
        pathEdges.push(popped.edgeId);
      }
    }
  }

  path.reverse();
  pathEdges.reverse();

  const reason = hasEulerCircuit
    ? 'For every vertex in the directed graph, in-degree = out-degree. A directed Euler Circuit exists.'
    : 'Graph has one vertex with out-degree = in-degree + 1 and one with in-degree = out-degree + 1, with all other vertices balanced. An open directed Euler Trail exists.';

  return {
    hasEulerCircuit,
    hasEulerTrail,
    circuitOrTrail: path,
    circuitOrTrailEdges: pathEdges,
    reason,
    oddDegreeVertices: [startNode, endNode].filter(Boolean) as string[],
  };
}
