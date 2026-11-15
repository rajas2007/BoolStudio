import { Graph, ColoringResult, AlgorithmOutput, StepInfo } from '../types/graph';

export const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#84cc16', // Lime
];

export function validateColoring(
  graph: Graph,
  colors: Record<string, number>
): { isValid: boolean; conflictingEdges: string[] } {
  const conflictingEdges: string[] = [];

  for (const edge of graph.edges) {
    const c1 = colors[edge.source];
    const c2 = colors[edge.target];
    if (c1 !== undefined && c2 !== undefined && c1 === c2) {
      conflictingEdges.push(edge.id);
    }
  }

  return {
    isValid: conflictingEdges.length === 0,
    conflictingEdges,
  };
}

export function computeGreedyColoringWithOrder(
  graph: Graph,
  orderStrategy: 'degree' | 'alphabetical' = 'degree'
): { colors: Record<string, number>; steps: StepInfo[] } {
  const n = graph.vertices.length;
  if (n === 0) return { colors: {}, steps: [] };

  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) adj.set(v.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  const sortedVertices = [...graph.vertices].sort((a, b) => {
    if (orderStrategy === 'degree') {
      const degDiff = (adj.get(b.id)?.length || 0) - (adj.get(a.id)?.length || 0);
      if (degDiff !== 0) return degDiff;
    }
    return (a.label || a.id).localeCompare(b.label || b.id);
  });

  const colors: Record<string, number> = {};
  const steps: StepInfo[] = [];

  sortedVertices.forEach((v, idx) => {
    const neighborColors = new Set<number>();
    for (const neighbor of adj.get(v.id) || []) {
      if (colors[neighbor] !== undefined) {
        neighborColors.add(colors[neighbor]);
      }
    }

    let c = 0;
    while (neighborColors.has(c)) {
      c++;
    }
    colors[v.id] = c;

    const currentVertexColors: Record<string, string> = {};
    Object.entries(colors).forEach(([vId, colorIdx]) => {
      currentVertexColors[vId] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
    });

    const vLabel = v.label || v.id;
    const orderDesc = orderStrategy === 'degree' ? `(degree ${adj.get(v.id)?.length || 0})` : '(alphabetical)';
    steps.push({
      stepIndex: idx + 1,
      description: `Step ${idx + 1}: Assign Color ${c + 1} to '${vLabel}' ${orderDesc}.`,
      highlight: {
        vertices: Object.keys(colors),
        edges: [],
        vertexColors: currentVertexColors,
      },
    });
  });

  return { colors, steps };
}

// Find Max Clique size (lower bound for chromatic number)
function findMaxCliqueSize(graph: Graph): number {
  const n = graph.vertices.length;
  if (n === 0) return 0;
  if (graph.edges.length === 0) return 1;

  const adj = new Map<string, Set<string>>();
  for (const v of graph.vertices) adj.set(v.id, new Set());
  for (const e of graph.edges) {
    adj.get(e.source)?.add(e.target);
    adj.get(e.target)?.add(e.source);
  }

  let maxClique = 1;
  const vertices = graph.vertices.map((v) => v.id);

  function bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>) {
    if (p.size === 0 && x.size === 0) {
      if (r.size > maxClique) maxClique = r.size;
      return;
    }
    const pArr = Array.from(p);
    for (const v of pArr) {
      const neighbors = adj.get(v) || new Set();
      const newR = new Set(r).add(v);
      const newP = new Set([...p].filter((u) => neighbors.has(u)));
      const newX = new Set([...x].filter((u) => neighbors.has(u)));
      bronKerbosch(newR, newP, newX);
      p.delete(v);
      x.add(v);
    }
  }

  bronKerbosch(new Set(), new Set(vertices), new Set());
  return maxClique;
}

