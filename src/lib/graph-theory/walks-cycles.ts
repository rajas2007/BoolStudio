import { Graph, WalkAnalysis, WalkClassification } from '../types/graph';

export function validateStep(
  graph: Graph,
  fromVertexId: string,
  toVertexId: string
): { isValid: boolean; edgeId?: string; error?: string } {
  const edge = graph.edges.find((e) => {
    if (graph.isDirected) {
      return e.source === fromVertexId && e.target === toVertexId;
    }
    return (
      (e.source === fromVertexId && e.target === toVertexId) ||
      (e.source === toVertexId && e.target === fromVertexId)
    );
  });

  if (!edge) {
    const fromLabel = graph.vertices.find((v) => v.id === fromVertexId)?.label || fromVertexId;
    const toLabel = graph.vertices.find((v) => v.id === toVertexId)?.label || toVertexId;
    const dirMsg = graph.isDirected
      ? `No directed edge exists from '${fromLabel}' to '${toLabel}'.`
      : `No edge exists between '${fromLabel}' and '${toLabel}'.`;
    return { isValid: false, error: dirMsg };
  }

  return { isValid: true, edgeId: edge.id };
}

export function analyzeWalk(graph: Graph, vertexSequence: string[]): WalkAnalysis {
  if (vertexSequence.length === 0) {
    return {
      isValid: false,
      vertices: [],
      edgeIds: [],
      length: 0,
      isOpen: false,
      isClosed: false,
      isTrail: false,
      isPath: false,
      isCircuit: false,
      isCycle: false,
      classification: 'Invalid',
      explanation: 'No vertices selected. Click vertices on the canvas to build a walk.',
    };
  }

  if (vertexSequence.length === 1) {
    return {
      isValid: true,
      vertices: vertexSequence,
      edgeIds: [],
      length: 0,
      isOpen: true,
      isClosed: false,
      isTrail: true,
      isPath: true,
      isCircuit: false,
      isCycle: false,
      classification: 'Path',
      explanation: 'A trivial path of length 0 consisting of a single vertex.',
    };
  }

  const edgeIds: string[] = [];
  const traversedEdges: string[] = [];

  for (let i = 0; i < vertexSequence.length - 1; i++) {
    const u = vertexSequence[i];
    const v = vertexSequence[i + 1];
    const check = validateStep(graph, u, v);
    if (!check.isValid || !check.edgeId) {
      return {
        isValid: false,
        vertices: vertexSequence,
        edgeIds,
        length: i,
        isOpen: false,
        isClosed: false,
        isTrail: false,
        isPath: false,
        isCircuit: false,
        isCycle: false,
        classification: 'Invalid',
        explanation: check.error || 'Invalid step in walk.',
        error: check.error,
      };
    }
    edgeIds.push(check.edgeId);
    traversedEdges.push(check.edgeId);
  }

  const length = edgeIds.length;
  const first = vertexSequence[0];
  const last = vertexSequence[vertexSequence.length - 1];
  const isClosed = first === last && length > 0;
  const isOpen = !isClosed;

  // Check unique edges (trail condition)
  const uniqueEdges = new Set(traversedEdges);
  const isTrail = uniqueEdges.size === traversedEdges.length;

  // Check unique vertices (path condition)
  // For open path: all vertices distinct
  // For cycle: first == last, and all intermediate vertices distinct, length >= 3 for undirected (or >= 2 for directed)
  const allVerticesUnique = new Set(vertexSequence).size === vertexSequence.length;
  const isPath = isOpen && allVerticesUnique;

  const minCycleLength = graph.isDirected ? 2 : 3;
  const intermediateVertices = vertexSequence.slice(0, -1);
  const intermediateUnique = new Set(intermediateVertices).size === intermediateVertices.length;
  const isCycle = isClosed && intermediateUnique && length >= minCycleLength;
  const isCircuit = isClosed && isTrail && length > 0;

  let classification: WalkClassification = 'Walk';
  let explanation = '';

  if (isClosed) {
    if (isCycle) {
      classification = 'Cycle';
      explanation = `Cycle of length ${length}: Starts and ends at '${graph.vertices.find((v) => v.id === first)?.label}', with all intermediate vertices and edges distinct.`;
    } else if (isCircuit) {
      classification = 'Circuit';
      explanation = `Circuit of length ${length}: Closed trail (starts and ends at '${graph.vertices.find((v) => v.id === first)?.label}') with no repeated edges.`;
    } else {
      classification = 'Closed Walk';
      explanation = `Closed Walk of length ${length}: Starts and ends at '${graph.vertices.find((v) => v.id === first)?.label}', but contains repeated edges or intermediate vertices.`;
    }
  } else {
    if (isPath) {
      classification = 'Path';
      explanation = `Path of length ${length}: Open walk with all distinct vertices and edges.`;
    } else if (isTrail) {
      classification = 'Trail';
      explanation = `Trail of length ${length}: Open walk with all edges distinct, but some vertices are revisited.`;
    } else {
      classification = 'Walk';
      explanation = `Walk of length ${length}: Alternating sequence of vertices and edges with repeated edges and vertices.`;
    }
  }

  return {
    isValid: true,
    vertices: vertexSequence,
    edgeIds,
    length,
    isOpen,
    isClosed,
    isTrail,
    isPath,
    isCircuit,
    isCycle,
    classification,
    explanation,
  };
}
