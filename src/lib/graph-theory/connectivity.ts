import { Graph, ComponentResult } from '../types/graph';

export function computeConnectedComponents(graph: Graph): ComponentResult {
  if (graph.vertices.length === 0) {
    return {
      count: 0,
      components: [],
      vertexComponentMap: {},
    };
  }

  // Build undirected adjacency list for component discovery (weakly connected if directed)
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) {
    adj.set(v.id, []);
  }

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
      const currentComponent: string[] = [];
      const queue: string[] = [v.id];
      visited.add(v.id);

      while (queue.length > 0) {
        const u = queue.shift()!;
        currentComponent.push(u);
        vertexComponentMap[u] = compIdx;

        const neighbors = adj.get(u) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }

      components.push(currentComponent);
    }
  }

  return {
    count: components.length,
    components,
    vertexComponentMap,
  };
}
