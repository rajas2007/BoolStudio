'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import {
  computeChromaticNumber,
  validateColoring,
  COLOR_PALETTE,
} from '@/lib/graph-theory/coloring';
import {
  Palette,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

export function ColoringPanel() {
  const {
    graph,
    manualColors,
    activeColorPickerIndex,
    applyGreedyColoring,
    resetColoring,
    setActiveColorPickerIndex,
  } = useGraphLab();

  const chromaticResult = useMemo(
    () => computeChromaticNumber(graph),
    [graph]
  );

  const validation = useMemo(
    () => validateColoring(graph, manualColors),
    [graph, manualColors]
  );

  const colorsUsedCount = useMemo(() => {
    return new Set(Object.values(manualColors)).size;
  }, [manualColors]);

  const allVerticesColored = useMemo(() => {
    if (graph.vertices.length === 0) return true;
    return graph.vertices.every((v) => manualColors[v.id] !== undefined);
  }, [graph.vertices, manualColors]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Chromatic Number & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Exact Chromatic Number Card */}
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
              Chromatic Number χ(G)
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                chromaticResult.isExact
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {chromaticResult.isExact ? 'Exact (Backtracking)' : 'Greedy Bound'}
            </span>
          </div>
          <span className="text-3xl font-extrabold text-white font-mono mt-1">
            {chromaticResult.chromaticNumber}
          </span>
          <span className="text-[11px] text-slate-400">
            {chromaticResult.isExact
              ? `Minimum colors required for n=${graph.vertices.length} vertices.`
              : 'Upper bound computed via Welsh-Powell heuristic.'}
          </span>
        </div>

        {/* Current Active Coloring Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
            Colors Used Now
          </span>
          <span className="text-3xl font-extrabold text-white font-mono mt-1">
            {colorsUsedCount}
          </span>
          <span className="text-[11px] text-slate-400">
            {allVerticesColored
              ? 'All vertices have been assigned a color.'
              : `${graph.vertices.length - Object.keys(manualColors).length} uncolored vertex(es).`}
          </span>
        </div>

        {/* Validity Check Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col gap-1 ${
            validation.isValid && allVerticesColored
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : !validation.isValid
              ? 'bg-rose-950/20 border-rose-500/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
            Coloring Validity
          </span>
          <div className="flex items-center gap-2 mt-1">
            {validation.isValid ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-lg font-bold text-emerald-300">
                  {allVerticesColored ? 'Valid Coloring' : 'No Conflicts'}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-rose-400" />
                <span className="text-lg font-bold text-rose-300">
                  {validation.conflictingEdges.length} Conflict(s)
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            {validation.isValid
              ? 'No two adjacent vertices share the same color.'
              : 'Adjacent vertices share an identical color!'}
          </span>
        </div>
      </div>

      {/* Interactive Controls & Palette */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Coloring Controls & Palette
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applyGreedyColoring}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Greedy &quot;Colour It&quot;</span>
            </button>
            <button
              onClick={resetColoring}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Colors</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Pick an active color below, then click any vertex on the canvas to paint it.
        </p>

        {/* Color Palette Chips */}
        <div className="flex items-center gap-2.5 flex-wrap p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          {COLOR_PALETTE.map((color, idx) => {
            const isSelected = activeColorPickerIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveColorPickerIndex(idx)}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-950 transition-all shadow-md ${
                  isSelected
                    ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-950 scale-110'
                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                }`}
                title={`Select Color #${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Educational Theorem Reference Box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Chromatic Theory (Unit 6):</span>
        </div>
        <ul className="list-disc list-inside text-[11px] leading-relaxed space-y-1">
          <li>
            <strong>Vertex Coloring:</strong> An assignment of labels/colors to vertices
            such that adjacent vertices receive distinct colors.
          </li>
          <li>
            <strong>Chromatic Number χ(G):</strong> The minimum number of colors needed to
            properly color G. For complete graph K_n, χ(K_n) = n. For bipartite graphs with edges,
            χ(G) = 2. For odd cycles C_(2k+1), χ(C_(2k+1)) = 3.
          </li>
          <li>
            <strong>Four Color Theorem (Appel & Haken 1976):</strong> Every planar graph is
            4-colourable (χ(G) ≤ 4).
          </li>
        </ul>
      </div>
    </div>
  );
}
