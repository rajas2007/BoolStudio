import { create } from 'zustand';
import {
  Graph,
  EditorMode,
  TopicTab,
  PresetName,
  HighlightState,
} from '@/lib/types/graph';
import {
  generatePreset,
  addVertex,
  removeVertex,
  addEdge,
  removeEdge,
  toggleDirected,
  canAddEdge,
  validateStep,
} from '@/lib/graph-theory';

interface GraphLabState {
  graph: Graph;
  history: Graph[]; // Undo stack
  mode: EditorMode;
  activeTopic: TopicTab;
  selectedVertexId: string | null;
  selectedEdgeId: string | null;
  edgeStartVertexId: string | null;
  hoveredElement: { type: 'vertex' | 'edge'; id: string } | null;
  statusMessage: { text: string; type: 'info' | 'error' | 'success' } | null;
  activeHighlight: HighlightState | null;
  cursorPos: { x: number; y: number } | null;

  // Step-through indices and playback
  eulerStepIndex: number;
  isEulerPlaying: boolean;
  hamiltonianStepIndex: number;
  isHamiltonianPlaying: boolean;
  matchingStepIndex: number;
  colouringStepIndex: number;
  isColouringPlaying: boolean;

  // Topic 1: Matrix power K
  powerK: number;

  // Topic 2: Query Start/End for Paths & Walks
  queryStartId: string | null;
  queryEndId: string | null;
  walkVertexSequence: string[];

  // Topic 9: Colouring
  colouringStrategy: 'degree' | 'alphabetical';
  manualColors: Record<string, number>;

  // Preset params
  presetParamN: number;
  presetParamM: number;

  // Actions
  setMode: (mode: EditorMode) => void;
  setActiveTopic: (tab: TopicTab) => void;
  toggleDirectedMode: () => void;
  loadPreset: (name: PresetName, n?: number, m?: number) => void;
  clearGraph: () => void;
  undo: () => void;

  addVertexAt: (x: number, y: number) => void;
  moveVertex: (id: string, x: number, y: number) => void;
  selectVertex: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  deleteVertex: (id: string) => void;
  deleteEdge: (id: string) => void;
  handleVertexClick: (id: string) => void;
  handleCanvasClick: (x: number, y: number) => void;
  setHoveredElement: (elem: { type: 'vertex' | 'edge'; id: string } | null) => void;
  setStatusMessage: (msg: { text: string; type: 'info' | 'error' | 'success' } | null) => void;
  setActiveHighlight: (highlight: HighlightState | null) => void;
  setCursorPos: (pos: { x: number; y: number } | null) => void;

  // Topic actions
  setPowerK: (k: number) => void;
  setQueryStartId: (id: string | null) => void;
  setQueryEndId: (id: string | null) => void;
  addWalkStep: (vertexId: string) => void;
  popWalkStep: () => void;
  resetWalk: () => void;

  setEulerStepIndex: (idx: number) => void;
  toggleEulerPlayback: () => void;
  nextEulerStep: (max: number) => void;
  prevEulerStep: () => void;

  setHamiltonianStepIndex: (idx: number) => void;
  toggleHamiltonianPlayback: () => void;
  nextHamiltonianStep: (max: number) => void;
  prevHamiltonianStep: () => void;

  setMatchingStepIndex: (idx: number) => void;
  setColouringStepIndex: (idx: number) => void;
  toggleColouringPlayback: () => void;
  nextColouringStep: (max: number) => void;
  prevColouringStep: () => void;

  setColouringStrategy: (strategy: 'degree' | 'alphabetical') => void;
  setManualColor: (vertexId: string, colorIdx: number) => void;
  resetManualColors: () => void;
}

const DEFAULT_PRESET = generatePreset('k_n', 4);

