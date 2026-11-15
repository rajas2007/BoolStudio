import { Graph, AdjacencyMatrix, IncidenceMatrix } from '../types/graph';

export function buildAdjacencyMatrix(graph: Graph): AdjacencyMatrix {
  const n = graph.vertices.length;
  const vertices = graph.vertices.map((v) => v.label || v.id);
  const vertexIdToIndex = new Map<string, number>();
  graph.vertices.forEach((v, idx) => vertexIdToIndex.set(v.id, idx));

  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (const edge of graph.edges) {
    const u = vertexIdToIndex.get(edge.source);
    const v = vertexIdToIndex.get(edge.target);
    if (u !== undefined && v !== undefined) {
      matrix[u][v] = 1;
      if (!graph.isDirected) {
        matrix[v][u] = 1;
      }
    }
  }

  // Check symmetry
  let isSymmetric = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] !== matrix[j][i]) {
        isSymmetric = false;
        break;
      }
    }
    if (!isSymmetric) break;
  }

  const rowSums = matrix.map((row) => row.reduce((sum, val) => sum + val, 0));

  return {
    vertices,
    matrix,
    isSymmetric,
    rowSums,
  };
}

export function buildIncidenceMatrix(graph: Graph): IncidenceMatrix {
  const n = graph.vertices.length;
  const m = graph.edges.length;
  const vertices = graph.vertices.map((v) => v.label || v.id);
  const edges = graph.edges.map((e, idx) => `e${idx + 1}`);
  const edgeIds = graph.edges.map((e) => e.id);

  const vertexIdToIndex = new Map<string, number>();
  graph.vertices.forEach((v, idx) => vertexIdToIndex.set(v.id, idx));

  const matrix: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

  graph.edges.forEach((edge, edgeIdx) => {
    const u = vertexIdToIndex.get(edge.source);
    const v = vertexIdToIndex.get(edge.target);

    if (u !== undefined && v !== undefined) {
      if (graph.isDirected) {
        // Directed: -1 for source (tail), +1 for target (head)
        matrix[u][edgeIdx] = -1;
        matrix[v][edgeIdx] = 1;
      } else {
        // Undirected: 1 for both endpoints
        matrix[u][edgeIdx] = 1;
        matrix[v][edgeIdx] = 1;
      }
    }
  });

  const columnSums = Array.from({ length: m }, (_, colIdx) => {
    let sum = 0;
    for (let rowIdx = 0; rowIdx < n; rowIdx++) {
      sum += matrix[rowIdx][colIdx];
    }
    return sum;
  });

  return {
    vertices,
    edges,
    edgeIds,
    matrix,
    columnSums,
  };
}
