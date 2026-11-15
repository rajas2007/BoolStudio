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
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function EulerPanel() {
  const {
    graph,
    eulerStepIndex,
    isEulerPlaying,
    setEulerStepIndex,
    nextEulerStep,
    prevEulerStep,
    toggleEulerPlayback,
  } = useGraphLab();

  const euler = useMemo(() => findEulerianPathOrCircuit(graph), [graph]);

  const maxSteps = euler.circuitOrTrail.length > 0 ? euler.circuitOrTrail.length - 1 : 0;

  // Animation timer for playback
  useEffect(() => {
    if (!isEulerPlaying || maxSteps === 0) return;

    const interval = setInterval(() => {
      const current = useGraphLab.getState().eulerStepIndex;
      if (current >= maxSteps) {
        useGraphLab.getState().toggleEulerPlayback();
      } else {
        useGraphLab.getState().nextEulerStep();
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isEulerPlaying, maxSteps]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  const hasPath = euler.hasEulerCircuit || euler.hasEulerTrail;

  return (
    <div className="flex flex-col gap-6">
      {/* Existence Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
          euler.hasEulerCircuit
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : euler.hasEulerTrail
            ? 'bg-indigo-950/20 border-indigo-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {hasPath ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400" />
          )}

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white">
              {euler.hasEulerCircuit
                ? 'Eulerian Circuit Exists'
                : euler.hasEulerTrail
                ? 'Eulerian Trail (Open) Exists'
                : 'No Eulerian Trail or Circuit'}
            </h3>
            <span className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {euler.reason}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400">
            Odd Degree Vertices:
          </span>
          <span className="text-xl font-bold font-mono text-white px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
            {euler.oddDegreeVertices.length}
          </span>
        </div>
      </div>

      {/* Hierholzer Traversal Animation & Step-Through Player */}
      {hasPath && maxSteps > 0 && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Hierholzer Traversal Player
              </h4>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Step {eulerStepIndex} of {maxSteps} edges traversed
            </span>
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => setEulerStepIndex(0)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={prevEulerStep}
              disabled={eulerStepIndex <= 0}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous step"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={toggleEulerPlayback}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all text-xs"
            >
              {isEulerPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{eulerStepIndex >= maxSteps ? 'Replay' : 'Play'}</span>
                </>
              )}
            </button>
            <button
              onClick={nextEulerStep}
              disabled={eulerStepIndex >= maxSteps}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next step"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Scrubber Range Input */}
          <input
            type="range"
            min="0"
            max={maxSteps}
            value={eulerStepIndex}
            onChange={(e) => setEulerStepIndex(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />

          {/* Traversed Path Chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold">
              Euler Traversal Sequence:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs max-h-36 overflow-y-auto p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              {euler.circuitOrTrail.map((vId, idx) => {
                const label = vertexLabelMap.get(vId) || vId;
                const isTraversed = idx <= eulerStepIndex;

                return (
                  <React.Fragment key={idx}>
                    <span
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        idx === eulerStepIndex
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 scale-105'
                          : isTraversed
                          ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {label}
                    </span>
                    {idx < euler.circuitOrTrail.length - 1 && (
                      <ArrowRight
                        className={`w-3 h-3 ${
                          idx < eulerStepIndex ? 'text-emerald-400' : 'text-slate-700'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Educational Theorem Reference Box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Euler&apos;s Theorem (1736 - Königsberg Bridges):</span>
        </div>
        <ul className="list-disc list-inside text-[11px] leading-relaxed space-y-1">
          <li>
            <strong>Euler Circuit:</strong> A closed walk that visits every edge of a graph
            exactly once and returns to the starting vertex. Exists in a connected graph if
            and only if <em>every vertex has an even degree</em> (0 odd vertices).
          </li>
          <li>
            <strong>Euler Trail:</strong> An open walk that visits every edge exactly once.
            Exists if and only if <em>exactly two vertices have an odd degree</em> (the trail
            must start at one and end at the other).
          </li>
          <li>
            <strong>Hierholzer&apos;s Algorithm:</strong> Efficiently finds an Eulerian
            path in O(|E|) time by iteratively constructing sub-circuits and merging them.
          </li>
          <li>
            <strong>Connectivity Convention:</strong> Isolated vertices are ignored; some textbooks require the whole graph to be connected.
          </li>
        </ul>
      </div>
    </div>
  );
}