export const useGraphLab = create<GraphLabState>((set, get) => ({
  graph: DEFAULT_PRESET,
  history: [],
  mode: 'select',
  activeTopic: 'representations',
  selectedVertexId: null,
  selectedEdgeId: null,
  edgeStartVertexId: null,
  hoveredElement: null,
  statusMessage: null,
  activeHighlight: null,
  cursorPos: null,

  eulerStepIndex: 0,
  isEulerPlaying: false,
  hamiltonianStepIndex: 0,
  isHamiltonianPlaying: false,
  matchingStepIndex: 0,
  colouringStepIndex: 0,
  isColouringPlaying: false,

  powerK: 2,
  queryStartId: null,
  queryEndId: null,
  walkVertexSequence: [],

  colouringStrategy: 'degree',
  manualColors: {},

  presetParamN: 4,
  presetParamM: 3,

  setMode: (mode) =>
    set({
      mode,
      edgeStartVertexId: null,
      selectedVertexId: null,
      selectedEdgeId: null,
      statusMessage: null,
    }),

  setActiveTopic: (activeTopic) =>
    set({
      activeTopic,
      eulerStepIndex: 0,
      isEulerPlaying: false,
      hamiltonianStepIndex: 0,
      isHamiltonianPlaying: false,
      matchingStepIndex: 0,
      colouringStepIndex: 0,
      isColouringPlaying: false,
      activeHighlight: null,
    }),

  toggleDirectedMode: () => {
    const current = get().graph;
    const history = [...get().history, current];
    set({
      graph: toggleDirected(current),
      history,
      statusMessage: {
        text: `Graph converted to ${!current.isDirected ? 'Directed' : 'Undirected'} mode.`,
        type: 'info',
      },
    });
  },

  loadPreset: (name, n, m) => {
    const current = get().graph;
    const history = [...get().history, current];
    const newGraph = generatePreset(
      name,
      n ?? get().presetParamN,
      m ?? get().presetParamM
    );
    set({
      graph: newGraph,
      history,
      selectedVertexId: null,
      selectedEdgeId: null,
      edgeStartVertexId: null,
      activeHighlight: null,
      eulerStepIndex: 0,
      hamiltonianStepIndex: 0,
      matchingStepIndex: 0,
      colouringStepIndex: 0,
      walkVertexSequence: [],
      queryStartId: null,
      queryEndId: null,
      statusMessage: { text: `Preset loaded successfully.`, type: 'success' },
    });
  },

  clearGraph: () => {
    const current = get().graph;
    const history = [...get().history, current];
    set({
      graph: {
        vertices: [],
        edges: [],
        isDirected: current.isDirected,
      },
      history,
      selectedVertexId: null,
      selectedEdgeId: null,
      edgeStartVertexId: null,
      activeHighlight: null,
      walkVertexSequence: [],
      queryStartId: null,
      queryEndId: null,
      statusMessage: { text: 'Canvas cleared.', type: 'info' },
    });
  },

  undo: () => {
    const history = get().history;
    if (history.length === 0) {
      set({ statusMessage: { text: 'Nothing to undo.', type: 'info' } });
      return;
    }
    const previous = history[history.length - 1];
    set({
      graph: previous,
      history: history.slice(0, -1),
      selectedVertexId: null,
      selectedEdgeId: null,
      edgeStartVertexId: null,
      activeHighlight: null,
      statusMessage: { text: 'Action undone.', type: 'info' },
    });
  },

  addVertexAt: (x, y) => {
    const current = get().graph;
    const history = [...get().history, current];
    const updated = addVertex(current, x, y);
    set({
      graph: updated,
      history,
      statusMessage: null,
    });
  },

  moveVertex: (id, x, y) => {
    const current = get().graph;
    set({
      graph: {
        ...current,
        vertices: current.vertices.map((v) => (v.id === id ? { ...v, x, y } : v)),
      },
    });
  },

  selectVertex: (id) => set({ selectedVertexId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedVertexId: null }),

  deleteVertex: (id) => {
    const current = get().graph;
    const history = [...get().history, current];
    const updated = removeVertex(current, id);
    set({
      graph: updated,
      history,
      selectedVertexId: null,
      edgeStartVertexId: null,
      statusMessage: { text: 'Vertex deleted.', type: 'info' },
    });
  },

  deleteEdge: (id) => {
    const current = get().graph;
    const history = [...get().history, current];
    const updated = removeEdge(current, id);
    set({
      graph: updated,
      history,
      selectedEdgeId: null,
      statusMessage: { text: 'Edge deleted.', type: 'info' },
    });
  },

  handleVertexClick: (id) => {
    const { mode, edgeStartVertexId, graph } = get();

    if (mode === 'delete') {
      get().deleteVertex(id);
      return;
    }

    if (mode === 'add-edge') {
      if (!edgeStartVertexId) {
        set({
          edgeStartVertexId: id,
          statusMessage: { text: 'Click another vertex to connect edge.', type: 'info' },
        });
      } else {
        const check = canAddEdge(graph, edgeStartVertexId, id);
        if (check.valid) {
          const history = [...get().history, graph];
          const updated = addEdge(graph, edgeStartVertexId, id);
          set({
            graph: updated,
            history,
            edgeStartVertexId: null,
            statusMessage: { text: 'Edge connected.', type: 'success' },
          });
        } else {
          set({
            statusMessage: { text: check.reason || 'Cannot add edge.', type: 'error' },
            edgeStartVertexId: null,
          });
        }
      }
      return;
    }

    // Select mode
    set({ selectedVertexId: id, selectedEdgeId: null });
  },

  handleCanvasClick: (x, y) => {
    const { mode } = get();
    if (mode === 'add-vertex') {
      get().addVertexAt(x, y);
    } else {
      set({
        selectedVertexId: null,
        selectedEdgeId: null,
        edgeStartVertexId: null,
      });
    }
  },

  setHoveredElement: (hoveredElement) => set({ hoveredElement }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setActiveHighlight: (activeHighlight) => set({ activeHighlight }),
  setCursorPos: (cursorPos) => set({ cursorPos }),

  setPowerK: (powerK) => set({ powerK }),
  setQueryStartId: (queryStartId) => set({ queryStartId }),
  setQueryEndId: (queryEndId) => set({ queryEndId }),

  addWalkStep: (vertexId) => {
    const { walkVertexSequence, graph } = get();
    if (walkVertexSequence.length > 0) {
      const last = walkVertexSequence[walkVertexSequence.length - 1];
      const check = validateStep(graph, last, vertexId);
      if (!check.isValid) {
        set({ statusMessage: { text: check.error || 'Invalid step.', type: 'error' } });
        return;
      }
    }
    set({ walkVertexSequence: [...walkVertexSequence, vertexId], statusMessage: null });
  },

  popWalkStep: () => {
    const seq = get().walkVertexSequence;
    if (seq.length > 0) {
      set({ walkVertexSequence: seq.slice(0, -1) });
    }
  },

  resetWalk: () => set({ walkVertexSequence: [] }),

  setEulerStepIndex: (eulerStepIndex) => set({ eulerStepIndex }),
  toggleEulerPlayback: () => set((s) => ({ isEulerPlaying: !s.isEulerPlaying })),
  nextEulerStep: (max) =>
    set((s) => ({
      eulerStepIndex: s.eulerStepIndex < max ? s.eulerStepIndex + 1 : s.eulerStepIndex,
      isEulerPlaying: s.eulerStepIndex + 1 >= max ? false : s.isEulerPlaying,
    })),
  prevEulerStep: () =>
    set((s) => ({
      eulerStepIndex: s.eulerStepIndex > 0 ? s.eulerStepIndex - 1 : 0,
    })),

  setHamiltonianStepIndex: (hamiltonianStepIndex) => set({ hamiltonianStepIndex }),
  toggleHamiltonianPlayback: () => set((s) => ({ isHamiltonianPlaying: !s.isHamiltonianPlaying })),
  nextHamiltonianStep: (max) =>
    set((s) => ({
      hamiltonianStepIndex: s.hamiltonianStepIndex < max ? s.hamiltonianStepIndex + 1 : s.hamiltonianStepIndex,
      isHamiltonianPlaying: s.hamiltonianStepIndex + 1 >= max ? false : s.isHamiltonianPlaying,
    })),
  prevHamiltonianStep: () =>
    set((s) => ({
      hamiltonianStepIndex: s.hamiltonianStepIndex > 0 ? s.hamiltonianStepIndex - 1 : 0,
    })),

  setMatchingStepIndex: (matchingStepIndex) => set({ matchingStepIndex }),
  setColouringStepIndex: (colouringStepIndex) => set({ colouringStepIndex }),
  toggleColouringPlayback: () => set((s) => ({ isColouringPlaying: !s.isColouringPlaying })),
  nextColouringStep: (max) =>
    set((s) => ({
      colouringStepIndex: s.colouringStepIndex < max ? s.colouringStepIndex + 1 : s.colouringStepIndex,
      isColouringPlaying: s.colouringStepIndex + 1 >= max ? false : s.isColouringPlaying,
    })),
  prevColouringStep: () =>
    set((s) => ({
      colouringStepIndex: s.colouringStepIndex > 0 ? s.colouringStepIndex - 1 : 0,
    })),

  setColouringStrategy: (colouringStrategy) => set({ colouringStrategy }),
  setManualColor: (vertexId, colorIdx) => {
    const current = get().manualColors;
    set({ manualColors: { ...current, [vertexId]: colorIdx } });
  },
  resetManualColors: () => set({ manualColors: {} }),
}));
