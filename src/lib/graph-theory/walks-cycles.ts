import { Graph, WalkAnalysis, WalkClassification, AlgorithmOutput } from '../types/graph';

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

export function analyzeWalk(graph: Graph, vertexSequence: string[]): AlgorithmOutput<WalkAnalysis> {
  if (vertexSequence.length === 0) {
    const res: WalkAnalysis = {
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
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: [], edges: [] },
    };
  }

  if (vertexSequence.length === 1) {
    const res: WalkAnalysis = {
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
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: vertexSequence, edges: [] },
    };
  }

  const edgeIds: string[] = [];
  const traversedEdges: string[] = [];

  for (let i = 0; i < vertexSequence.length - 1; i++) {
    const u = vertexSequence[i];
    const v = vertexSequence[i + 1];
    const check = validateStep(graph, u, v);
    if (!check.isValid || !check.edgeId) {
      const res: WalkAnalysis = {
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
        explanation: check.error || 'Invalid step: edge does not exist.',
      };
      return {
        result: res,
        explanation: res.explanation,
        highlight: { vertices: [u, v], edges: edgeIds },
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

  // Trail: no repeated edges
  const uniqueEdges = new Set(traversedEdges);
  const isTrail = uniqueEdges.size === traversedEdges.length;

  // Path: no repeated vertices (except start === end if closed cycle)
  const internalVertices = isClosed ? vertexSequence.slice(0, -1) : vertexSequence;
  const uniqueVertices = new Set(internalVertices);
  const isPath = uniqueVertices.size === internalVertices.length;

  // Circuit: closed trail
  const isCircuit = isClosed && isTrail;

  // Cycle: closed path (length >= 3 for undirected simple graph, length >= 2 for directed)
  const minCycleLength = graph.isDirected ? 2 : 3;
  const isCycle = isClosed && isPath && length >= minCycleLength;

  let classification: WalkClassification = 'Walk';
  let explanation = '';

  if (isCycle) {
    classification = 'Cycle';
    explanation = `Closed path of length ${length}: starts and ends at '${graph.vertices.find(v => v.id === first)?.label}', visiting no vertex twice.`;
  } else if (isCircuit) {
    classification = 'Circuit';
    explanation = `Closed trail of length ${length}: starts and ends at '${graph.vertices.find(v => v.id === first)?.label}', repeating no edges.`;
  } else if (isClosed) {
    classification = 'Closed Walk';
    explanation = `Closed walk of length ${length}: starts and ends at the same vertex, with repeated edges or vertices.`;
  } else if (isPath) {
    classification = 'Path';
    explanation = `Open path of length ${length}: visits no vertex twice (and repeats no edges).`;
  } else if (isTrail) {
    classification = 'Trail';
    explanation = `Open trail of length ${length}: repeats no edges, but revisits one or more vertices.`;
  } else {
    classification = 'Walk';
    explanation = `General open walk of length ${length} with repeated vertices or edges.`;
  }

  const res: WalkAnalysis = {
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

  return {
    result: res,
    explanation,
    highlight: {
      vertices: vertexSequence,
      edges: edgeIds,
    },
  };
}
