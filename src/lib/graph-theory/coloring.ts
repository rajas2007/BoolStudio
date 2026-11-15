import { Graph, ColoringResult } from '../types/graph';

export const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#84cc16', // Lime
];

export function validateColoring(graph: Graph, colors: Record<string, number>): { isValid: boolean; conflictingEdges: string[] } {
  const conflictingEdges: string[] = [];

  for (const edge of graph.edges) {
    const c1 = colors[edge.source];
    const c2 = colors[edge.target];
    if (c1 !== undefined && c2 !== undefined && c1 === c2) {
      conflictingEdges.push(edge.id);
    }
  }

  return {
    isValid: conflictingEdges.length === 0,
    conflictingEdges,
  };
}

export function computeGreedyColoring(graph: Graph): Record<string, number> {
  const n = graph.vertices.length;
  if (n === 0) return {};

  // Build adjacency list
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  // Welsh-Powell heuristic: order by degree descending for better greedy bound
  const sortedVertices = [...graph.vertices].sort(
    (a, b) => (adj.get(b.id)?.length || 0) - (adj.get(a.id)?.length || 0)
  );

  const colors: Record<string, number> = {};

  for (const v of sortedVertices) {
    const neighborColors = new Set<number>();
    for (const neighbor of adj.get(v.id) || []) {
      if (colors[neighbor] !== undefined) {
        neighborColors.add(colors[neighbor]);
      }
    }

    let color = 0;
    while (neighborColors.has(color)) {
      color++;
    }
    colors[v.id] = color;
  }

  return colors;
}

export function computeChromaticNumber(graph: Graph): ColoringResult {
  const n = graph.vertices.length;

  if (n === 0) {
    return {
      chromaticNumber: 0,
      isExact: true,
      greedyColors: {},
      greedyColorCount: 0,
      isValid: true,
      palette: COLOR_PALETTE,
    };
  }

  if (graph.edges.length === 0) {
    // Independent set of vertices: all can share color 0
    const greedyColors: Record<string, number> = {};
    for (const v of graph.vertices) greedyColors[v.id] = 0;
    return {
      chromaticNumber: 1,
      isExact: true,
      greedyColors,
      greedyColorCount: 1,
      isValid: true,
      palette: COLOR_PALETTE,
    };
  }

  const greedyColors = computeGreedyColoring(graph);
  const greedyColorCount = new Set(Object.values(greedyColors)).size;

  // For small graphs (n <= 10), compute EXACT chromatic number by backtracking
  if (n <= 10) {
    // Adjacency matrix for fast conflict checking
    const vIds = graph.vertices.map((v) => v.id);
    const idToIdx = new Map<string, number>();
    vIds.forEach((id, i) => idToIdx.set(id, i));

    const adjMatrix: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
    for (const e of graph.edges) {
      const u = idToIdx.get(e.source);
      const v = idToIdx.get(e.target);
      if (u !== undefined && v !== undefined) {
        adjMatrix[u][v] = true;
        adjMatrix[v][u] = true;
      }
    }

    // Try k = 2 up to greedyColorCount
    for (let k = 2; k <= greedyColorCount; k++) {
      const currentAssignment: number[] = Array(n).fill(-1);

      function canColor(vertexIdx: number, colorIdx: number): boolean {
        for (let i = 0; i < n; i++) {
          if (adjMatrix[vertexIdx][i] && currentAssignment[i] === colorIdx) {
            return false;
          }
        }
        return true;
      }

      function solve(vertexIdx: number): boolean {
        if (vertexIdx === n) return true;

        for (let c = 0; c < k; c++) {
          if (canColor(vertexIdx, c)) {
            currentAssignment[vertexIdx] = c;
            if (solve(vertexIdx + 1)) return true;
            currentAssignment[vertexIdx] = -1;
          }
        }
        return false;
      }

      if (solve(0)) {
        return {
          chromaticNumber: k,
          isExact: true,
          greedyColors,
          greedyColorCount,
          isValid: true,
          palette: COLOR_PALETTE,
        };
      }
    }

    return {
      chromaticNumber: greedyColorCount,
      isExact: true,
      greedyColors,
      greedyColorCount,
      isValid: true,
      palette: COLOR_PALETTE,
    };
  }

  // For n > 10, return greedy count as upper bound
  return {
    chromaticNumber: greedyColorCount,
    isExact: false,
    greedyColors,
    greedyColorCount,
    isValid: true,
    palette: COLOR_PALETTE,
  };
}
