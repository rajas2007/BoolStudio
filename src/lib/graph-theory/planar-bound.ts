import { Graph, PlanarBoundResult } from '../types/graph';
import { checkBipartite } from './bipartite';

export function evaluatePlanarBound(graph: Graph): PlanarBoundResult {
  const v = graph.vertices.length;
  const e = graph.edges.length;
  const bip = checkBipartite(graph);
  const isBipartite = bip.isBipartite;

  if (v < 3) {
    return {
      order: v,
      size: e,
      isBipartite,
      generalBound: 0,
      bipartiteBound: 0,
      violatesGeneral: false,
      violatesBipartite: false,
      status: 'TRIVIAL',
      explanation: `For graphs with |V| = ${v} < 3, the graph is trivially planar. The planar edge bound theorem applies to simple connected graphs with |V| ≥ 3.`,
      eulersFormulaNote: "Euler's formula states that for any connected planar graph with v vertices, e edges, and f faces: v - e + f = 2.",
    };
  }

  const generalBound = 3 * v - 6;
  const bipartiteBound = 2 * v - 4;

  const violatesGeneral = e > generalBound;
  const violatesBipartite = isBipartite && e > bipartiteBound;

  const violates = violatesGeneral || violatesBipartite;
  const status: 'VIOLATES' | 'SATISFIES' = violates ? 'VIOLATES' : 'SATISFIES';

  let explanation = '';
  if (violatesGeneral) {
    explanation = `VIOLATES General Planar Bound: |E| = ${e} exceeds 3|V| - 6 = 3(${v}) - 6 = ${generalBound}. By the Planar Graph Edge Bound Theorem, every simple planar graph must satisfy e ≤ 3v - 6. Therefore, this graph is DEFINITELY NON-PLANAR.`;
  } else if (violatesBipartite) {
    explanation = `VIOLATES Bipartite Planar Bound: Graph is bipartite (no odd cycles, all faces have degree ≥ 4) and has |E| = ${e}, which exceeds 2|V| - 4 = 2(${v}) - 4 = ${bipartiteBound}. Therefore, this graph is DEFINITELY NON-PLANAR.`;
  } else {
    explanation = `SATISFIES Edge Bounds: |E| = ${e} ≤ 3|V| - 6 = ${generalBound}${
      isBipartite ? ` and |E| = ${e} ≤ 2|V| - 4 = ${bipartiteBound}` : ''
    }. NOTE: The edge bound is a NECESSARY condition, NOT a sufficient condition. Satisfying this bound DOES NOT prove the graph is planar (e.g. the Petersen graph satisfies e = 15 ≤ 24, yet is non-planar).`;
  }

  const theoreticalFaces = Math.max(1, e - v + 2);
  const eulersFormulaNote = `Euler's Polyhedral Formula: v - e + f = 2 for connected planar graphs. If this graph were connected and planar, it would divide the plane into f = e - v + 2 = ${e} - ${v} + 2 = ${theoreticalFaces} face(s) (including the unbounded exterior face).`;

  return {
    order: v,
    size: e,
    isBipartite,
    generalBound,
    bipartiteBound,
    violatesGeneral,
    violatesBipartite,
    status,
    explanation,
    eulersFormulaNote,
  };
}
