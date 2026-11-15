import { Graph, TreeResult, AlgorithmOutput } from '../types/graph';
import { computeDegreesAndConnectivity } from './connectivity';

export function analyzeTreeProperties(graph: Graph): AlgorithmOutput<TreeResult> {
  const order = graph.vertices.length;
  const size = graph.edges.length;

  const conn = computeDegreesAndConnectivity(graph);
  const isConnected = conn.result.components.count === 1;

  // Degrees and leaves
  const degrees = conn.result.degrees;
  const leaves = graph.vertices.filter((v) => degrees[v.id] === 1).map((v) => v.id);
  const degreeSequence = Object.values(degrees).sort((a, b) => b - a);

  // Cycle detection with witness extraction
  const adj = new Map<string, { target: string; edgeId: string }[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id });
    adj.get(e.target)?.push({ target: e.source, edgeId: e.id });
  }

  const visited = new Set<string>();
  const parent = new Map<string, string | null>();
  const path: string[] = [];
  let cycleWitness: string[] | undefined;
  const cycleEdges: string[] = [];

  function dfsFindCycle(u: string, p: string | null): boolean {
    visited.add(u);
    parent.set(u, p);
    path.push(u);

    for (const edgeRef of adj.get(u) || []) {
      const v = edgeRef.target;
      if (v === p) continue;
      if (visited.has(v)) {
        // Cycle detected
        const cycleStartIndex = path.indexOf(v);
        if (cycleStartIndex !== -1) {
          cycleWitness = path.slice(cycleStartIndex);
          cycleWitness.push(v);
          return true;
        }
      } else {
        if (dfsFindCycle(v, u)) return true;
      }
    }
    path.pop();
    return false;
  }

  for (const v of graph.vertices) {
    if (!visited.has(v.id)) {
      if (dfsFindCycle(v.id, null)) break;
    }
  }

  if (cycleWitness && cycleWitness.length > 2) {
    for (let i = 0; i < cycleWitness.length - 1; i++) {
      const u = cycleWitness[i];
      const v = cycleWitness[i + 1];
      const e = graph.edges.find((edge) =>
        (edge.source === u && edge.target === v) || (edge.source === v && edge.target === u)
      );
      if (e) cycleEdges.push(e.id);
    }
  }

  const isAcyclic = cycleWitness === undefined;
  const satisfiesSizeCondition = order > 0 && size === order - 1;
  const isTree = order > 0 && isConnected && isAcyclic && satisfiesSizeCondition;

  // BFS Spanning Tree if connected
  const spanningTreeEdges: string[] = [];
  if (isConnected && order > 0) {
    const spanVisited = new Set<string>([graph.vertices[0].id]);
    const queue = [graph.vertices[0].id];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const edgeRef of adj.get(curr) || []) {
        if (!spanVisited.has(edgeRef.target)) {
          spanVisited.add(edgeRef.target);
          spanningTreeEdges.push(edgeRef.edgeId);
          queue.push(edgeRef.target);
        }
      }
    }
  }

  const failedConditions: string[] = [];
  if (!isConnected) {
    failedConditions.push(`Connectivity failed: Graph has ${conn.result.components.count} separated components.`);
  }
  if (!isAcyclic) {
    failedConditions.push('Acyclicity failed: Graph contains one or more cycles.');
  }
  if (!satisfiesSizeCondition) {
    failedConditions.push(`Size formula failed: |E| = ${size}, but a tree requires |E| = |V| - 1 = ${order - 1}.`);
  }

  let explanation = '';
  if (isTree) {
    explanation = `The graph is a TREE: Connected, cycle-free, and satisfies |E| = |V| - 1 (${size} = ${order} - 1). Leaves: ${leaves.length}.`;
  } else {
    explanation = `Not a tree: Fails ${failedConditions.length} tree condition(s). ${failedConditions[0]}`;
  }

  const res: TreeResult = {
    isTree,
    isConnected,
    isAcyclic,
    satisfiesSizeCondition,
    order,
    size,
    leaves,
    degreeSequence,
    cycleWitness,
    spanningTreeEdges,
    failedConditions,
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: {
      vertices: cycleWitness || (isTree ? leaves : []),
      edges: cycleEdges.length > 0 ? cycleEdges : (isTree ? spanningTreeEdges : []),
    },
  };
}
