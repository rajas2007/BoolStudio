import { Graph, MatchingResult, AlgorithmOutput, StepInfo } from '../types/graph';
import { checkBipartite } from './bipartite';

export function computeBipartiteMatching(graph: Graph): AlgorithmOutput<MatchingResult> {
  const bip = checkBipartite(graph);

  if (!bip.result.isBipartite) {
    const res: MatchingResult = {
      isBipartite: false,
      matchedEdges: [],
      matchingSize: 0,
      isPerfect: false,
      saturatesSetA: false,
      saturatesSetB: false,
      hallCondition: {
        holds: false,
        explanation: 'Hall\'s Marriage Theorem applies exclusively to bipartite graphs.',
      },
      explanation: 'Graph is NOT bipartite. Matching requires a bipartite graph with no odd cycles.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: bip.highlight.vertices, edges: bip.highlight.edges },
      steps: [],
    };
  }

  const { partitionA, partitionB } = bip.result;
  const totalVertices = graph.vertices.length;

  if (partitionA.length === 0 || partitionB.length === 0) {
    const isPerfect = totalVertices === 0;
    const res: MatchingResult = {
      isBipartite: true,
      matchedEdges: [],
      matchingSize: 0,
      isPerfect,
      saturatesSetA: isPerfect,
      saturatesSetB: isPerfect,
      hallCondition: {
        holds: isPerfect,
        explanation: isPerfect
          ? 'Trivially perfect matching of size 0 on empty graph.'
          : 'One partition has 0 vertices; no edges can exist between partitions.',
      },
      explanation: isPerfect
        ? 'Empty graph trivially has a matching of size 0.'
        : 'One partition is empty. No bipartite edges exist.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: [], edges: [] },
      steps: [],
    };
  }

  // Build bipartite adjacency map
  const adjA = new Map<string, string[]>();
  for (const u of partitionA) adjA.set(u, []);

  const edgeLookup = new Map<string, string>(); // "u-v" => edgeId
  for (const e of graph.edges) {
    if (partitionA.includes(e.source) && partitionB.includes(e.target)) {
      adjA.get(e.source)?.push(e.target);
      edgeLookup.set(`${e.source}-${e.target}`, e.id);
      edgeLookup.set(`${e.target}-${e.source}`, e.id);
    } else if (partitionA.includes(e.target) && partitionB.includes(e.source)) {
      adjA.get(e.target)?.push(e.source);
      edgeLookup.set(`${e.target}-${e.source}`, e.id);
      edgeLookup.set(`${e.source}-${e.target}`, e.id);
    }
  }

  // Augmenting Path Algorithm
  const matchA = new Map<string, string>(); // u in A -> v in B
  const matchB = new Map<string, string>(); // v in B -> u in A
  const steps: StepInfo[] = [];

  function dfsAugment(u: string, visitedB: Set<string>): boolean {
    for (const v of adjA.get(u) || []) {
      if (!visitedB.has(v)) {
        visitedB.add(v);
        const currentMatch = matchB.get(v);
        if (currentMatch === undefined || dfsAugment(currentMatch, visitedB)) {
          matchA.set(u, v);
          matchB.set(v, u);
          return true;
        }
      }
    }
    return false;
  }

  for (const u of partitionA) {
    const visitedB = new Set<string>();
    if (dfsAugment(u, visitedB)) {
      const currentMatchedEdgeIds: string[] = [];
      matchA.forEach((v, k) => {
        const eId = edgeLookup.get(`${k}-${v}`);
        if (eId) currentMatchedEdgeIds.push(eId);
      });
      const uLabel = graph.vertices.find((v) => v.id === u)?.label || u;
      const matchedWith = matchA.get(u);
      const vLabel = graph.vertices.find((v) => v.id === matchedWith)?.label || matchedWith;

      steps.push({
        stepIndex: steps.length + 1,
        description: `Augment matching: Matched '${uLabel}' (Set A) with '${vLabel}' (Set B). Current matching size: ${currentMatchedEdgeIds.length}.`,
        highlight: {
          vertices: Array.from(matchA.keys()).concat(Array.from(matchA.values())),
          edges: currentMatchedEdgeIds,
        },
      });
    }
  }

  const matchedEdges: string[] = [];
  matchA.forEach((v, u) => {
    const edgeId = edgeLookup.get(`${u}-${v}`);
    if (edgeId) matchedEdges.push(edgeId);
  });

  const matchingSize = matchedEdges.length;
  const isPerfect = totalVertices > 0 && matchingSize * 2 === totalVertices;
  const saturatesSetA = matchingSize === partitionA.length;
  const saturatesSetB = matchingSize === partitionB.length;

  // Hall's Marriage Theorem condition check
  let violatorSetS: string[] | undefined;
  let neighborSetNS: string[] | undefined;
  let hallExplanation = '';
  let hallHolds = false;

  if (isPerfect) {
    hallHolds = true;
    hallExplanation = `Hall's Marriage Condition HOLDS: Complete perfect matching exists (|M| = ${matchingSize}). Every subset S satisfies |N(S)| ≥ |S|.`;
  } else if (!saturatesSetA) {
    // Construct violating subset S ⊆ A via alternating BFS from unmatched vertices in A
    const unmatchedA = partitionA.filter((u) => !matchA.has(u));
    const reachableA = new Set<string>(unmatchedA);
    const reachableB = new Set<string>();
    const queue = [...unmatchedA];

    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of adjA.get(u) || []) {
        if (!reachableB.has(v)) {
          reachableB.add(v);
          const matchedU = matchB.get(v);
          if (matchedU && !reachableA.has(matchedU)) {
            reachableA.add(matchedU);
            queue.push(matchedU);
          }
        }
      }
    }

    violatorSetS = Array.from(reachableA);
    neighborSetNS = Array.from(reachableB);

    const sLabels = violatorSetS.map((id) => graph.vertices.find((v) => v.id === id)?.label || id);
    const nsLabels = neighborSetNS.map((id) => graph.vertices.find((v) => v.id === id)?.label || id);

    hallExplanation = `Hall's Condition VIOLATED by subset S ⊆ Set A = {${sLabels.join(', ')}} with |S| = ${violatorSetS.length}, but its neighbors N(S) = {${nsLabels.join(', ')}} has |N(S)| = ${neighborSetNS.length} < |S|.`;
  } else if (!saturatesSetB) {
    // Construct violating subset S ⊆ B via alternating BFS from unmatched vertices in B
    // Build adjB
    const adjB = new Map<string, string[]>();
    for (const v of partitionB) adjB.set(v, []);
    for (const u of partitionA) {
      for (const v of adjA.get(u) || []) {
        adjB.get(v)?.push(u);
      }
    }

    const unmatchedB = partitionB.filter((v) => !matchB.has(v));
    const reachableB = new Set<string>(unmatchedB);
    const reachableA = new Set<string>();
    const queue = [...unmatchedB];

    while (queue.length > 0) {
      const v = queue.shift()!;
      for (const u of adjB.get(v) || []) {
        if (!reachableA.has(u)) {
          reachableA.add(u);
          const matchedV = matchA.get(u);
          if (matchedV && !reachableB.has(matchedV)) {
            reachableB.add(matchedV);
            queue.push(matchedV);
          }
        }
      }
    }

    violatorSetS = Array.from(reachableB);
    neighborSetNS = Array.from(reachableA);

    const sLabels = violatorSetS.map((id) => graph.vertices.find((vx) => vx.id === id)?.label || id);
    const nsLabels = neighborSetNS.map((id) => graph.vertices.find((vx) => vx.id === id)?.label || id);

    hallExplanation = `Hall's Condition VIOLATED by subset S ⊆ Set B = {${sLabels.join(', ')}} with |S| = ${violatorSetS.length}, but its neighbors N(S) = {${nsLabels.join(', ')}} has |N(S)| = ${neighborSetNS.length} < |S|.`;
  }

  const edgeColors: Record<string, string> = {};
  matchedEdges.forEach((id) => {
    edgeColors[id] = '#10b981'; // Emerald for matched edges
  });

  const vertexColors: Record<string, string> = {};
  partitionA.forEach((id) => {
    vertexColors[id] = violatorSetS?.includes(id) ? '#f43f5e' : '#6366f1';
  });
  partitionB.forEach((id) => {
    vertexColors[id] = violatorSetS?.includes(id) ? '#f43f5e' : (neighborSetNS?.includes(id) ? '#f59e0b' : '#10b981');
  });

  let explanation = '';
  if (isPerfect) {
    explanation = `PERFECT MATCHING found! Size |M| = ${matchingSize}. Every vertex in the graph is matched (${2 * matchingSize} / ${totalVertices}).`;
  } else if (saturatesSetA && saturatesSetB) {
    explanation = `Maximum matching found of size |M| = ${matchingSize}. Saturates both partitions.`;
  } else {
    explanation = `Maximum matching found of size |M| = ${matchingSize} (no perfect matching possible). ${hallExplanation}`;
  }

  const res: MatchingResult = {
    isBipartite: true,
    matchedEdges,
    matchingSize,
    isPerfect,
    saturatesSetA,
    saturatesSetB,
    hallCondition: {
      holds: hallHolds,
      violatingSubsetS: violatorSetS,
      neighborsNS: neighborSetNS,
      explanation: hallExplanation,
    },
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: {
      vertices: violatorSetS ? violatorSetS.concat(neighborSetNS || []) : Array.from(matchA.keys()).concat(Array.from(matchA.values())),
      edges: matchedEdges,
      edgeColors,
      vertexColors,
    },
    steps,
  };
}
