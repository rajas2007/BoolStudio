'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { findHamiltonianPathsAndCycles } from '@/lib/graph-theory/hamiltonian';
import {
  RotateCcw,
  Compass,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function HamiltonianPanel() {
  const {
    graph,
    hamiltonianStepIndex,
    isHamiltonianPlaying,
    setHamiltonianStepIndex,
    toggleHamiltonianPlayback,
    nextHamiltonianStep,
    prevHamiltonianStep,
    setActiveHighlight,
    loadPreset,
  } = useGraphLab();

  const output = useMemo(() => findHamiltonianPathsAndCycles(graph), [graph]);
  const data = output.result;
  const steps = useMemo(() => output.steps || [], [output.steps]);
  const maxStep = Math.max(0, steps.length - 1);

  // Sync canvas highlight with step
  useEffect(() => {
    if (steps.length > 0 && steps[hamiltonianStepIndex]) {
      setActiveHighlight(steps[hamiltonianStepIndex].highlight);
    } else {
      setActiveHighlight(output.highlight);
    }
  }, [hamiltonianStepIndex, steps, output.highlight, setActiveHighlight]);

  // Playback timer
  useEffect(() => {
    if (!isHamiltonianPlaying || maxStep === 0) return;
    const interval = setInterval(() => {
      const current = useGraphLab.getState().hamiltonianStepIndex;
      if (current >= maxStep) {
        useGraphLab.getState().toggleHamiltonianPlayback();
      } else {
        useGraphLab.getState().nextHamiltonianStep(maxStep);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [isHamiltonianPlaying, maxStep]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  const hasSolution = data.hasCycle || data.hasPath;
  const activeSequence = data.hasCycle ? data.cycle : data.path;

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 4
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadPreset('cycle')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Try Cycle (C₅)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('petersen')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Petersen</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Hamiltonian Paths &amp; Cycles</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          A <strong>Hamiltonian Path</strong> visits every vertex of the graph exactly once.
          A <strong>Hamiltonian Cycle</strong> is a closed loop visiting every vertex exactly once.
        </p>
      </div>

      {/* Main Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          data.hasCycle
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : data.hasPath
            ? 'bg-indigo-950/20 border-indigo-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {data.hasCycle ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : data.hasPath ? (
            <Compass className="w-5 h-5 text-indigo-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white">
              {data.hasCycle
                ? 'Hamiltonian Cycle Found'
                : data.hasPath
                ? 'Hamiltonian Path (Open) Found'
                : 'No Hamiltonian Path or Cycle'}
            </h3>
            <span className="text-xs text-slate-300 leading-relaxed">
              {output.explanation}
            </span>
          </div>
        </div>
      </div>

      {/* Dirac and Ore Sufficient Conditions */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Sufficient Theorems (Undirected Graphs)
        </h3>

        {/* Dirac's Condition Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">1. Dirac&apos;s Theorem (1952)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                data.diracCondition.holds
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {data.diracCondition.holds ? 'Holds (Guaranteed)' : 'Inconclusive'}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            If simple graph with n ≥ 3 has minimum degree{' '}
            <code className="text-indigo-300">δ(G) ≥ n/2</code>, then G contains a Hamiltonian Cycle.
          </p>
          <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
            {data.diracCondition.explanation}
          </div>
        </div>

        {/* Ore's Condition Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">2. Ore&apos;s Theorem (1960)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                data.oreCondition.holds
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {data.oreCondition.holds ? 'Holds (Guaranteed)' : 'Inconclusive'}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            If for every pair of non-adjacent vertices u and v,{' '}
            <code className="text-indigo-300">deg(u) + deg(v) ≥ n</code>, then G contains a
            Hamiltonian Cycle.
          </p>
          <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
            {data.oreCondition.explanation}
          </div>
        </div>
      </div>

      {/* Step Player for Found Traversal */}
      {hasSolution && steps.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Traversal Step Player</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Step <strong className="text-white">{hamiltonianStepIndex}</strong> of {maxStep}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono">
            {steps[hamiltonianStepIndex]?.description || 'Step complete'}
          </div>

          <input
            type="range"
            min={0}
            max={maxStep}
            value={hamiltonianStepIndex}
            onChange={(e) => setHamiltonianStepIndex(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setHamiltonianStepIndex(0)}
              disabled={hamiltonianStepIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="First step"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={prevHamiltonianStep}
              disabled={hamiltonianStepIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleHamiltonianPlayback}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
            >
              {isHamiltonianPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isHamiltonianPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={() => nextHamiltonianStep(maxStep)}
              disabled={hamiltonianStepIndex >= maxStep}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setHamiltonianStepIndex(maxStep)}
              disabled={hamiltonianStepIndex >= maxStep}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
              title="Last step"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 block mb-1">
              {data.hasCycle ? 'Cycle Sequence:' : 'Path Sequence:'}
            </span>
            <div className="font-mono text-xs text-indigo-300 break-words bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {activeSequence.map((id) => vertexLabelMap.get(id) || id).join(' → ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
