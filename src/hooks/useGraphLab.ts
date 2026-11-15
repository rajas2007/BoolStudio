import { create } from 'zustand';
import {
  Graph,
  EditorMode,
  TopicTab,
  PresetName,
  Vertex,
  Edge,
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
  computeGreedyColoring,
} from '@/lib/graph-theory';

interface GraphLabState {
  graph: Graph;
  mode: EditorMode;
  activeTopic: TopicTab;
  selectedVertexId: string | null;
  selectedEdgeId: string | null;
  edgeStartVertexId: string | null;
  hoveredElement: { type: 'vertex' | 'edge'; id: string } | null;

  // Walk in progress
  walkVertexSequence: string[];
  walkError: string | null;

  // Coloring mode state
  manualColors: Record<string, number>;
  activeColorPickerIndex: number;

  // Euler walk animation / step state
  eulerStepIndex: number;
  isEulerPlaying: boolean;

  // Preset params
  presetParamN: number;
  presetParamM: number;

  // Store actions
  setMode: (mode: EditorMode) => void;
  setActiveTopic: (tab: TopicTab) => void;
  setDirected: (isDirected: boolean) => void;
  toggleDirectedMode: () => void;
  loadPreset: (name: PresetName, n?: number, m?: number) => void;
  clearGraph: () => void;
  addVertexAt: (x: number, y: number) => void;
  moveVertex: (id: string, x: number, y: number) => void;
  selectVertex: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  deleteVertex: (id: string) => void;
  deleteEdge: (id: string) => void;
  handleVertexClick: (id: string) => void;
  handleCanvasClick: (x: number, y: number) => void;
  setHoveredElement: (elem: { type: 'vertex' | 'edge'; id: string } | null) => void;

  // Walk actions
  addWalkStep: (vertexId: string) => void;
  popWalkStep: () => void;
  resetWalk: () => void;

  // Coloring actions
  setManualColor: (vertexId: string, colorIdx: number) => void;
  applyGreedyColoring: () => void;
  resetColoring: () => void;
  setActiveColorPickerIndex: (idx: number) => void;

  // Euler actions
  setEulerStepIndex: (idx: number) => void;
  nextEulerStep: () => void;
  prevEulerStep: () => void;
  toggleEulerPlayback: () => void;
}

const DEFAULT_PRESET = generatePreset('k_n', 4);

