export type OperatorType = '&' | '|' | '!' | '^';

export interface Token {
  type: 'VARIABLE' | 'OPERATOR' | 'LPAREN' | 'RPAREN';
  value: string;
  position: number;
}

export type ASTNode =
  | { type: 'VARIABLE'; name: string }
  | { type: 'NOT'; child: ASTNode }
  | { type: 'AND'; left: ASTNode; right: ASTNode }
  | { type: 'OR'; left: ASTNode; right: ASTNode }
  | { type: 'XOR'; left: ASTNode; right: ASTNode };

export interface TruthTableRow {
  id: number;
  inputs: Record<string, boolean>;
  output: boolean;
}

export interface TruthTableData {
  variables: string[];
  rows: TruthTableRow[];
}

export interface KMapGroup {
  id: number;
  term: string;
  minterms: number[];
  color: string;
}

export interface KMapCell {
  rowCode: string;
  colCode: string;
  rowLabel: string;
  colLabel: string;
  minterm: number;
  value: boolean;
  groupIndices: number[];
}

export interface KMapData {
  numVariables: number;
  rowVars: string[];
  colVars: string[];
  rowHeaders: string[];
  colHeaders: string[];
  grid: KMapCell[][];
  groups: KMapGroup[];
  simplifiedExpression: string;
  exceedsLimit: boolean;
  message?: string;
}

export interface SimplificationStep {
  stepNumber: number;
  expression: string;
  lawApplied: string;
  description: string;
}

export interface CircuitNode {
  id: string;
  type: 'INPUT' | 'AND' | 'OR' | 'NOT' | 'XOR' | 'OUTPUT';
  label: string;
  x: number;
  y: number;
  inputs: string[]; // Node IDs driving this node
  value: boolean;
}

export interface CircuitWire {
  id: string;
  fromId: string;
  toId: string;
  fromPoint: { x: number; y: number };
  toPoint: { x: number; y: number };
  active: boolean;
}

export interface CircuitData {
  nodes: CircuitNode[];
  wires: CircuitWire[];
  inputs: Record<string, boolean>;
  output: boolean;
}

export interface BooleanAnalysisResult {
  expression: string;
  valid: boolean;
  error?: string;
  variables: string[];
  ast?: ASTNode;
  truthTable?: TruthTableData;
  circuit?: CircuitData;
  kmap?: KMapData;
  simplificationSteps?: SimplificationStep[];
  simplifiedExpression?: string;
}
