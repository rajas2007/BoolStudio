export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  source: string; // Vertex ID
  target: string; // Vertex ID
}

export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
  isDirected: boolean;
}

export interface HighlightState {
  vertices: string[];
  edges: string[];
  vertexColors?: Record<string, string>; // vertexId -> hex color
  edgeColors?: Record<string, string>;   // edgeId -> hex color
}

export interface StepInfo {
  stepIndex: number;
  description: string;
  highlight: HighlightState;
}

export interface AlgorithmOutput<T = unknown> {
  result: T;
  explanation: string;
  highlight: HighlightState;
  steps?: StepInfo[];
}

export type EditorMode = 'select' | 'add-vertex' | 'add-edge' | 'delete';

export type TopicTab =
  | 'representations'
  | 'walks-connectivity'
  | 'euler'
  | 'hamiltonian'
  | 'trees'
  | 'bipartite'
  | 'matching'
  | 'planar'
  | 'colouring';

export type PresetName =
  | 'k_n'
  | 'k_mn'
  | 'cycle'
  | 'path'
  | 'star'
  | 'tree'
  | 'petersen'
  | 'planar'
  | 'non_planar'
  | 'disconnected'
  | 'empty';

// Topic 1: Representations & Properties
export interface RepresentationsResult {
  order: number; // |V|
  size: number;  // |E|
  adjacencyList: Record<string, string[]>; // vertexLabel -> neighborLabels
  adjacencyMatrix: {
    labels: string[];
    matrix: number[][];
    isSymmetric: boolean;
    rowSums: number[]; // degree (or out-degree)
    colSums: number[]; // degree (or in-degree)
  };
  incidenceMatrix: {
    vertexLabels: string[];
    edgeLabels: string[];
    edgeIds: string[];
    matrix: number[][];
    colSums: number[];
  };
  walkMatrixPowerK: {
    k: number;
    matrix: number[][];
  };
  handshake: {
    sumOfDegrees: number;
    expectedSum: number;
    isValid: boolean;
    formula: string;
  };
}

// Topic 2: Degrees, Walks, Cycles & Connectivity
export type WalkClassification =
  | 'Walk'
  | 'Trail'
  | 'Path'
  | 'Circuit'
  | 'Cycle'
  | 'Closed Walk'
  | 'Invalid';

export interface WalkAnalysis {
  isValid: boolean;
  classification: WalkClassification;
  vertices: string[]; // Vertex IDs in sequence
  edgeIds: string[];  // Edge IDs traversed
  length: number;
  isOpen: boolean;
  isClosed: boolean;
  isTrail: boolean;
  isPath: boolean;
  isCircuit: boolean;
  isCycle: boolean;
  explanation: string;
}

export interface DegreeWalksResult {
  degrees: Record<string, number>;
  inDegrees: Record<string, number>;
  outDegrees: Record<string, number>;
  oddDegreeVertices: string[];
  components: {
    count: number;
    groups: string[][]; // array of vertex IDs
    vertexComponentMap: Record<string, number>;
    isStronglyConnected?: boolean;
    strongComponents?: string[][];
  };
  queryPath?: {
    path: string[];
    shortestPath: string[];
    cycle: string[];
  };
}

// Topic 3: Euler Tours & Trails
export interface EulerResult {
  hasCircuit: boolean;
  hasTrail: boolean;
  circuitOrTrail: string[];      // sequence of vertex IDs
  circuitOrTrailEdges: string[]; // sequence of edge IDs
  oddVertices: string[];
  unbalancedVertices?: string[];
  isDisconnected: boolean;
  explanation: string;
}

// Topic 4: Hamiltonian Paths & Cycles
export interface HamiltonianResult {
  hasCycle: boolean;
  hasPath: boolean;
  cycle: string[];      // vertex IDs
  cycleEdges: string[]; // edge IDs
  path: string[];       // vertex IDs
  pathEdges: string[];  // edge IDs
  exceedsLimit: boolean;
  diracCondition: {
    holds: boolean;
    minDegree: number;
    threshold: number;
    explanation: string;
  };
  oreCondition: {
    holds: boolean;
    violatingPair?: [string, string];
    explanation: string;
  };
  explanation: string;
}

// Topic 5: Trees
export interface TreeResult {
  isTree: boolean;
  isConnected: boolean;
  isAcyclic: boolean;
  satisfiesSizeCondition: boolean; // |E| === |V| - 1
  order: number;
  size: number;
  leaves: string[]; // vertex IDs with degree 1
  degreeSequence: number[];
  cycleWitness?: string[]; // vertex IDs forming a cycle if cyclic
  spanningTreeEdges?: string[]; // edge IDs of BFS/DFS spanning tree if connected
  failedConditions: string[];
  explanation: string;
}

// Topic 6: Bipartite Graphs & 2-Colourability
export interface BipartiteResult {
  isBipartite: boolean;
  partitionA: string[]; // vertex IDs in Set A
  partitionB: string[]; // vertex IDs in Set B
  coloring: Record<string, 0 | 1>;
  oddCycle?: string[];  // vertex IDs forming odd cycle witness
  explanation: string;
}

// Topic 7: Maximum Matching & Hall's Condition
export interface MatchingResult {
  isBipartite: boolean;
  matchedEdges: string[]; // edge IDs in maximum matching
  matchingSize: number;
  isPerfect: boolean;
  saturatesSetA: boolean;
  saturatesSetB: boolean;
  hallCondition: {
    holds: boolean;
    violatingSubsetS?: string[]; // vertex IDs in S
    neighborsNS?: string[];      // vertex IDs in N(S)
    explanation: string;
  };
  explanation: string;
}

// Topic 8: Planar Graphs & Edge Bounds
export interface PlanarBoundResult {
  order: number;
  size: number;
  isBipartite: boolean;
  generalBound: number;   // 3v - 6
  bipartiteBound: number; // 2v - 4
  violatesGeneral: boolean;
  violatesBipartite: boolean;
  status: 'DEFINITELY_NON_PLANAR' | 'INCONCLUSIVE' | 'TRIVIAL';
  explanation: string;
  eulerFormulaFormula: string;
}

// Topic 9: Graph Colouring
export interface ColoringResult {
  greedyColors: Record<string, number>; // vertexId -> color index
  greedyColorCount: number;
  chromaticNumber: number; // exact or upper bound
  isExact: boolean;
  cliqueLowerBound: number;
  degreeUpperBound: number;
  hasConflicts: boolean;
  conflictingEdges: string[]; // edge IDs where source and target share a color
  explanation: string;
}
