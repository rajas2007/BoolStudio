import { Graph, HamiltonianResult } from '../types/graph';

export function findHamiltonianPathsAndCycles(graph: Graph): HamiltonianResult {
  const n = graph.vertices.length;

  if (n === 0) {
    return {
      hasCycle: false,
      hasPath: false,
      cycle: [],
      cycleEdges: [],
      path: [],
      pathEdges: [],
      exceedsLimit: false,
      explanation: 'Empty graph has no vertices.',
    };
  }

  if (n === 1) {
    return {
      hasCycle: false,
      hasPath: true,
      cycle: [],
      cycleEdges: [],
      path: [graph.vertices[0].id],
      pathEdges: [],
      exceedsLimit: false,
      explanation: 'A single vertex has a trivial Hamiltonian path, but no Hamiltonian cycle (a simple cycle requires at least 3 vertices).',
    };
  }

  if (n > 10) {
    return {
      hasCycle: false,
      hasPath: false,
      cycle: [],
      cycleEdges: [],
      path: [],
      pathEdges: [],
      exceedsLimit: true,
      explanation: `Graph has |V| = ${n} > 10. The Hamiltonian path problem is NP-complete with O(n!) worst-case complexity. Exact backtracking is limited to n ≤ 10 to ensure instant client-side responsiveness.`,
    };
  }

  // Build adjacency list respecting direction
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);

  const edgeMap = new Map<string, string>(); // "u->v" => edgeId
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    edgeMap.set(`${e.source}->${e.target}`, e.id);
    if (!graph.isDirected) {
      adj.get(e.target)?.push(e.source);
      edgeMap.set(`${e.target}->${e.source}`, e.id);
    }
  }

  // 1. Search for Hamiltonian Cycle (a simple cycle requires n >= 3 vertices)
  let foundCycle: string[] | null = null;
  const cycleEdges: string[] = [];

  if (n >= 3) {
    const startVertex = graph.vertices[0].id;
    const visitedForCycle = new Set<string>([startVertex]);
    const cycleStack: string[] = [startVertex];

    function searchCycle(curr: string): boolean {
      if (cycleStack.length === n) {
        const closingEdge = edgeMap.get(`${curr}->${startVertex}`);
        if (closingEdge) {
          foundCycle = [...cycleStack, startVertex];
          return true;
        }
        return false;
      }

      const neighbors = adj.get(curr) || [];
      for (const next of neighbors) {
        if (!visitedForCycle.has(next)) {
          visitedForCycle.add(next);
          cycleStack.push(next);
          if (searchCycle(next)) return true;
          cycleStack.pop();
          visitedForCycle.delete(next);
        }
      }
      return false;
    }

    searchCycle(startVertex);

    if (foundCycle) {
      for (let i = 0; i < (foundCycle as string[]).length - 1; i++) {
        const u = (foundCycle as string[])[i];
        const v = (foundCycle as string[])[i + 1];
        const eId = edgeMap.get(`${u}->${v}`);
        if (eId) cycleEdges.push(eId);
      }
    }
  }

  // 2. Search for Hamiltonian Path (may start at any vertex)
  let foundPath: string[] | null = null;
  const pathEdges: string[] = [];

  if (foundCycle) {
    // A Hamiltonian cycle directly implies a Hamiltonian path
    foundPath = (foundCycle as string[]).slice(0, n);
    for (let i = 0; i < foundPath.length - 1; i++) {
      const u = foundPath[i];
      const v = foundPath[i + 1];
      const eId = edgeMap.get(`${u}->${v}`);
      if (eId) pathEdges.push(eId);
    }
  } else {
    // Backtracking from each possible starting vertex
    for (const v of graph.vertices) {
      const visitedForPath = new Set<string>([v.id]);
      const pathStack: string[] = [v.id];

      function searchPath(curr: string): boolean {
        if (pathStack.length === n) {
          foundPath = [...pathStack];
          return true;
        }

        const neighbors = adj.get(curr) || [];
        for (const next of neighbors) {
          if (!visitedForPath.has(next)) {
            visitedForPath.add(next);
            pathStack.push(next);
            if (searchPath(next)) return true;
            pathStack.pop();
            visitedForPath.delete(next);
          }
        }
        return false;
      }

      if (searchPath(v.id)) {
        break;
      }
    }

    if (foundPath) {
      for (let i = 0; i < (foundPath as string[]).length - 1; i++) {
        const u = (foundPath as string[])[i];
        const v = (foundPath as string[])[i + 1];
        const eId = edgeMap.get(`${u}->${v}`);
        if (eId) pathEdges.push(eId);
      }
    }
  }

  const hasCycle = foundCycle !== null;
  const hasPath = foundPath !== null;

  let explanation = '';
  if (hasCycle) {
    explanation = `A Hamiltonian Cycle exists: A closed loop that visits every one of the ${n} vertices exactly once. Because every Hamiltonian cycle contains a Hamiltonian path, both exist.`;
  } else if (hasPath) {
    explanation = n < 3
      ? `A Hamiltonian Path exists (visiting all ${n} vertices), but no Hamiltonian Cycle exists because a simple cycle requires at least 3 vertices (n ≥ 3).`
      : `A Hamiltonian Path exists (open path visiting all ${n} vertices exactly once), but NO Hamiltonian Cycle exists because the path endpoints cannot be closed with an edge.`;
  } else {
    explanation = `Neither a Hamiltonian Path nor a Hamiltonian Cycle exists. No sequence of edges can traverse all ${n} vertices without revisiting any vertex.`;
  }

  return {
    hasCycle,
    hasPath,
    cycle: foundCycle || [],
    cycleEdges,
    path: foundPath || [],
    pathEdges,
    exceedsLimit: false,
    explanation,
  };
}
