'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { findEulerianPathOrCircuit } from '@/lib/graph-theory/euler';
import {
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

export function EulerPanel() {
  const {
    graph,
    eulerStepIndex,
    isEulerPlaying,
    setEulerStepIndex,
    toggleEulerPlayback,
    nextEulerStep,
    prevEulerStep,
    setActiveHighlight,
    loadPreset,
  } = useGraphLab();

  const output = useMemo(() => findEulerianPathOrCircuit(graph), [graph]);
  const data = output.result;
  const steps = useMemo(() => output.steps || [], [output.steps]);
  const maxStep = Math.max(0, steps.length - 1);

  // Sync canvas highlight with current step
  useEffect(() => {
    if (steps.length > 0 && steps[eulerStepIndex]) {
      setActiveHighlight(steps[eulerStepIndex].highlight);
    } else {
      setActiveHighlight(output.highlight);
    }
  }, [eulerStepIndex, steps, output.highlight, setActiveHighlight]);

  // Playback loop
  useEffect(() => {
    if (!isEulerPlaying || maxStep === 0) return;
    const interval = setInterval(() => {
      const current = useGraphLab.getState().eulerStepIndex;
      if (current >= maxStep) {
        useGraphLab.getState().toggleEulerPlayback();
      } else {
        useGraphLab.getState().nextEulerStep(maxStep);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [isEulerPlaying, maxStep]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  const hasSolution = data.hasCircuit || data.hasTrail;

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 3
          </span>
          <button
            type="button"
            onClick={() => loadPreset('cycle')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Try Cycle (C₅)</span>
          </button>
        </div>
        <h2 className="text-lg font-bold text-white">Euler Tours &amp; Trails</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          An <strong>Eulerian Circuit</strong> traverses every edge exactly once and returns to the start vertex.
          An <strong>Eulerian Trail</strong> traverses every edge exactly once but starts and ends at distinct vertices.
        </p>
      </div>

      {/* Existence Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          data.hasCircuit
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : data.hasTrail
            ? 'bg-indigo-950/20 border-indigo-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {hasSolution ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white">
              {data.hasCircuit
                ? 'Eulerian Circuit Exists'
                : data.hasTrail
                ? 'Eulerian Trail Exists'
                : 'No Eulerian Tour or Trail'}
            </h3>
            <span className="text-xs text-slate-300 leading-relaxed">
              {output.explanation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400">Odd Vertices:</span>
          <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white">
            {data.oddVertices.length}
          </span>
        </div>
      </div>

      {/* Theorem Check Details */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex flex-col gap-2">
        <span className="font-semibold text-white">Euler&apos;s Theorem Conditions:</span>
        <div className="space-y-1 text-slate-300">
          <div>
            1. <strong>Connectivity:</strong> All edges must belong to a single connected component. (
            <span className={data.isDisconnected ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {data.isDisconnected ? 'Disconnected' : 'Connected'}
            </span>
            )
          </div>
          <div>
            2. <strong>Degree Parity:</strong>
            {graph.isDirected ? (
              <span> Every vertex must satisfy in-deg = out-deg (circuit) or exactly one pair has diff ±1 (trail).</span>
            ) : (
              <span> Exactly 0 odd vertices (circuit) or exactly 2 odd vertices (trail).</span>
            )}
          </div>
        </div>
      </div>

      {/* Hierholzer's Algorithm Step Player */}
      {hasSolution && steps.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Hierholzer&apos;s Step Player</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Step <strong className="text-white">{eulerStepIndex}</strong> of {maxStep}
            </span>
          </div>

          {/* Current Step Description */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono">
            {steps[eulerStepIndex]?.description || 'Step complete'}
          </div>

          {/* Scrubber slider */}
          <input
            type="range"
            min={0}
            max={maxStep}
            value={eulerStepIndex}
            onChange={(e) => setEulerStepIndex(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          {/* Player controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setEulerStepIndex(0)}
              disabled={eulerStepIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="First step"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={prevEulerStep}
              disabled={eulerStepIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleEulerPlayback}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
            >
              {isEulerPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isEulerPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={() => nextEulerStep(maxStep)}
              disabled={eulerStepIndex >= maxStep}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setEulerStepIndex(maxStep)}
              disabled={eulerStepIndex >= maxStep}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="Last step"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Full Sequence Display */}
          <div className="pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 block mb-1">Full Traversal Sequence:</span>
            <div className="font-mono text-xs text-emerald-300 break-words bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {data.circuitOrTrail.map((id) => vertexLabelMap.get(id) || id).join(' → ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