export const useGraphLab = create<GraphLabState>((set, get) => ({
  graph: DEFAULT_PRESET,
  mode: 'select',
  activeTopic: 'properties',
  selectedVertexId: null,
  selectedEdgeId: null,
  edgeStartVertexId: null,
  hoveredElement: null,

  walkVertexSequence: [],
  walkError: null,

  manualColors: {},
  activeColorPickerIndex: 0,

  eulerStepIndex: 0,
  isEulerPlaying: false,

  presetParamN: 4,
  presetParamM: 3,

  setMode: (mode) =>
    set({
      mode,
      edgeStartVertexId: null,
      selectedVertexId: null,
      selectedEdgeId: null,
    }),

  setActiveTopic: (activeTopic) =>
    set({
      activeTopic,
      eulerStepIndex: 0,
      isEulerPlaying: false,
    }),

  setDirected: (isDirected) => {
    const current = get().graph;
    if (current.isDirected === isDirected) return;
    set({
      graph: toggleDirected(current),
      walkVertexSequence: [],
      walkError: null,
      eulerStepIndex: 0,
    });
  },

  toggleDirectedMode: () => {
    const current = get().graph;
    set({
      graph: toggleDirected(current),
      walkVertexSequence: [],
      walkError: null,
      eulerStepIndex: 0,
    });
  },

  loadPreset: (name, n, m) => {
    const paramN = n !== undefined ? n : get().presetParamN;
    const paramM = m !== undefined ? m : get().presetParamM;
    const newGraph = generatePreset(name, paramN, paramM);

    set({
      graph: newGraph,
      selectedVertexId: null,
      selectedEdgeId: null,
      edgeStartVertexId: null,
      walkVertexSequence: [],
      walkError: null,
      manualColors: {},
      eulerStepIndex: 0,
      isEulerPlaying: false,
      presetParamN: paramN,
      presetParamM: paramM,
    });
  },

  clearGraph: () => {
    set({
      graph: { vertices: [], edges: [], isDirected: get().graph.isDirected },
      selectedVertexId: null,
      selectedEdgeId: null,
      edgeStartVertexId: null,
      walkVertexSequence: [],
      walkError: null,
      manualColors: {},
      eulerStepIndex: 0,
      isEulerPlaying: false,
    });
  },

  addVertexAt: (x, y) => {
    const { graph } = get();
    const nextIdx = graph.vertices.length + 1;
    // Generate alphabet label if <= 26, else V1, V2...
    const label =
      nextIdx <= 26
        ? String.fromCharCode(64 + nextIdx)
        : `V${nextIdx}`;

    const newVertex: Vertex = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label,
      x: Math.round(x),
      y: Math.round(y),
    };

    set({
      graph: addVertex(graph, newVertex),
      selectedVertexId: newVertex.id,
      selectedEdgeId: null,
    });
  },

  moveVertex: (id, x, y) => {
    const { graph } = get();
    const updated = graph.vertices.map((v) =>
      v.id === id ? { ...v, x: Math.round(x), y: Math.round(y) } : v
    );
    set({ graph: { ...graph, vertices: updated } });
  },

  selectVertex: (id) => set({ selectedVertexId: id, selectedEdgeId: null }),

  selectEdge: (id) => set({ selectedEdgeId: id, selectedVertexId: null }),

  deleteVertex: (id) => {
    const { graph, walkVertexSequence } = get();
    set({
      graph: removeVertex(graph, id),
      selectedVertexId: null,
      edgeStartVertexId: null,
      walkVertexSequence: walkVertexSequence.filter((vId) => vId !== id),
    });
  },

  deleteEdge: (id) => {
    const { graph } = get();
    set({
      graph: removeEdge(graph, id),
      selectedEdgeId: null,
      walkVertexSequence: [],
      walkError: null,
    });
  },

  handleVertexClick: (id) => {
    const {
      mode,
      activeTopic,
      graph,
      edgeStartVertexId,
      activeColorPickerIndex,
    } = get();

    // If on Walks tab, vertex clicks build walk sequence
    if (activeTopic === 'walks') {
      get().addWalkStep(id);
      return;
    }

    // If on Coloring tab and click to color
    if (activeTopic === 'coloring') {
      get().setManualColor(id, activeColorPickerIndex);
      return;
    }

    if (mode === 'delete') {
      get().deleteVertex(id);
      return;
    }

    if (mode === 'add-edge') {
      if (!edgeStartVertexId) {
        // First vertex selected
        set({ edgeStartVertexId: id, selectedVertexId: id });
      } else {
        // Second vertex selected -> try adding edge
        const source = edgeStartVertexId;
        const target = id;
        const check = canAddEdge(graph, source, target);

        if (check.valid) {
          const newEdge: Edge = {
            id: `e_${source}_${target}_${Date.now()}`,
            source,
            target,
          };
          set({
            graph: addEdge(graph, newEdge),
            edgeStartVertexId: null,
            selectedVertexId: null,
          });
        } else {
          // If invalid (e.g. self-loop or duplicate), switch starting vertex to current clicked one
          set({ edgeStartVertexId: id, selectedVertexId: id });
        }
      }
      return;
    }

    // Default select mode
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

  setHoveredElement: (elem) => set({ hoveredElement: elem }),

  addWalkStep: (vertexId) => {
    const { graph, walkVertexSequence } = get();
    if (walkVertexSequence.length === 0) {
      set({ walkVertexSequence: [vertexId], walkError: null });
      return;
    }

    const last = walkVertexSequence[walkVertexSequence.length - 1];
    const check = validateStep(graph, last, vertexId);

    if (!check.isValid) {
      set({ walkError: check.error || 'Cannot step to this vertex.' });
      return;
    }

    set({
      walkVertexSequence: [...walkVertexSequence, vertexId],
      walkError: null,
    });
  },

  popWalkStep: () => {
    const { walkVertexSequence } = get();
    if (walkVertexSequence.length <= 1) {
      set({ walkVertexSequence: [], walkError: null });
    } else {
      set({
        walkVertexSequence: walkVertexSequence.slice(0, -1),
        walkError: null,
      });
    }
  },

  resetWalk: () => set({ walkVertexSequence: [], walkError: null }),

  setManualColor: (vertexId, colorIdx) => {
    const current = { ...get().manualColors, [vertexId]: colorIdx };
    set({ manualColors: current });
  },

  applyGreedyColoring: () => {
    const { graph } = get();
    const greedy = computeGreedyColoring(graph);
    set({ manualColors: greedy });
  },

  resetColoring: () => set({ manualColors: {} }),

  setActiveColorPickerIndex: (idx) => set({ activeColorPickerIndex: idx }),

  setEulerStepIndex: (idx) => set({ eulerStepIndex: idx }),

  nextEulerStep: () => set((state) => ({ eulerStepIndex: state.eulerStepIndex + 1 })),

  prevEulerStep: () =>
    set((state) => ({ eulerStepIndex: Math.max(0, state.eulerStepIndex - 1) })),

  toggleEulerPlayback: () =>
    set((state) => ({ isEulerPlaying: !state.isEulerPlaying })),
}));
