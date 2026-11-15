'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeConnectedComponents } from '@/lib/graph-theory/connectivity';
import { checkBipartite } from '@/lib/graph-theory/bipartite';
import { findEulerianPathOrCircuit } from '@/lib/graph-theory/euler';
import { findHamiltonianPathsAndCycles } from '@/lib/graph-theory/hamiltonian';
import { computeBipartiteMatching } from '@/lib/graph-theory/matching';
import { analyzeWalk } from '@/lib/graph-theory/walks-cycles';
import { COLOR_PALETTE } from '@/lib/graph-theory/coloring';

const COMPONENT_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
];

export function GraphCanvas() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const {
    graph,
    mode,
    activeTopic,
    selectedVertexId,
    selectedEdgeId,
    edgeStartVertexId,
    hoveredElement,
    walkVertexSequence,
    manualColors,
    eulerStepIndex,
    handleCanvasClick,
    handleVertexClick,
    selectEdge,
    deleteEdge,
    moveVertex,
  } = useGraphLab();

  // Dragging state
  const [draggedVertexId, setDraggedVertexId] = useState<string | null>(null);

  // Computed analysis for contextual canvas overlays
  const components = useMemo(() => computeConnectedComponents(graph), [graph]);
  const bipartite = useMemo(() => checkBipartite(graph), [graph]);
  const euler = useMemo(() => findEulerianPathOrCircuit(graph), [graph]);
  const hamiltonian = useMemo(() => findHamiltonianPathsAndCycles(graph), [graph]);
  const matching = useMemo(() => computeBipartiteMatching(graph), [graph]);
  const walkAnalysis = useMemo(
    () => analyzeWalk(graph, walkVertexSequence),
    [graph, walkVertexSequence]
  );

  // SVG coordinate transformation
  const getSVGCoordinates = useCallback(
    (e: React.PointerEvent<SVGSVGElement>): { x: number; y: number } => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = 700 / rect.width;
      const scaleY = 460 / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handlePointerDownVertex = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    if (mode === 'select') {
      setDraggedVertexId(id);
      (e.target as Element).setPointerCapture(e.pointerId);
    }
    handleVertexClick(id);
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedVertexId) return;
    const { x, y } = getSVGCoordinates(e);
    // Constrain inside bounds with margin
    const boundedX = Math.max(30, Math.min(670, x));
    const boundedY = Math.max(30, Math.min(430, y));
    moveVertex(draggedVertexId, boundedX, boundedY);
  };

  const handlePointerUpCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggedVertexId) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
      setDraggedVertexId(null);
    }
  };

  const onSvgClick = (e: React.PointerEvent<SVGSVGElement>) => {
    // Only fire if clicking bare canvas (not an SVG child element like a node)
    if (e.target === svgRef.current) {
      const { x, y } = getSVGCoordinates(e);
      handleCanvasClick(x, y);
    }
  };

  // Vertex rendering color resolution depending on active topic
  const getVertexFill = (vertexId: string): string => {
    // Priority 1: Selected or Edge Start
    if (vertexId === selectedVertexId || vertexId === edgeStartVertexId) {
      return '#818cf8'; // Bright indigo
    }

    // Priority 2: Hovered from Matrix
    if (hoveredElement?.type === 'vertex' && hoveredElement.id === vertexId) {
      return '#38bdf8'; // Sky glow
    }

    // Topic specific color schemes
    if (activeTopic === 'components') {
      const compIdx = components.vertexComponentMap[vertexId] ?? 0;
      return COMPONENT_COLORS[compIdx % COMPONENT_COLORS.length];
    }

    if (activeTopic === 'bipartite') {
      if (bipartite.oddCycle && bipartite.oddCycle.includes(vertexId)) {
        return '#f43f5e'; // Rose for odd cycle
      }
      if (bipartite.isBipartite) {
        return bipartite.partitionA.includes(vertexId) ? '#6366f1' : '#10b981';
      }
    }

    if (activeTopic === 'coloring') {
      const colorIdx = manualColors[vertexId];
      if (colorIdx !== undefined) {
        return COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
      }
    }

    if (activeTopic === 'walks' && walkVertexSequence.includes(vertexId)) {
      return '#f59e0b'; // Amber for walk vertices
    }

    if (activeTopic === 'euler' && euler.circuitOrTrail.length > 0) {
      // Highlight vertices visited up to eulerStepIndex
      const activeVerts = euler.circuitOrTrail.slice(0, eulerStepIndex + 1);
      if (activeVerts.includes(vertexId)) {
        return '#10b981'; // Emerald
      }
    }

    if (activeTopic === 'hamiltonian' && (hamiltonian.hasCycle || hamiltonian.hasPath)) {
      const activeVerts = hamiltonian.hasCycle ? hamiltonian.cycle : hamiltonian.path;
      if (activeVerts.includes(vertexId)) {
        return '#10b981'; // Emerald
      }
    }

    return '#1e293b'; // Slate 800 default
  };

  // Edge active / highlighted status
  const getEdgeStyle = (edgeId: string, sourceId: string, targetId: string) => {
    let stroke = '#475569'; // Slate 600 default
    let strokeWidth = 2;
    const strokeDasharray: string | undefined = undefined;

    const isSelected = selectedEdgeId === edgeId;
    const isHovered =
      hoveredElement?.type === 'edge' && hoveredElement.id === edgeId;

    if (isSelected) {
      stroke = '#818cf8';
      strokeWidth = 3.5;
    } else if (isHovered) {
      stroke = '#38bdf8';
      strokeWidth = 3.5;
    }

    if (activeTopic === 'walks' && walkAnalysis.edgeIds.includes(edgeId)) {
      stroke = '#f59e0b'; // Amber for walk
      strokeWidth = 3;
    }

    if (activeTopic === 'euler' && euler.circuitOrTrailEdges.length > 0) {
      const activeEdges = euler.circuitOrTrailEdges.slice(0, eulerStepIndex);
      if (activeEdges.includes(edgeId)) {
        stroke = '#10b981'; // Emerald for traversed Euler edges
        strokeWidth = 3.5;
      }
    }

    if (activeTopic === 'hamiltonian' && (hamiltonian.hasCycle || hamiltonian.hasPath)) {
      const activeEdges = hamiltonian.hasCycle ? hamiltonian.cycleEdges : hamiltonian.pathEdges;
      if (activeEdges.includes(edgeId)) {
        stroke = '#10b981'; // Emerald for traversed Hamiltonian edges
        strokeWidth = 3.5;
      }
    }

    if (activeTopic === 'matching' && matching.isBipartite) {
      if (matching.matchedEdges.includes(edgeId)) {
        stroke = '#10b981'; // Emerald for matched edges
        strokeWidth = 4;
      }
    }

    if (activeTopic === 'bipartite' && bipartite.oddCycle) {
      // Highlight edges of the odd cycle
      for (let i = 0; i < bipartite.oddCycle.length - 1; i++) {
        const u = bipartite.oddCycle[i];
        const v = bipartite.oddCycle[i + 1];
        if (
          (sourceId === u && targetId === v) ||
          (sourceId === v && targetId === u)
        ) {
          stroke = '#f43f5e'; // Rose
          strokeWidth = 3.5;
          break;
        }
      }
    }

    return { stroke, strokeWidth, strokeDasharray };
  };

  // Vertex lookup map
  const vertexMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; label: string }>();
    graph.vertices.forEach((v) => map.set(v.id, { x: v.x, y: v.y, label: v.label }));
    return map;
  }, [graph.vertices]);

  return (
    <div className="relative w-full rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 overflow-hidden shadow-2xl flex flex-col items-center">
      {/* Canvas Top Status Bar */}
      <div className="w-full px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Interactive Canvas</span>
          <span className="text-slate-600">|</span>
          <span>
            {mode === 'add-vertex' && 'Click anywhere to create a vertex.'}
            {mode === 'add-edge' &&
              (edgeStartVertexId
                ? 'Click target vertex to complete edge.'
                : 'Click starting vertex for new edge.')}
            {mode === 'delete' && 'Click any vertex or edge to remove it.'}
            {mode === 'select' && 'Drag vertices to reposition. Click to inspect.'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
            {graph.isDirected ? 'Directed Graph' : 'Undirected Graph'}
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <svg
        ref={svgRef}
        viewBox="0 0 700 460"
        className="w-full h-auto max-h-[500px] cursor-crosshair select-none touch-none"
        onPointerDown={onSvgClick}
        onPointerMove={handlePointerMoveCanvas}
        onPointerUp={handlePointerUpCanvas}
      >
        <defs>
          {/* Arrowhead marker for directed edges */}
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
          </marker>

          {/* Active / Highlighted arrowhead marker */}
          <marker
            id="arrowhead-active"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>

        {/* Empty state hint */}
        {graph.vertices.length === 0 && (
          <text
            x="350"
            y="230"
            textAnchor="middle"
            fill="#64748b"
            className="text-sm font-sans"
          >
            Graph is empty. Use &quot;Add Vertex&quot; or choose a Preset above.
          </text>
        )}

        {/* Edges Layer */}
        <g className="edges">
          {graph.edges.map((edge) => {
            const u = vertexMap.get(edge.source);
            const v = vertexMap.get(edge.target);
            if (!u || !v) return null;

            const style = getEdgeStyle(edge.id, edge.source, edge.target);

            return (
              <g
                key={edge.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  if (mode === 'delete') {
                    deleteEdge(edge.id);
                  } else {
                    selectEdge(edge.id);
                  }
                }}
              >
                {/* Fat invisible line for easy clicking */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="transparent"
                  strokeWidth="14"
                />
                {/* Visual Line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  markerEnd={graph.isDirected ? 'url(#arrowhead)' : undefined}
                  className="transition-colors duration-150 group-hover:stroke-indigo-400"
                />
              </g>
            );
          })}
        </g>

        {/* Vertices Layer */}
        <g className="vertices">
          {graph.vertices.map((vertex) => {
            const fill = getVertexFill(vertex.id);
            const isSelected =
              vertex.id === selectedVertexId || vertex.id === edgeStartVertexId;

            // Step index badge in walk sequence
            const walkStepIndex =
              activeTopic === 'walks'
                ? walkVertexSequence.lastIndexOf(vertex.id)
                : -1;

            return (
              <g
                key={vertex.id}
                transform={`translate(${vertex.x}, ${vertex.y})`}
                className="cursor-grab active:cursor-grabbing transition-transform"
                onPointerDown={(e) => handlePointerDownVertex(vertex.id, e)}
              >
                {/* Glow ring when selected */}
                {isSelected && (
                  <circle
                    r="25"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Vertex Body */}
                <circle
                  r="18"
                  fill={fill}
                  stroke={isSelected ? '#c7d2fe' : '#64748b'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="shadow-lg transition-colors duration-200"
                />

                {/* Vertex Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                  pointerEvents="none"
                >
                  {vertex.label}
                </text>

                {/* Walk Step Number Badge if in walks tab */}
                {walkStepIndex >= 0 && (
                  <g transform="translate(13, -13)">
                    <circle r="8" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#0f172a"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {walkStepIndex + 1}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
