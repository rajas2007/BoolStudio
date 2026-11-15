import { Graph, RepresentationsResult, AlgorithmOutput } from '../types/graph';

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const n = a.length;
  const result: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      if (a[i][k] === 0) continue;
      for (let j = 0; j < n; j++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

export function computeRepresentations(graph: Graph, powerK = 2): AlgorithmOutput<RepresentationsResult> {
  const n = graph.vertices.length;
  const m = graph.edges.length;
  const vertexLabels = graph.vertices.map((v) => v.label || v.id);
  const vertexIdToIndex = new Map<string, number>();
  graph.vertices.forEach((v, idx) => vertexIdToIndex.set(v.id, idx));

  // 1. Adjacency List
  const adjacencyList: Record<string, string[]> = {};
  for (const v of graph.vertices) {
    adjacencyList[v.label] = [];
  }
  for (const e of graph.edges) {
    const u = graph.vertices.find((v) => v.id === e.source);
    const v = graph.vertices.find((v) => v.id === e.target);
    if (u && v) {
      adjacencyList[u.label]?.push(v.label);
      if (!graph.isDirected) {
        adjacencyList[v.label]?.push(u.label);
      }
    }
  }

  // 2. Adjacency Matrix
  const adjMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (const edge of graph.edges) {
    const u = vertexIdToIndex.get(edge.source);
    const v = vertexIdToIndex.get(edge.target);
    if (u !== undefined && v !== undefined) {
      adjMatrix[u][v] = 1;
      if (!graph.isDirected) {
        adjMatrix[v][u] = 1;
      }
    }
  }

  let isSymmetric = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (adjMatrix[i][j] !== adjMatrix[j][i]) {
        isSymmetric = false;
        break;
      }
    }
    if (!isSymmetric) break;
  }

  const rowSums = adjMatrix.map((row) => row.reduce((sum, val) => sum + val, 0));
  const colSums = Array.from({ length: n }, (_, colIdx) => {
    let sum = 0;
    for (let rowIdx = 0; rowIdx < n; rowIdx++) {
      sum += adjMatrix[rowIdx][colIdx];
    }
    return sum;
  });

  // 3. Incidence Matrix
  const edgeLabels = graph.edges.map((_, idx) => `e${idx + 1}`);
  const edgeIds = graph.edges.map((e) => e.id);
  const incMatrix: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

  graph.edges.forEach((edge, edgeIdx) => {
    const u = vertexIdToIndex.get(edge.source);
    const v = vertexIdToIndex.get(edge.target);
    if (u !== undefined && v !== undefined) {
      if (graph.isDirected) {
        incMatrix[u][edgeIdx] = 1;   // Tail (+1)
        incMatrix[v][edgeIdx] = -1;  // Head (-1)
      } else {
        incMatrix[u][edgeIdx] = 1;
        incMatrix[v][edgeIdx] = 1;
      }
    }
  });

  const incColSums = Array.from({ length: m }, (_, colIdx) => {
    let sum = 0;
    for (let rowIdx = 0; rowIdx < n; rowIdx++) {
      sum += incMatrix[rowIdx][colIdx];
    }
    return sum;
  });

  // 4. Matrix power A^k
  const kClamped = Math.max(1, Math.min(5, powerK));
  let powered = adjMatrix;
  for (let step = 1; step < kClamped; step++) {
    powered = multiplyMatrices(powered, adjMatrix);
  }

  // 5. Handshake Lemma
  let sumOfDegrees = 0;
  let expectedSum = 0;
  let handshakeValid = false;
  let formula = '';

  if (graph.isDirected) {
    const sumOut = rowSums.reduce((acc, s) => acc + s, 0);
    const sumIn = colSums.reduce((acc, s) => acc + s, 0);
    sumOfDegrees = sumOut;
    expectedSum = m;
    handshakeValid = sumOut === m && sumIn === m;
    formula = `Σ out-deg(v) = ${sumOut}, Σ in-deg(v) = ${sumIn}, |E| = ${m} (Σ in = Σ out = |E|)`;
  } else {
    sumOfDegrees = rowSums.reduce((acc, s) => acc + s, 0);
    expectedSum = 2 * m;
    handshakeValid = sumOfDegrees === 2 * m;
    formula = `Σ deg(v) = ${sumOfDegrees} = 2 × |E| = 2 × ${m} = ${2 * m}`;
  }

  const explanation = graph.isDirected
    ? `Directed graph: |V| = ${n}, |E| = ${m}. In-degrees equal column sums; out-degrees equal row sums.`
    : `Undirected graph: |V| = ${n}, |E| = ${m}. Adjacency matrix is symmetric (${isSymmetric ? 'Yes' : 'No'}); Handshaking holds: Σ deg(v) = 2|E|.`;

  return {
    result: {
      order: n,
      size: m,
      adjacencyList,
      adjacencyMatrix: {
        labels: vertexLabels,
        matrix: adjMatrix,
        isSymmetric,
        rowSums,
        colSums,
      },
      incidenceMatrix: {
        vertexLabels,
        edgeLabels,
        edgeIds,
        matrix: incMatrix,
        colSums: incColSums,
      },
      walkMatrixPowerK: {
        k: kClamped,
        matrix: powered,
      },
      handshake: {
        sumOfDegrees,
        expectedSum,
        isValid: handshakeValid,
        formula,
      },
    },
    explanation,
    highlight: {
      vertices: [],
      edges: [],
    },
  };
}
