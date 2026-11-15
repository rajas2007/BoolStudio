import { Graph, BipartiteResult } from '../types/graph';

export function checkBipartite(graph: Graph): BipartiteResult {
  const n = graph.vertices.length;

  if (n === 0) {
    return {
      isBipartite: true,
      partitionA: [],
      partitionB: [],
      coloring: {},
      explanation: 'Empty graph has no vertices and is vacuously bipartite.',
    };
  }

  // Treat as undirected for bipartiteness of underlying structure
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  const color: Record<string, 0 | 1> = {};
  const parent = new Map<string, string | null>();
  const depth = new Map<string, number>();

  for (const startVertex of graph.vertices) {
    if (color[startVertex.id] !== undefined) continue;

    color[startVertex.id] = 0;
    parent.set(startVertex.id, null);
    depth.set(startVertex.id, 0);

    const queue: string[] = [startVertex.id];

    while (queue.length > 0) {
      const u = queue.shift()!;
      const uColor = color[u];
      const nextColor: 0 | 1 = uColor === 0 ? 1 : 0;
      const uDepth = depth.get(u) || 0;

      for (const v of adj.get(u) || []) {
        if (color[v] === undefined) {
          color[v] = nextColor;
          parent.set(v, u);
          depth.set(v, uDepth + 1);
          queue.push(v);
        } else if (color[v] === uColor) {
          // Odd cycle detected between u and v!
          // Reconstruct cycle from u and v to their common ancestor
          const pathU: string[] = [u];
          let currU: string | null = u;
          while (currU !== null) {
            currU = parent.get(currU) ?? null;
            if (currU !== null) pathU.push(currU);
          }

          const pathV: string[] = [v];
          let currV: string | null = v;
          while (currV !== null) {
            currV = parent.get(currV) ?? null;
            if (currV !== null) pathV.push(currV);
          }

          // Find lowest common ancestor
          let lca: string = startVertex.id;
          let idxU = pathU.length - 1;
          let idxV = pathV.length - 1;

          while (idxU >= 0 && idxV >= 0 && pathU[idxU] === pathV[idxV]) {
            lca = pathU[idxU];
            idxU--;
            idxV--;
          }

          // Cycle: path from lca down to u, then edge (u, v), then path from v back to lca
          const lcaIndexInU = pathU.indexOf(lca);
          const lcaIndexInV = pathV.indexOf(lca);

          const uBranch = pathU.slice(0, lcaIndexInU + 1).reverse(); // lca -> ... -> u
          const vBranch = pathV.slice(0, lcaIndexInV); // v -> ... -> just below lca

          // Complete cycle: uBranch + vBranch reversed + lca
          const oddCycle = [...uBranch, ...vBranch.reverse(), uBranch[0]];

          const cycleLabels = oddCycle.map(
            (id) => graph.vertices.find((ver) => ver.id === id)?.label || id
          );

          return {
            isBipartite: false,
            partitionA: [],
            partitionB: [],
            coloring: {},
            oddCycle,
            explanation: `Graph is NOT bipartite because it contains an odd cycle of length ${oddCycle.length - 1}: [${cycleLabels.join(' → ')}]. By König's Theorem, a graph is bipartite if and only if it has no odd cycles.`,
          };
        }
      }
    }
  }

  const partitionA = graph.vertices.filter((v) => color[v.id] === 0).map((v) => v.id);
  const partitionB = graph.vertices.filter((v) => color[v.id] === 1).map((v) => v.id);

  return {
    isBipartite: true,
    partitionA,
    partitionB,
    coloring: color,
    explanation: `Graph is 2-colourable and contains no odd cycles. Vertices can be partitioned into two independent sets: Set A (${partitionA.length} vertices) and Set B (${partitionB.length} vertices), where every edge connects a vertex in Set A to a vertex in Set B.`,
  };
}
