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
    <div className="flex flex-col gap-3 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 9: Graph Colouring
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setUseManualMode(false);
                loadPreset('petersen');
              }}
              className="px-2 py-0.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-[11px] font-medium transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5 inline mr-1" />
              <span>Petersen (χ=3)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUseManualMode(false);
                loadPreset('cycle');
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              <span>Cycle C₅ (χ=3)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUseManualMode(false);
                loadPreset('k_n', 4);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              <span>K₄ (χ=4)</span>
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Assigns colours so no adjacent vertices share a colour. The <strong>Chromatic Number χ(G)</strong> is the minimal colours required.
        </p>
      </div>

      {/* Chromatic Number & Bounds Ribbon (Compact 3-Card Grid) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold truncate">
            Chromatic Number
          </span>
          <div className="flex items-baseline gap-1.5 my-0.5">
            <span className="text-xl font-bold font-mono text-white">{data.chromaticNumber}</span>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                data.isExact
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {data.isExact ? 'Exact' : 'Bound'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 truncate">
            {data.isExact ? 'Minimal proven' : 'Greedy bound'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold truncate">
            Clique Lower
          </span>
          <span className="text-xl font-bold font-mono text-amber-400 my-0.5">
            ω(G) = {data.cliqueLowerBound}
          </span>
          <span className="text-[10px] text-slate-400 truncate">χ(G) ≥ ω(G)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold truncate">
            Degree Upper
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400 my-0.5">
            Δ+1 = {data.degreeUpperBound}
          </span>
          <span className="text-[10px] text-slate-400 truncate">Brooks: χ ≤ Δ+1</span>
        </div>
      </div>

      {/* Mode Toggle: Greedy vs Manual */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800">
        <span className="text-xs font-semibold text-white">Mode:</span>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setUseManualMode(false)}
            className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors ${
              !useManualMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Greedy Algorithm
          </button>
          <button
            type="button"
            onClick={() => setUseManualMode(true)}
            className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors ${
              useManualMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Colouring
          </button>
        </div>
      </div>

      {/* GREEDY MODE CONTROLS & STEP PLAYER */}
      {!useManualMode ? (
        <div className="flex flex-col gap-2.5">
          {/* Strategy Selector */}
          <div className="flex items-center justify-between flex-wrap gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400">Ordering Strategy:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setColouringStrategy('degree')}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold border transition-colors ${
                  colouringStrategy === 'degree'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Welsh-Powell (Degree)
              </button>
              <button
                type="button"
                onClick={() => setColouringStrategy('alphabetical')}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold border transition-colors ${
                  colouringStrategy === 'alphabetical'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Alphabetical
              </button>
            </div>
          </div>

          {/* Greedy Step Player */}
          {steps.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white">Greedy Step Player</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Step <strong className="text-white">{colouringStepIndex}</strong> of {maxStep}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 font-mono">
                {steps[colouringStepIndex]?.description || 'Step complete'}
              </div>

              <input
                type="range"
                min={0}
                max={maxStep}
                value={colouringStepIndex}
                onChange={(e) => setColouringStepIndex(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5"
              />

              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setColouringStepIndex(0)}
                  disabled={colouringStepIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                  title="First step"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={prevColouringStep}
                  disabled={colouringStepIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                  title="Previous step"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleColouringPlayback}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-md shadow-indigo-600/20"
                >
                  {isColouringPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isColouringPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => nextColouringStep(maxStep)}
                  disabled={colouringStepIndex >= maxStep}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                  title="Next step"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setColouringStepIndex(maxStep)}
                  disabled={colouringStepIndex >= maxStep}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                  title="Last step"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MANUAL COLOURING MODE */
        <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Manual Vertex Colouring</h3>
            </div>
            <button
              type="button"
              onClick={resetManualColors}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300"
            >
              Reset Manual
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Click color circles to assign a color to each vertex. Adjacent vertices sharing the same color trigger a conflict alert!
          </p>

          {/* Conflict Banner */}
          {data.hasConflicts ? (
            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Conflict Detected!</strong> {data.conflictingEdges.length} edge(s) connect vertices of the same colour.
              </span>
            </div>
          ) : Object.keys(manualColors).length === graph.vertices.length && graph.vertices.length > 0 ? (
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Proper Vertex Colouring! No adjacent vertices share a colour.</span>
            </div>
          ) : null}

          {/* Vertex Color Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {graph.vertices.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
              >
                <span className="font-bold text-white font-mono">{v.label}</span>
                <div className="flex items-center gap-1">
                  {COLOR_PALETTE.slice(0, 5).map((color, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => setManualColor(v.id, cIdx)}
                      className={`w-4 h-4 rounded-full border transition-transform ${
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
