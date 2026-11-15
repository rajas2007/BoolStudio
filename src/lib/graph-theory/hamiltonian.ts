import { Graph, HamiltonianResult, AlgorithmOutput, StepInfo } from '../types/graph';

export function findHamiltonianPathsAndCycles(graph: Graph): AlgorithmOutput<HamiltonianResult> {
  const n = graph.vertices.length;

  // Dirac and Ore conditions (for undirected simple graphs, n >= 3)
  const degrees: Record<string, number> = {};
  for (const v of graph.vertices) degrees[v.id] = 0;
  for (const e of graph.edges) {
    degrees[e.source]++;
    degrees[e.target]++;
  }

  let diracHolds = false;
  let diracMinDeg = 0;
  let diracThreshold = 0;
  let diracExplanation = '';

  let oreHolds = false;
  let oreViolatingPair: [string, string] | undefined;
  let oreExplanation = '';

  if (!graph.isDirected && n >= 3) {
    diracThreshold = n / 2;
    const degValues = Object.values(degrees);
    diracMinDeg = Math.min(...degValues);
    diracHolds = diracMinDeg >= diracThreshold;
    diracExplanation = diracHolds
      ? `Dirac's Theorem HOLDS: Minimum degree δ(G) = ${diracMinDeg} ≥ n/2 = ${diracThreshold}. Guarantees a Hamiltonian Cycle exists.`
      : `Dirac's Theorem does NOT hold: Minimum degree δ(G) = ${diracMinDeg} < n/2 = ${diracThreshold} (sufficient condition only; graph may still be Hamiltonian).`;

    // Ore's Theorem
    const adjSet = new Set<string>();
    for (const e of graph.edges) {
      adjSet.add(`${e.source}-${e.target}`);
      adjSet.add(`${e.target}-${e.source}`);
    }

    let foundOreViolation = false;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const u = graph.vertices[i];
        const v = graph.vertices[j];
        if (!adjSet.has(`${u.id}-${v.id}`)) {
          // Non-adjacent pair
          const sum = degrees[u.id] + degrees[v.id];
          if (sum < n) {
            foundOreViolation = true;
            oreViolatingPair = [u.label, v.label];
            oreExplanation = `Ore's condition does NOT hold: Non-adjacent pair (${u.label}, ${v.label}) has deg sum ${sum} < n = ${n}.`;
            break;
          }
        }
      }
      if (foundOreViolation) break;
    }

    if (!foundOreViolation) {
      oreHolds = true;
      oreExplanation = `Ore's Theorem HOLDS: For every non-adjacent pair, deg(u) + deg(v) ≥ n = ${n}. Guarantees a Hamiltonian Cycle exists.`;
    }
  } else {
    diracExplanation = 'Dirac condition applies to undirected graphs with n ≥ 3.';
    oreExplanation = 'Ore condition applies to undirected graphs with n ≥ 3.';
  }

  if (n === 0) {
    const res: HamiltonianResult = {
      hasCycle: false,
      hasPath: false,
      cycle: [],
      cycleEdges: [],
      path: [],
      pathEdges: [],
      exceedsLimit: false,
      diracCondition: { holds: false, minDegree: 0, threshold: 0, explanation: diracExplanation },
      oreCondition: { holds: false, explanation: oreExplanation },
      explanation: 'Empty graph has no vertices.',
    };
    return { result: res, explanation: res.explanation, highlight: { vertices: [], edges: [] }, steps: [] };
  }

  if (n === 1) {
    const res: HamiltonianResult = {
      hasCycle: false,
      hasPath: true,
      cycle: [],
      cycleEdges: [],
      path: [graph.vertices[0].id],
      pathEdges: [],
      exceedsLimit: false,
      diracCondition: { holds: false, minDegree: 0, threshold: 0, explanation: diracExplanation },
      oreCondition: { holds: false, explanation: oreExplanation },
      explanation: 'A single vertex trivially has a Hamiltonian path of length 0, but no cycle.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: [graph.vertices[0].id], edges: [] },
      steps: [],
    };
  }

  if (n > 12) {
    const res: HamiltonianResult = {
      hasCycle: false,
      hasPath: false,
      cycle: [],
      cycleEdges: [],
      path: [],
      pathEdges: [],
      exceedsLimit: true,
      diracCondition: { holds: diracHolds, minDegree: diracMinDeg, threshold: diracThreshold, explanation: diracExplanation },
      oreCondition: { holds: oreHolds, violatingPair: oreViolatingPair, explanation: oreExplanation },
      explanation: `Vertex limit exceeded (|V| = ${n} > 12). Hamiltonian path is NP-complete; backtracking is capped at n ≤ 12 for instant responsiveness.`,
    };
    return { result: res, explanation: res.explanation, highlight: { vertices: [], edges: [] }, steps: [] };
  }

  // Backtracking search
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);

  const edgeMap = new Map<string, string>(); // "u->v" => edgeId
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    edgeMap.set(`${e.source}->${e.target}`, e.id);
    if (!graph.isDirected) {
      adj.get(e.target)?.push(e.source);
      edgeMap.set(`${e.target}->${e.source}`, e.id);
    }
  }

  // 1. Search for Hamiltonian Cycle
  let foundCycle: string[] | null = null;
  const cycleEdges: string[] = [];

  if (n >= 3) {
    const startV = graph.vertices[0].id;
    const visited = new Set<string>([startV]);
    const cycleStack: string[] = [startV];

    function searchCycle(curr: string): boolean {
      if (cycleStack.length === n) {
        const closingEdge = edgeMap.get(`${curr}->${startV}`);
        if (closingEdge) {
          foundCycle = [...cycleStack, startV];
          return true;
        }
        return false;
      }

      for (const next of adj.get(curr) || []) {
        if (!visited.has(next)) {
          visited.add(next);
          cycleStack.push(next);
          if (searchCycle(next)) return true;
          cycleStack.pop();
          visited.delete(next);
        }
      }
      return false;
    }

    searchCycle(startV);

    if (foundCycle) {
      for (let i = 0; i < (foundCycle as string[]).length - 1; i++) {
        const u = (foundCycle as string[])[i];
        const v = (foundCycle as string[])[i + 1];
        const eId = edgeMap.get(`${u}->${v}`);
        if (eId) cycleEdges.push(eId);
      }
    }
  }

  // 2. Search for Hamiltonian Path
  let foundPath: string[] | null = null;
  const pathEdges: string[] = [];

  for (const startV of graph.vertices) {
    if (foundPath) break;
    const visited = new Set<string>([startV.id]);
    const pathStack: string[] = [startV.id];

    function searchPath(curr: string): boolean {
      if (pathStack.length === n) {
        foundPath = [...pathStack];
        return true;
      }
      for (const next of adj.get(curr) || []) {
        if (!visited.has(next)) {
          visited.add(next);
          pathStack.push(next);
          if (searchPath(next)) return true;
          pathStack.pop();
          visited.delete(next);
        }
      }
      return false;
    }

    searchPath(startV.id);
  }

  if (foundPath) {
    for (let i = 0; i < (foundPath as string[]).length - 1; i++) {
      const u = (foundPath as string[])[i];
      const v = (foundPath as string[])[i + 1];
      const eId = edgeMap.get(`${u}->${v}`);
      if (eId) pathEdges.push(eId);
    }
  }

  const hasCycle = foundCycle !== null;
  const hasPath = foundPath !== null;

  const sequenceToStep = hasCycle ? foundCycle! : (foundPath || []);
  const edgesToStep = hasCycle ? cycleEdges : pathEdges;

  const steps: StepInfo[] = [];
  if (sequenceToStep.length > 0) {
    steps.push({
      stepIndex: 0,
      description: `Start at vertex '${graph.vertices.find(v => v.id === sequenceToStep[0])?.label}'.`,
      highlight: { vertices: [sequenceToStep[0]], edges: [] },
    });
    for (let i = 0; i < edgesToStep.length; i++) {
      const subV = sequenceToStep.slice(0, i + 2);
      const subE = edgesToStep.slice(0, i + 1);
      const nextLabel = graph.vertices.find(v => v.id === sequenceToStep[i + 1])?.label;
      steps.push({
        stepIndex: i + 1,
        description: `Visit vertex '${nextLabel}'.`,
        highlight: { vertices: subV, edges: subE },
      });
    }
  }

  let explanation = '';
  if (hasCycle) {
    explanation = `Hamiltonian Cycle found! Visits all ${n} vertices exactly once and returns to start.`;
  } else if (hasPath) {
    explanation = `Hamiltonian Path found! Visits all ${n} vertices without repeating, but cannot close into a cycle.`;
  } else {
    explanation = `No Hamiltonian path or cycle exists. Note: There is no simple necessary-and-sufficient condition for Hamiltonian graphs (NP-complete).`;
  }

  const res: HamiltonianResult = {
    hasCycle,
    hasPath,
    cycle: foundCycle || [],
    cycleEdges,
    path: foundPath || [],
    pathEdges,
    exceedsLimit: false,
    diracCondition: {
      holds: diracHolds,
      minDegree: diracMinDeg,
      threshold: diracThreshold,
      explanation: diracExplanation,
    },
    oreCondition: {
      holds: oreHolds,
      violatingPair: oreViolatingPair,
      explanation: oreExplanation,
    },
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: {
      vertices: hasCycle ? (foundCycle || []) : (foundPath || []),
      edges: hasCycle ? cycleEdges : pathEdges,
    },
    steps,
  };
}
