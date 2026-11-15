'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';

export function GraphCanvas() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const {
    graph,
    mode,
    selectedVertexId,
    selectedEdgeId,
    edgeStartVertexId,
    hoveredElement,
    activeHighlight,
    cursorPos,
    setCursorPos,
    handleCanvasClick,
    handleVertexClick,
    selectEdge,
    deleteEdge,
    moveVertex,
  } = useGraphLab();

  const [draggedVertexId, setDraggedVertexId] = useState<string | null>(null);

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
    const coords = getSVGCoordinates(e);
    if (mode === 'add-edge' && edgeStartVertexId) {
      setCursorPos(coords);
    }

    if (draggedVertexId) {
      const boundedX = Math.max(30, Math.min(670, coords.x));
      const boundedY = Math.max(30, Math.min(430, coords.y));
      moveVertex(draggedVertexId, boundedX, boundedY);
    }
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
    if (e.target === svgRef.current || (e.target as Element).tagName === 'rect') {
      const { x, y } = getSVGCoordinates(e);
      handleCanvasClick(x, y);
    }
  };

  // Vertex lookup map
  const vertexMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; label: string }>();
    graph.vertices.forEach((v) => map.set(v.id, { x: v.x, y: v.y, label: v.label }));
    return map;
  }, [graph.vertices]);

  // Vertex Fill Color
  const getVertexFill = (vertexId: string): string => {
    // 1. Selected or Edge Start
    if (vertexId === selectedVertexId || vertexId === edgeStartVertexId) {
      return '#818cf8'; // Bright indigo
    }
    // 2. Hovered from Matrix or Table
    if (hoveredElement?.type === 'vertex' && hoveredElement.id === vertexId) {
      return '#38bdf8'; // Sky glow
    }
    // 3. Highlight from active algorithm / step
    if (activeHighlight?.vertexColors && activeHighlight.vertexColors[vertexId]) {
      return activeHighlight.vertexColors[vertexId];
    }
    if (activeHighlight?.vertices && activeHighlight.vertices.includes(vertexId)) {
      return '#10b981'; // Emerald
    }
    return '#1e293b'; // Slate 800 default
  };

  // Edge Styling
  const getEdgeStyle = (edgeId: string) => {
    let stroke = '#475569'; // Slate 600 default
    let strokeWidth = 2;
    let isHighlighted = false;

    const isSelected = selectedEdgeId === edgeId;
    const isHovered = hoveredElement?.type === 'edge' && hoveredElement.id === edgeId;

    if (isSelected) {
      stroke = '#818cf8';
      strokeWidth = 3.5;
      isHighlighted = true;
    } else if (isHovered) {
      stroke = '#38bdf8';
      strokeWidth = 3.5;
      isHighlighted = true;
    } else if (activeHighlight?.edgeColors && activeHighlight.edgeColors[edgeId]) {
      stroke = activeHighlight.edgeColors[edgeId];
      strokeWidth = 3.5;
      isHighlighted = true;
    } else if (activeHighlight?.edges && activeHighlight.edges.includes(edgeId)) {
      stroke = '#10b981'; // Emerald
      strokeWidth = 3.5;
      isHighlighted = true;
    }

    return { stroke, strokeWidth, isHighlighted };
  };

  const startVertexObj = edgeStartVertexId ? vertexMap.get(edgeStartVertexId) : null;

  return (
    <div className="relative w-full rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 overflow-hidden shadow-2xl flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Interactive Canvas</span>
          <span className="text-slate-600">|</span>
          <span className="truncate max-w-xs sm:max-w-md">
            {mode === 'add-vertex' && 'Click anywhere to place a new vertex.'}
            {mode === 'add-edge' &&
              (edgeStartVertexId
                ? 'Click target vertex to complete edge.'
                : 'Click source vertex to start edge.')}
            {mode === 'delete' && 'Click any vertex or edge to remove it.'}
            {mode === 'select' && 'Drag vertices to reposition. Click to inspect.'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
            {graph.isDirected ? 'Directed' : 'Undirected'}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 700 460"
        className="w-full h-auto min-h-[380px] max-h-[500px] cursor-crosshair select-none touch-none"
        onPointerDown={onSvgClick}
        onPointerMove={handlePointerMoveCanvas}
        onPointerUp={handlePointerUpCanvas}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.4" />
          </pattern>

          {/* Standard Arrowhead marker */}
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#94a3b8" />
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
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
          </marker>

          {/* Indigo marker for selection */}
          <marker
            id="arrowhead-indigo"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#818cf8" />
          </marker>
        </defs>

        {/* Background Grid */}
        <rect width="700" height="460" fill="url(#grid)" pointerEvents="all" />

        {/* Empty state hint */}
        {graph.vertices.length === 0 && (
          <text
            x="350"
            y="230"
            textAnchor="middle"
            fill="#64748b"
            className="text-sm font-sans"
          >
            Canvas is empty. Click &quot;Add Vertex&quot; or choose a Preset above.
          </text>
        )}

        {/* Ghost Line when connecting an edge */}
        {mode === 'add-edge' && startVertexObj && cursorPos && (
          <line
            x1={startVertexObj.x}
            y1={startVertexObj.y}
            x2={cursorPos.x}
            y2={cursorPos.y}
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            pointerEvents="none"
          />
        )}

        {/* Edges Layer */}
        <g className="edges">
          {graph.edges.map((edge) => {
            const u = vertexMap.get(edge.source);
            const v = vertexMap.get(edge.target);
            if (!u || !v) return null;

            const style = getEdgeStyle(edge.id);
            const marker = graph.isDirected
              ? style.isHighlighted
                ? 'url(#arrowhead-active)'
                : 'url(#arrowhead)'
              : undefined;

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
                {/* Wide invisible line for effortless click target */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="transparent"
                  strokeWidth="16"
                />
                {/* Visual Line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  markerEnd={marker}
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

            return (
              <g
                key={vertex.id}
                transform={`translate(${vertex.x}, ${vertex.y})`}
                className="cursor-grab active:cursor-grabbing transition-transform"
                onPointerDown={(e) => handlePointerDownVertex(vertex.id, e)}
              >
                {/* Glow ring when selected or starting edge */}
                {isSelected && (
                  <circle
                    r="25"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
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
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
