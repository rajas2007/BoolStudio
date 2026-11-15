import { Graph, DegreeWalksResult, AlgorithmOutput } from '../types/graph';

export const COMPONENT_PALETTE = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#f97316', // Orange
];

export function findBFSShortestPath(graph: Graph, startId: string, endId: string): string[] {
  if (startId === endId) return [startId];
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    if (!graph.isDirected) {
      adj.get(e.target)?.push(e.source);
    }
  }

  const queue: string[] = [startId];
  const parent = new Map<string, string | null>([[startId, null]]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === endId) {
      const path: string[] = [];
      let c: string | null = curr;
      while (c !== null) {
        path.unshift(c);
        c = parent.get(c) ?? null;
      }
      return path;
    }
    for (const next of adj.get(curr) || []) {
      if (!parent.has(next)) {
        parent.set(next, curr);
        queue.push(next);
      }
    }
  }
  return [];
}

export function findAnyCycleThrough(graph: Graph, vertexId: string): string[] {
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    if (!graph.isDirected) {
      adj.get(e.target)?.push(e.source);
    }
  }

  const visited = new Set<string>();
  const parent = new Map<string, string | null>();
  const path: string[] = [];

  function dfs(curr: string, p: string | null): string[] | null {
    visited.add(curr);
    parent.set(curr, p);
    path.push(curr);

    for (const neighbor of adj.get(curr) || []) {
      if (neighbor === p) continue; // Don't backtrack immediately on undirected edge
      if (visited.has(neighbor)) {
        // Cycle found
        const cycleStartIndex = path.indexOf(neighbor);
        if (cycleStartIndex !== -1) {
          const cycle = path.slice(cycleStartIndex);
          cycle.push(neighbor);
          if (cycle.includes(vertexId)) {
            return cycle;
          }
        }
      } else {
        const res = dfs(neighbor, curr);
        if (res) return res;
      }
    }

    path.pop();
    return null;
  }

  return dfs(vertexId, null) || [];
}

// Tarjan's SCC Algorithm for Directed Graphs
export function computeStronglyConnectedComponents(graph: Graph): string[][] {
  let index = 0;
  const indices = new Map<string, number>();
  const lowlinks = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const sccs: string[][] = [];

  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
  }

  function strongConnect(u: string) {
    indices.set(u, index);
    lowlinks.set(u, index);
    index++;
    stack.push(u);
    onStack.add(u);

    for (const v of adj.get(u) || []) {
      if (!indices.has(v)) {
        strongConnect(v);
        lowlinks.set(u, Math.min(lowlinks.get(u)!, lowlinks.get(v)!));
      } else if (onStack.has(v)) {
        lowlinks.set(u, Math.min(lowlinks.get(u)!, indices.get(v)!));
      }
    }

    if (lowlinks.get(u) === indices.get(u)) {
      const scc: string[] = [];
      let w = '';
      do {
        w = stack.pop()!;
        onStack.delete(w);
        scc.push(w);
      } while (w !== u);
      sccs.push(scc);
    }
  }

  for (const v of graph.vertices) {
    if (!indices.has(v.id)) {
      strongConnect(v.id);
    }
  }

  return sccs;
}

export function computeDegreesAndConnectivity(
  graph: Graph,
  queryStartId?: string,
  queryEndId?: string
): AlgorithmOutput<DegreeWalksResult> {
  const n = graph.vertices.length;

  const degrees: Record<string, number> = {};
  const inDegrees: Record<string, number> = {};
  const outDegrees: Record<string, number> = {};

  for (const v of graph.vertices) {
    degrees[v.id] = 0;
    inDegrees[v.id] = 0;
    outDegrees[v.id] = 0;
  }

  for (const e of graph.edges) {
    if (graph.isDirected) {
      if (outDegrees[e.source] !== undefined) outDegrees[e.source]++;
      if (inDegrees[e.target] !== undefined) inDegrees[e.target]++;
    } else {
      if (degrees[e.source] !== undefined) degrees[e.source]++;
      if (degrees[e.target] !== undefined) degrees[e.target]++;
    }
  }

  if (graph.isDirected) {
    for (const v of graph.vertices) {
      degrees[v.id] = (inDegrees[v.id] || 0) + (outDegrees[v.id] || 0);
    }
  }

  const oddDegreeVertices = graph.vertices
    .filter((v) => (degrees[v.id] ?? 0) % 2 !== 0)
    .map((v) => v.id);

  // Weak/Undirected connected components
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  const visited = new Set<string>();
  const components: string[][] = [];
  const vertexComponentMap: Record<string, number> = {};

  for (const v of graph.vertices) {
    if (!visited.has(v.id)) {
      const compIdx = components.length;
      const comp: string[] = [];
      const queue = [v.id];
      visited.add(v.id);

      while (queue.length > 0) {
        const u = queue.shift()!;
        comp.push(u);
        vertexComponentMap[u] = compIdx;
        for (const neighbor of adj.get(u) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(comp);
    }
  }

  // Strong components for directed
  let strongComponents: string[][] | undefined;
  let isStronglyConnected: boolean | undefined;
  if (graph.isDirected && n > 0) {
    strongComponents = computeStronglyConnectedComponents(graph);
    isStronglyConnected = strongComponents.length === 1 && n > 0;
  }

  // Vertex colors by component
  const vertexColors: Record<string, string> = {};
  components.forEach((comp, idx) => {
    const col = COMPONENT_PALETTE[idx % COMPONENT_PALETTE.length];
    comp.forEach((vId) => {
      vertexColors[vId] = col;
    });
  });

  // Query Path
  let queryPath: DegreeWalksResult['queryPath'];
  const highlightEdges: string[] = [];
  const highlightVertices: string[] = [];

  if (queryStartId && queryEndId && queryStartId !== queryEndId) {
    const shortestPath = findBFSShortestPath(graph, queryStartId, queryEndId);
    const cycle = findAnyCycleThrough(graph, queryStartId);

    queryPath = {
      path: shortestPath,
      shortestPath,
      cycle,
    };

    if (shortestPath.length > 1) {
      highlightVertices.push(...shortestPath);
      for (let i = 0; i < shortestPath.length - 1; i++) {
        const u = shortestPath[i];
        const v = shortestPath[i + 1];
        const e = graph.edges.find((edge) =>
          graph.isDirected
            ? edge.source === u && edge.target === v
            : (edge.source === u && edge.target === v) || (edge.source === v && edge.target === u)
        );
        if (e) highlightEdges.push(e.id);
      }
    }
  }

  const isConnected = components.length <= 1;
  const explanation = graph.isDirected
    ? `Directed Graph has ${components.length} weakly connected component(s) and ${strongComponents?.length || 0} strongly connected component(s).`
    : `Graph has ${components.length} connected component(s) (${isConnected ? 'Connected' : 'Disconnected'}). Odd-degree vertices: ${oddDegreeVertices.length}.`;

  return {
    result: {
      degrees,
      inDegrees,
      outDegrees,
      oddDegreeVertices,
      components: {
        count: components.length,
        groups: components,
        vertexComponentMap,
        isStronglyConnected,
        strongComponents,
      },
      queryPath,
    },
    explanation,
    highlight: {
      vertices: highlightVertices.length > 0 ? highlightVertices : oddDegreeVertices,
      edges: highlightEdges,
      vertexColors,
    },
  };
}
