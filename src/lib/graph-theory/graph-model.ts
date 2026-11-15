import { Graph, Vertex, Edge } from '../types/graph';

export function createEmptyGraph(isDirected = false): Graph {
  return {
    vertices: [],
    edges: [],
    isDirected,
  };
}

/**
 * Returns the lowest alphabetically unused label (A, B, C... Z, then A1, B1...).
 * Reuses letters from deleted vertices.
 */
export function getNextAvailableLabel(vertices: Vertex[]): string {
  const existingLabels = new Set(vertices.map((v) => v.label.toUpperCase()));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // First pass: single letters A-Z
  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    if (!existingLabels.has(letter)) {
      return letter;
    }
  }

  // Second pass: A1, B1... A2, B2...
  let suffix = 1;
  while (suffix < 100) {
    for (let i = 0; i < alphabet.length; i++) {
      const candidate = `${alphabet[i]}${suffix}`;
      if (!existingLabels.has(candidate)) {
        return candidate;
      }
    }
    suffix++;
  }

  return `V${vertices.length + 1}`;
}

export function canAddEdge(
  graph: Graph,
  sourceId: string,
  targetId: string
): { valid: boolean; reason?: string } {
  if (sourceId === targetId) {
    return { valid: false, reason: 'Self-loops are not permitted in simple graphs.' };
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
    return { valid: false, reason: 'Parallel edges already exist between these vertices in a simple graph.' };
  }

  return { valid: true };
}

export function addVertex(graph: Graph, x: number, y: number, customLabel?: string): Graph {
  const label = customLabel || getNextAvailableLabel(graph.vertices);
  const newVertex: Vertex = {
    id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    label,
    x,
    y,
  };

  return {
    ...graph,
    vertices: [...graph.vertices, newVertex],
  };
}

export function removeVertex(graph: Graph, vertexId: string): Graph {
  return {
    ...graph,
    vertices: graph.vertices.filter((v) => v.id !== vertexId),
    edges: graph.edges.filter((e) => e.source !== vertexId && e.target !== vertexId),
  };
}

export function addEdge(graph: Graph, sourceId: string, targetId: string): Graph {
  const check = canAddEdge(graph, sourceId, targetId);
  if (!check.valid) {
    return graph;
  }

  const newEdge: Edge = {
    id: `e_${sourceId}_${targetId}_${Date.now()}`,
    source: sourceId,
    target: targetId,
  };

  return {
    ...graph,
    edges: [...graph.edges, newEdge],
  };
}

export function removeEdge(graph: Graph, edgeId: string): Graph {
  return {
    ...graph,
    edges: graph.edges.filter((e) => e.id !== edgeId),
  };
}

export function moveVertex(graph: Graph, vertexId: string, x: number, y: number): Graph {
  return {
    ...graph,
    vertices: graph.vertices.map((v) => (v.id === vertexId ? { ...v, x, y } : v)),
  };
}

export function toggleDirected(graph: Graph): Graph {
  const newEdges: Edge[] = [];
  if (graph.isDirected) {
    // When converting directed -> undirected, eliminate opposite parallel arcs
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
    // Undirected -> directed: keep edges as directed arcs
    newEdges.push(...graph.edges);
  }

  return {
    ...graph,
    isDirected: !graph.isDirected,
    edges: newEdges,
  };
}
