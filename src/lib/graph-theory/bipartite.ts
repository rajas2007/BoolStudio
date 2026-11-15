import { Graph, BipartiteResult, AlgorithmOutput } from '../types/graph';

export function checkBipartite(graph: Graph): AlgorithmOutput<BipartiteResult> {
  const n = graph.vertices.length;

  if (n === 0) {
    const res: BipartiteResult = {
      isBipartite: true,
      partitionA: [],
      partitionB: [],
      coloring: {},
      explanation: 'Empty graph has no vertices and is vacuously bipartite.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: [], edges: [] },
    };
  }

  // Treat as undirected for bipartiteness of underlying connectivity
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  const color: Record<string, 0 | 1> = {};
  const parent = new Map<string, string | null>();
  const depth = new Map<string, number>();

  let oddCycle: string[] | undefined;

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
          // Odd cycle detected between u and v
          if (!oddCycle) {
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

            // Lowest common ancestor
            let lca: string = startVertex.id;
            let idxU = pathU.length - 1;
            let idxV = pathV.length - 1;
            while (idxU >= 0 && idxV >= 0 && pathU[idxU] === pathV[idxV]) {
              lca = pathU[idxU];
              idxU--;
              idxV--;
            }

            const lcaIndexInU = pathU.indexOf(lca);
            const lcaIndexInV = pathV.indexOf(lca);
            const cycleFromU = pathU.slice(0, lcaIndexInU + 1).reverse();
            const cycleFromV = pathV.slice(0, lcaIndexInV);

            oddCycle = [...cycleFromU, ...cycleFromV, cycleFromU[0]];
          }
        }
      }
      if (oddCycle) break;
    }
    if (oddCycle) break;
  }

  const isBipartite = oddCycle === undefined;
  const partitionA: string[] = [];
  const partitionB: string[] = [];
  const vertexColors: Record<string, string> = {};

  if (isBipartite) {
    for (const v of graph.vertices) {
      if (color[v.id] === 0) {
        partitionA.push(v.id);
        vertexColors[v.id] = '#6366f1'; // Indigo (Set A)
      } else {
        partitionB.push(v.id);
        vertexColors[v.id] = '#10b981'; // Emerald (Set B)
      }
    }
  }

  const oddCycleEdges: string[] = [];
  if (oddCycle && oddCycle.length > 2) {
    for (let i = 0; i < oddCycle.length - 1; i++) {
      const u = oddCycle[i];
      const v = oddCycle[i + 1];
      const e = graph.edges.find((edge) =>
        (edge.source === u && edge.target === v) || (edge.source === v && edge.target === u)
      );
      if (e) oddCycleEdges.push(e.id);
    }
  }

  let explanation = '';
  if (isBipartite) {
    explanation = `Bipartite graph: 2-colourable with partition Set A (|A| = ${partitionA.length}) and Set B (|B| = ${partitionB.length}). Contains no odd cycles.`;
  } else {
    const cycleLabels = (oddCycle || []).map((id) => graph.vertices.find((v) => v.id === id)?.label || id);
    explanation = `Not bipartite: contains an odd cycle (${cycleLabels.join(' → ')}, length ${oddCycle!.length - 1}). Theorem: A graph is bipartite iff it has no odd cycles.`;
  }

  const res: BipartiteResult = {
    isBipartite,
    partitionA,
    partitionB,
    coloring: color,
    oddCycle,
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: {
      vertices: isBipartite ? graph.vertices.map((v) => v.id) : (oddCycle || []),
      edges: isBipartite ? [] : oddCycleEdges,
      vertexColors: isBipartite ? vertexColors : undefined,
    },
  };
}
