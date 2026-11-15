import { Graph, Vertex, Edge, GraphProperties } from '../types/graph';

export function createEmptyGraph(isDirected = false): Graph {
  return {
    vertices: [],
    edges: [],
    isDirected,
  };
}

export function computeGraphProperties(graph: Graph): GraphProperties {
  const order = graph.vertices.length;
  const size = graph.edges.length;

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

  const sumOfDegrees = Object.values(degrees).reduce((acc, d) => acc + d, 0);

  let handshakeValid = false;
  let handshakeFormula = '';

  if (graph.isDirected) {
    const sumIn = Object.values(inDegrees).reduce((acc, d) => acc + d, 0);
    const sumOut = Object.values(outDegrees).reduce((acc, d) => acc + d, 0);
    handshakeValid = sumIn === size && sumOut === size;
    handshakeFormula = `Σ in-deg(v) = ${sumIn}, Σ out-deg(v) = ${sumOut}, |E| = ${size} (Σ in-deg = Σ out-deg = |E|)`;
  } else {
    handshakeValid = sumOfDegrees === 2 * size;
    handshakeFormula = `Σ deg(v) = ${sumOfDegrees} = 2 × |E| = 2 × ${size} = ${2 * size}`;
  }

  return {
    order,
    size,
    degrees,
    inDegrees,
    outDegrees,
    sumOfDegrees,
    handshakeValid,
    handshakeFormula,
  };
}

export function canAddEdge(graph: Graph, sourceId: string, targetId: string): { valid: boolean; reason?: string } {
  if (sourceId === targetId) {
    return { valid: false, reason: 'Self-loops are disallowed in simple graphs.' };
  }

  const vertexIds = new Set(graph.vertices.map((v) => v.id));
  if (!vertexIds.has(sourceId) || !vertexIds.has(targetId)) {
    return { valid: false, reason: 'One or both vertices do not exist.' };
  }

  const existing = graph.edges.some((e) => {
    if (graph.isDirected) {
      return e.source === sourceId && e.target === targetId;
    }
    return (
      (e.source === sourceId && e.target === targetId) ||
      (e.source === targetId && e.target === sourceId)
    );
  });

  if (existing) {
    return { valid: false, reason: 'Parallel/multi-edges are disallowed in simple graphs.' };
  }

  return { valid: true };
}

export function addVertex(graph: Graph, vertex: Vertex): Graph {
  return {
    ...graph,
    vertices: [...graph.vertices, vertex],
  };
}

export function removeVertex(graph: Graph, vertexId: string): Graph {
  return {
    ...graph,
    vertices: graph.vertices.filter((v) => v.id !== vertexId),
    edges: graph.edges.filter((e) => e.source !== vertexId && e.target !== vertexId),
  };
}

export function addEdge(graph: Graph, edge: Edge): Graph {
  const check = canAddEdge(graph, edge.source, edge.target);
  if (!check.valid) {
    return graph;
  }
  return {
    ...graph,
    edges: [...graph.edges, edge],
  };
}

export function removeEdge(graph: Graph, edgeId: string): Graph {
  return {
    ...graph,
    edges: graph.edges.filter((e) => e.id !== edgeId),
  };
}

export function toggleDirected(graph: Graph): Graph {
  // When converting to undirected, deduplicate any reverse edges
  const newEdges: Edge[] = [];
  if (graph.isDirected) {
    for (const e of graph.edges) {
      const exists = newEdges.some(
        (existing) =>
          (existing.source === e.source && existing.target === e.target) ||
          (existing.source === e.target && existing.target === e.source)
      );
      if (!exists) {
        newEdges.push(e);
      }
    }
  } else {
    newEdges.push(...graph.edges);
  }

  return {
    ...graph,
    isDirected: !graph.isDirected,
    edges: newEdges,
  };
}
