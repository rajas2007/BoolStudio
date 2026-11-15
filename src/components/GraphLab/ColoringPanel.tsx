'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import {
  analyzeColoring,
  COLOR_PALETTE,
} from '@/lib/graph-theory/coloring';
import {
  Palette,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export function ColoringPanel() {
  const {
    graph,
    colouringStrategy,
    setColouringStrategy,
    colouringStepIndex,
    setColouringStepIndex,
    isColouringPlaying,
    toggleColouringPlayback,
    nextColouringStep,
    prevColouringStep,
    manualColors,
    setManualColor,
    resetManualColors,
    setActiveHighlight,
    loadPreset,
  } = useGraphLab();

  const [useManualMode, setUseManualMode] = useState(false);

  const output = useMemo(
    () =>
      analyzeColoring(
        graph,
        colouringStrategy,
        useManualMode ? manualColors : undefined
      ),
    [graph, colouringStrategy, useManualMode, manualColors]
  );
  const data = output.result;
  const steps = useMemo(() => output.steps || [], [output.steps]);
  const maxStep = Math.max(0, steps.length - 1);

  // Sync canvas highlight
  useEffect(() => {
    if (useManualMode) {
      const vertexColors: Record<string, string> = {};
      Object.entries(manualColors).forEach(([vId, cIdx]) => {
        vertexColors[vId] = COLOR_PALETTE[cIdx % COLOR_PALETTE.length];
      });
      const edgeColors: Record<string, string> = {};
      data.conflictingEdges.forEach((eId) => {
        edgeColors[eId] = '#f43f5e';
      });
      setActiveHighlight({
        vertices: graph.vertices.map((v) => v.id),
        edges: data.conflictingEdges,
        vertexColors,
        edgeColors,
      });
    } else if (steps.length > 0 && steps[colouringStepIndex]) {
      setActiveHighlight(steps[colouringStepIndex].highlight);
    } else {
      setActiveHighlight(output.highlight);
    }
  }, [
    useManualMode,
    manualColors,
    data.conflictingEdges,
    colouringStepIndex,
    steps,
    output.highlight,
    graph.vertices,
    setActiveHighlight,
  ]);

  // Playback timer
  useEffect(() => {
    if (!isColouringPlaying || maxStep === 0 || useManualMode) return;
    const interval = setInterval(() => {
      const current = useGraphLab.getState().colouringStepIndex;
      if (current >= maxStep) {
        useGraphLab.getState().toggleColouringPlayback();
      } else {
        useGraphLab.getState().nextColouringStep(maxStep);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [isColouringPlaying, maxStep, useManualMode]);

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 9
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setUseManualMode(false);
                loadPreset('petersen');
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              <span>Petersen (χ=3)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUseManualMode(false);
                loadPreset('cycle');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Cycle C₅ (χ=3)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUseManualMode(false);
                loadPreset('k_n', 4);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>K₄ (χ=4)</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Graph Colouring &amp; Chromatic Number</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          A <strong>Proper Vertex Colouring</strong> assigns colours to vertices such that no adjacent vertices share
          the same colour. The <strong>Chromatic Number χ(G)</strong> is the minimal number of colours required.
        </p>
      </div>

      {/* Chromatic Number & Bounds Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Exact or Bound Chromatic Number */}
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
            Chromatic Number χ(G)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {data.chromaticNumber}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                data.isExact
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {data.isExact ? 'Exact' : 'Upper Bound'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {data.isExact ? 'Proven minimal colours' : 'Greedy heuristic bound'}
          </span>
        </div>

        {/* Clique Lower Bound */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Clique Lower Bound
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400">
            ω(G) = {data.cliqueLowerBound}
          </span>
          <span className="text-[11px] text-slate-400">
            χ(G) ≥ ω(G) (Max clique size)
          </span>
        </div>

        {/* Degree Upper Bound */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Degree Upper Bound
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            Δ(G) + 1 = {data.degreeUpperBound}
          </span>
          <span className="text-[11px] text-slate-400">
            χ(G) ≤ Δ(G) + 1 (Brooks&apos; Theorem)
          </span>
        </div>
      </div>

      {/* Mode Toggle: Greedy vs Manual */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
        <span className="text-xs font-semibold text-white">Colouring Mode:</span>
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setUseManualMode(false)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              !useManualMode
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Greedy Algorithm
          </button>
          <button
            type="button"
            onClick={() => setUseManualMode(true)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              useManualMode
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Colouring
          </button>
        </div>
      </div>

      {/* GREEDY MODE CONTROLS & STEP PLAYER */}
      {!useManualMode ? (
        <div className="flex flex-col gap-4">
          {/* Strategy Selector */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-400">Vertex Ordering Strategy:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setColouringStrategy('degree')}
                className={`px-2.5 py-1 rounded-lg font-semibold border transition-colors ${
                  colouringStrategy === 'degree'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Welsh-Powell (Degree-Descending)
              </button>
              <button
                type="button"
                onClick={() => setColouringStrategy('alphabetical')}
                className={`px-2.5 py-1 rounded-lg font-semibold border transition-colors ${
                  colouringStrategy === 'alphabetical'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Alphabetical Order
              </button>
            </div>
          </div>

          {/* Greedy Step Player */}
          {steps.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Greedy Step Player</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Step <strong className="text-white">{colouringStepIndex}</strong> of {maxStep}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono">
                {steps[colouringStepIndex]?.description || 'Step complete'}
              </div>

              <input
                type="range"
                min={0}
                max={maxStep}
                value={colouringStepIndex}
                onChange={(e) => setColouringStepIndex(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setColouringStepIndex(0)}
                  disabled={colouringStepIndex === 0}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={prevColouringStep}
                  disabled={colouringStepIndex === 0}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleColouringPlayback}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                >
                  {isColouringPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isColouringPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => nextColouringStep(maxStep)}
                  disabled={colouringStepIndex >= maxStep}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setColouringStepIndex(maxStep)}
                  disabled={colouringStepIndex >= maxStep}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MANUAL COLOURING MODE */
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Manual Vertex Colouring</h3>
            </div>
            <button
              type="button"
              onClick={resetManualColors}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
            >
              Reset Manual
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Click color circles to assign a color to each vertex. Adjacent vertices sharing the same
            color trigger a conflict alert!
          </p>

          {/* Conflict Banner */}
          {data.hasConflicts ? (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Conflict Detected!</strong> {data.conflictingEdges.length} edge(s) connect
                vertices of the same colour (highlighted in red).
              </span>
            </div>
          ) : Object.keys(manualColors).length === graph.vertices.length && graph.vertices.length > 0 ? (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Proper Vertex Colouring! No adjacent vertices share a colour.</span>
            </div>
          ) : null}

          {/* Vertex Color Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {graph.vertices.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
              >
                <span className="font-bold text-white font-mono">{v.label}</span>
                <div className="flex items-center gap-1">
                  {COLOR_PALETTE.slice(0, 5).map((color, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => setManualColor(v.id, cIdx)}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        manualColors[v.id] === cIdx
                          ? 'scale-125 border-white shadow'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
