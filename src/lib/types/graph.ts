export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
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
  vertices: string[]; // Vertex IDs in sequence
  edgeIds: string[];  // Edge IDs traversed
  length: number;
  isOpen: boolean;
  isClosed: boolean;
  isTrail: boolean;
  isPath: boolean;
  isCircuit: boolean;
  isCycle: boolean;
  classification: WalkClassification;
  explanation: string;
  error?: string;
}

export interface ComponentResult {
  count: number;
  components: string[][]; // Array of vertex IDs per component
  vertexComponentMap: Record<string, number>; // vertexId -> componentIndex
}

export interface EulerResult {
  hasEulerCircuit: boolean;
  hasEulerTrail: boolean;
  circuitOrTrail: string[]; // Sequence of vertex IDs
  circuitOrTrailEdges: string[]; // Sequence of edge IDs
  reason: string;
  oddDegreeVertices: string[];
}

export interface BipartiteResult {
  isBipartite: boolean;
  partitionA: string[]; // Vertex IDs in set A (color 0)
  partitionB: string[]; // Vertex IDs in set B (color 1)
  coloring: Record<string, 0 | 1>; // vertexId -> color
  oddCycle?: string[]; // Vertex IDs forming an odd cycle if non-bipartite
  explanation: string;
}

export interface ColoringResult {
  chromaticNumber: number; // Exact chromatic number for small graphs (<=10) or upper bound
  isExact: boolean;
  greedyColors: Record<string, number>; // vertexId -> color index (0, 1, 2...)
  greedyColorCount: number;
  isValid: boolean;
  palette: string[];
}

export interface TreeResult {
  isTree: boolean;
  isConnected: boolean;
  isAcyclic: boolean;
  order: number; // |V|
  size: number;  // |E|
  satisfiesSizeCondition: boolean; // |E| === |V| - 1
  failedConditions: string[];
  explanation: string;
}

export interface AdjacencyMatrix {
  vertices: string[]; // Vertex labels/IDs in order
  matrix: number[][];
  isSymmetric: boolean;
  rowSums: number[];
}

export interface IncidenceMatrix {
  vertices: string[];
  edges: string[]; // Edge labels (e.g. e1, e2...)
  edgeIds: string[];
  matrix: number[][]; // rows = vertices, cols = edges
  columnSums: number[];
}

export interface GraphProperties {
  order: number; // |V|
  size: number;  // |E|
  degrees: Record<string, number>;
  inDegrees: Record<string, number>;
  outDegrees: Record<string, number>;
  sumOfDegrees: number;
  handshakeValid: boolean;
  handshakeFormula: string;
}

export type EditorMode = 'select' | 'add-vertex' | 'add-edge' | 'delete';

export type TopicTab =
  | 'properties'
  | 'matrices'
  | 'walks'
  | 'components'
  | 'euler'
  | 'bipartite'
  | 'coloring'
  | 'tree';

export type PresetName =
  | 'empty'
  | 'single'
  | 'path'
  | 'cycle'
  | 'k_n'
  | 'k_mn'
  | 'tree'
  | 'petersen'
  | 'disconnected';