export function analyzeColoring(
  graph: Graph,
  orderStrategy: 'degree' | 'alphabetical' = 'degree',
  manualColors?: Record<string, number>
): AlgorithmOutput<ColoringResult> {
  const n = graph.vertices.length;
  const m = graph.edges.length;

  if (n === 0) {
    const res: ColoringResult = {
      greedyColors: {},
      greedyColorCount: 0,
      chromaticNumber: 0,
      isExact: true,
      cliqueLowerBound: 0,
      degreeUpperBound: 0,
      hasConflicts: false,
      conflictingEdges: [],
      explanation: 'Empty graph has chromatic number 0.',
    };
    return {
      result: res,
      explanation: res.explanation,
      highlight: { vertices: [], edges: [] },
      steps: [],
    };
  }

  // Degrees
  const degrees: Record<string, number> = {};
  for (const v of graph.vertices) degrees[v.id] = 0;
  for (const e of graph.edges) {
    degrees[e.source]++;
    degrees[e.target]++;
  }
  const maxDegree = Math.max(0, ...Object.values(degrees));

  const { colors: greedyColors, steps } = computeGreedyColoringWithOrder(graph, orderStrategy);
  const greedyColorCount = new Set(Object.values(greedyColors)).size;

  const cliqueLowerBound = findMaxCliqueSize(graph);
  const degreeUpperBound = maxDegree + 1;

  // Exact chromatic number for n <= 10
  let chromaticNumber = greedyColorCount;
  let isExact = false;

  if (m === 0) {
    chromaticNumber = 1;
    isExact = true;
  } else if (cliqueLowerBound === greedyColorCount) {
    chromaticNumber = greedyColorCount;
    isExact = true;
  } else if (n <= 10) {
    // Exact backtracking test from k = cliqueLowerBound to greedyColorCount
    const adj = new Map<string, string[]>();
    for (const v of graph.vertices) adj.set(v.id, []);
    for (const e of graph.edges) {
      adj.get(e.source)?.push(e.target);
      adj.get(e.target)?.push(e.source);
    }

    function canColorWithK(k: number): boolean {
      const assigned: Record<string, number> = {};
      function backtrack(idx: number): boolean {
        if (idx === graph.vertices.length) return true;
        const u = graph.vertices[idx].id;
        for (let c = 0; c < k; c++) {
          const conflict = (adj.get(u) || []).some((v) => assigned[v] === c);
          if (!conflict) {
            assigned[u] = c;
            if (backtrack(idx + 1)) return true;
            delete assigned[u];
          }
        }
        return false;
      }
      return backtrack(0);
    }

    for (let k = cliqueLowerBound; k <= greedyColorCount; k++) {
      if (canColorWithK(k)) {
        chromaticNumber = k;
        isExact = true;
        break;
      }
    }
  }

  // Conflict check if manual colors provided
  const activeColors = manualColors && Object.keys(manualColors).length > 0 ? manualColors : greedyColors;
  const { isValid, conflictingEdges } = validateColoring(graph, activeColors);

  const vertexColors: Record<string, string> = {};
  Object.entries(activeColors).forEach(([vId, colorIdx]) => {
    vertexColors[vId] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
  });

  const explanation = `Chromatic Number χ(G) = ${chromaticNumber} (${isExact ? 'exact' : 'upper bound'}). Bounds: Clique lower bound ω(G) = ${cliqueLowerBound} ≤ χ(G) ≤ Δ(G) + 1 = ${degreeUpperBound}. Greedy heuristic (${orderStrategy}) used ${greedyColorCount} color(s).`;

  const res: ColoringResult = {
    greedyColors,
    greedyColorCount,
    chromaticNumber,
    isExact,
    cliqueLowerBound,
    degreeUpperBound,
    hasConflicts: !isValid,
    conflictingEdges,
    explanation,
  };

  return {
    result: res,
    explanation,
    highlight: {
      vertices: graph.vertices.map((v) => v.id),
      edges: conflictingEdges,
      vertexColors,
    },
    steps,
  };
}
