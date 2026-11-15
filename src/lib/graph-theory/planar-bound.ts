import { Graph, PlanarBoundResult, AlgorithmOutput } from '../types/graph';
import { checkBipartite } from './bipartite';

export function evaluatePlanarBound(graph: Graph): AlgorithmOutput<PlanarBoundResult> {
  const v = graph.vertices.length;

  // Simple undirected edges count
  const undirectedEdgeSet = new Set<string>();
  const edgeIdList: string[] = [];
  for (const edge of graph.edges) {
    if (edge.source !== edge.target) {
      const u = edge.source;
      const vId = edge.target;
      const key = u < vId ? `${u}--${vId}` : `${vId}--${u}`;
      if (!undirectedEdgeSet.has(key)) {
        undirectedEdgeSet.add(key);
        edgeIdList.push(edge.id);
      }
    }
  }
  const e = undirectedEdgeSet.size;

  const bip = checkBipartite(graph);
  const isBipartite = bip.result.isBipartite;

  if (v < 3) {
    const res: PlanarBoundResult = {
      order: v,
      size: e,
      isBipartite,
      generalBound: 0,
      bipartiteBound: 0,
      violatesGeneral: false,
      violatesBipartite: false,
      status: 'TRIVIAL',
      explanation: `For |V| = ${v} < 3, the graph is trivially planar. The planar edge bound theorem applies to simple connected graphs with |V| ≥ 3.`,
      eulerFormulaFormula: "Euler's formula: V - E + F = 2.",
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: graph.vertices.map((vx) => vx.id), edges: [] },
    };
  }

  const generalBound = 3 * v - 6;
  const bipartiteBound = 2 * v - 4;

  const violatesGeneral = e > generalBound;
  const violatesBipartite = isBipartite && e > bipartiteBound;
  const violates = violatesGeneral || violatesBipartite;

  let explanation = '';
  if (violatesGeneral) {
    explanation = `Definitely NOT Planar: |E| = ${e} exceeds general planar bound 3|V| - 6 = 3(${v}) - 6 = ${generalBound}. Every planar simple graph must satisfy E ≤ 3V - 6. (Standard example: K₅ has 10 > 9).`;
  } else if (violatesBipartite) {
    explanation = `Definitely NOT Planar: Graph is bipartite (triangle-free) and |E| = ${e} exceeds 2|V| - 4 = 2(${v}) - 4 = ${bipartiteBound}. Every bipartite planar simple graph must satisfy E ≤ 2V - 4. (Standard example: K₃,₃ has 9 > 8).`;
  } else {
    explanation = `Inconclusive (Bounds Satisfied): |E| = ${e} ≤ 3|V| - 6 = ${generalBound}${
      isBipartite ? ` and |E| ≤ 2|V| - 4 = ${bipartiteBound}` : ''
    }. NOTE: The edge bound is NECESSARY, NOT SUFFICIENT. Satisfying this does NOT prove planarity (e.g., the Petersen graph has 15 ≤ 24 yet is non-planar by Kuratowski's Theorem).`;
  }

  const theoreticalFaces = Math.max(1, e - v + 2);
  const eulerFormulaFormula = `Euler's Polyhedral Formula: V - E + F = 2. If connected and planar, F = E - V + 2 = ${e} - ${v} + 2 = ${theoreticalFaces} face(s) (including the exterior unbounded face).`;

  const res: PlanarBoundResult = {
    order: v,
    size: e,
    isBipartite,
    generalBound,
    bipartiteBound,
    violatesGeneral,
    violatesBipartite,
    status: violates ? 'DEFINITELY_NON_PLANAR' : 'INCONCLUSIVE',
    explanation,
    eulerFormulaFormula,
  };

  return {
    result: res,
    explanation,
    highlight: {
      vertices: graph.vertices.map((vx) => vx.id),
      edges: violates ? edgeIdList : [],
    },
  };
}
