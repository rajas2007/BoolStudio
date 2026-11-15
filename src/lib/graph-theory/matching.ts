import { Graph, MatchingResult } from '../types/graph';
import { checkBipartite } from './bipartite';

export function computeBipartiteMatching(graph: Graph): MatchingResult {
  const bip = checkBipartite(graph);

  if (!bip.isBipartite) {
    return {
      isBipartite: false,
      matchedEdges: [],
      matchingSize: 0,
      isPerfect: false,
      explanation: 'Graph is NOT bipartite. Maximum bipartite matching and Hall\'s Marriage Theorem specifically apply to bipartite graphs. To use this analysis, ensure the graph contains no odd cycles.',
    };
  }

  const { partitionA, partitionB } = bip;
  const totalVertices = graph.vertices.length;

  if (partitionA.length === 0 || partitionB.length === 0) {
    const isPerfect = totalVertices === 0;
    const violatorSet = partitionA.length > 0 ? partitionA : partitionB;
    return {
      isBipartite: true,
      matchedEdges: [],
      matchingSize: 0,
      isPerfect,
      violatorSetS: !isPerfect ? violatorSet : undefined,
      neighborSetNS: !isPerfect ? [] : undefined,
      explanation: isPerfect
        ? 'The empty graph trivially has a perfect matching of size 0.'
        : `One or both bipartite partitions are empty (${totalVertices} unmatched vertex(es)). With no opposing partition or edges, no matching is possible (maximum matching size 0).`,
    };
  }

  // Build undirected adjacency list between partitions
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

  // Augmenting Path Algorithm (Hopcroft-Karp / Ford-Fulkerson variant)
  const matchA = new Map<string, string>(); // u in A -> v in B
  const matchB = new Map<string, string>(); // v in B -> u in A

  function dfsAugment(u: string, visitedB: Set<string>): boolean {
    const neighbors = adjA.get(u) || [];
    for (const v of neighbors) {
      if (!visitedB.has(v)) {
        visitedB.add(v);
        // If v is unmatched, or can find augmenting path from matchB.get(v)
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
    dfsAugment(u, visitedB);
  }

  // Collect matched edge IDs
  const matchedEdges: string[] = [];
  matchA.forEach((v, u) => {
    const edgeId = edgeLookup.get(`${u}-${v}`);
    if (edgeId) {
      matchedEdges.push(edgeId);
    }
  });

  const matchingSize = matchedEdges.length;
  const isPerfect = totalVertices === 0 || (totalVertices > 0 && matchingSize * 2 === totalVertices);

  // Hall's Condition Violator search
  let violatorSetS: string[] | undefined = undefined;
  let neighborSetNS: string[] | undefined = undefined;

  if (matchingSize < partitionA.length) {
    // Unmatched vertices in A
    const unmatchedA = partitionA.filter((u) => !matchA.has(u));
    const reachableA = new Set<string>(unmatchedA);
    const reachableB = new Set<string>();

    const queue: string[] = [...unmatchedA];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of adjA.get(u) || []) {
        if (!reachableB.has(v)) {
          reachableB.add(v);
          const matchedBack = matchB.get(v);
          if (matchedBack !== undefined && !reachableA.has(matchedBack)) {
            reachableA.add(matchedBack);
            queue.push(matchedBack);
          }
        }
      }
    }

    if (reachableB.size < reachableA.size) {
      violatorSetS = Array.from(reachableA);
      neighborSetNS = Array.from(reachableB);
    }
  } else if (matchingSize < partitionB.length) {
    // Check for Hall violator in partition B into A
    const unmatchedB = partitionB.filter((v) => !matchB.has(v));
    const reachableB = new Set<string>(unmatchedB);
    const reachableA = new Set<string>();

    const adjB = new Map<string, string[]>();
    for (const v of partitionB) adjB.set(v, []);
    for (const [u, vList] of adjA.entries()) {
      for (const v of vList) {
        adjB.get(v)?.push(u);
      }
    }

    const queue: string[] = [...unmatchedB];
    while (queue.length > 0) {
      const v = queue.shift()!;
      for (const u of adjB.get(v) || []) {
        if (!reachableA.has(u)) {
          reachableA.add(u);
          const matchedBack = matchA.get(u);
          if (matchedBack !== undefined && !reachableB.has(matchedBack)) {
            reachableB.add(matchedBack);
            queue.push(matchedBack);
          }
        }
      }
    }

    if (reachableA.size < reachableB.size) {
      violatorSetS = Array.from(reachableB);
      neighborSetNS = Array.from(reachableA);
    }
  }

  let explanation = '';
  if (isPerfect) {
    explanation = `PERFECT MATCHING FOUND: Size = ${matchingSize}. Every vertex in both partition A (${partitionA.length}) and partition B (${partitionB.length}) is paired with an independent edge with no shared endpoints.`;
  } else {
    explanation = `MAXIMUM MATCHING: Size = ${matchingSize} (Not perfect). The largest possible set of mutually non-adjacent edges in this bipartite graph covers ${matchingSize * 2} out of ${totalVertices} vertices.`;
    if (violatorSetS && neighborSetNS) {
      explanation += ` Hall's Condition is violated: Subset S = {${violatorSetS.length} vertices} has only |N(S)| = ${neighborSetNS.length} neighbor(s) in the opposite partition (|N(S)| < |S|).`;
    }
  }

  return {
    isBipartite: true,
    matchedEdges,
    matchingSize,
    isPerfect,
    violatorSetS,
    neighborSetNS,
    explanation,
  };
}
