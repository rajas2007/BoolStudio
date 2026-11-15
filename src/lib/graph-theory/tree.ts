import { Graph, TreeResult } from '../types/graph';
import { computeConnectedComponents } from './connectivity';

export function analyzeTreeProperties(graph: Graph): TreeResult {
  const order = graph.vertices.length;
  const size = graph.edges.length;

  if (order === 0) {
    return {
      isTree: false,
      isConnected: false,
      isAcyclic: true,
      order: 0,
      size: 0,
      satisfiesSizeCondition: false,
      failedConditions: ['Order condition: A tree must have at least 1 vertex.'],
      explanation: 'The empty graph has order 0 and is not a tree.',
    };
  }

  if (order === 1) {
    const isTree = size === 0;
    return {
      isTree,
      isConnected: true,
      isAcyclic: true,
      order: 1,
      size,
      satisfiesSizeCondition: size === 0,
      failedConditions: isTree ? [] : ['Size condition: Single vertex tree must have 0 edges.'],
      explanation: isTree
        ? 'A single vertex with no edges is a trivial tree of order 1.'
        : 'Single vertex has loops or parallel edges, so it is not a simple tree.',
    };
  }

  // Check connectivity
  const components = computeConnectedComponents(graph);
  const isConnected = components.count === 1;

  // Check acyclicity using undirected DFS
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  const visited = new Set<string>();
  let hasCycle = false;

  function dfs(u: string, parent: string | null): boolean {
    visited.add(u);
    for (const v of adj.get(u) || []) {
      if (!visited.has(v)) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) {
        // Visited neighbor that is not parent => cycle!
        return true;
      }
    }
    return false;
  }

  for (const v of graph.vertices) {
    if (!visited.has(v.id)) {
      if (dfs(v.id, null)) {
        hasCycle = true;
        break;
      }
    }
  }

  const isAcyclic = !hasCycle;
  const satisfiesSizeCondition = size === order - 1;
  const isTree = isConnected && isAcyclic && satisfiesSizeCondition;

  const failedConditions: string[] = [];
  if (!isConnected) {
    failedConditions.push(`Connectivity failed: Graph has ${components.count} disconnected components (a tree must be connected).`);
  }
  if (!isAcyclic) {
    failedConditions.push('Acyclicity failed: Graph contains one or more cycles (a tree must be cycle-free).');
  }
  if (!satisfiesSizeCondition) {
    failedConditions.push(
      `Size formula failed: |E| = ${size}, but a tree requires |E| = |V| - 1 = ${order} - 1 = ${order - 1}.`
    );
  }

  let explanation = '';
  if (isTree) {
    explanation = `The graph is a TREE: It is connected, contains no cycles, and satisfies the fundamental tree theorem |E| = |V| - 1 (${size} = ${order} - 1). Every pair of vertices has a unique simple path between them.`;
  } else {
    explanation = `The graph is NOT a tree because it fails ${failedConditions.length} fundamental condition(s): ${failedConditions.join(' ')}`;
  }

  return {
    isTree,
    isConnected,
    isAcyclic,
    order,
    size,
    satisfiesSizeCondition,
    failedConditions,
    explanation,
  };
}
