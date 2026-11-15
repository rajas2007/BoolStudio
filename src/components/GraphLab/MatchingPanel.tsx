'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeBipartiteMatching } from '@/lib/graph-theory/matching';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function MatchingPanel() {
  const {
    graph,
    matchingStepIndex,
    setMatchingStepIndex,
    setActiveHighlight,
    loadPreset,
  } = useGraphLab();

  const output = useMemo(() => computeBipartiteMatching(graph), [graph]);
  const data = output.result;
  const steps = useMemo(() => output.steps || [], [output.steps]);
  const maxStep = Math.max(0, steps.length - 1);

  // Sync canvas highlight
  useEffect(() => {
    if (steps.length > 0 && steps[matchingStepIndex]) {
      setActiveHighlight(steps[matchingStepIndex].highlight);
    } else {
      setActiveHighlight(output.highlight);
    }
  }, [matchingStepIndex, steps, output.highlight, setActiveHighlight]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 7
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadPreset('star')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Try Star (Violates Hall)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('k_mn', 3, 3)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>K₃,₃ (Perfect)</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Bipartite Matching &amp; Hall&apos;s Theorem</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          A <strong>matching</strong> in a graph is a set of edges without common vertices.
          <strong> Hall&apos;s Marriage Theorem</strong> states that a bipartite graph has a matching saturating Set A
          if and only if for every subset <code className="text-indigo-300">S ⊆ A</code>,{' '}
          <code className="text-emerald-300">|N(S)| ≥ |S|</code>.
        </p>
      </div>

      {/* Non-Bipartite Warning Banner if applicable */}
      {!data.isBipartite && (
        <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/40 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Precondition Warning: Graph is NOT Bipartite</span>
          </div>
          <p className="text-slate-300">
            Matching algorithms and Hall&apos;s condition strictly require a 2-colourable bipartite graph.
            Click below to load a valid bipartite graph.
          </p>
          <button
            type="button"
            onClick={() => loadPreset('k_mn', 3, 3)}
            className="w-fit px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors"
          >
            Convert to Bipartite (K₃,₃)
          </button>
        </div>
      )}

      {/* Main Matching Status Banner */}
      {data.isBipartite && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
            data.isPerfect
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-indigo-950/20 border-indigo-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-white">
                {data.isPerfect ? 'Perfect Matching Exists' : 'Maximum Matching Computed'}
              </h3>
              <span className="text-xs text-slate-300 leading-relaxed">
                {output.explanation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Size |M|:</span>
            <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
              {data.matchingSize}
            </span>
          </div>
        </div>
      )}

      {/* Hall's Marriage Theorem Card */}
      {data.isBipartite && (
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
            data.hallCondition.holds
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-950/20 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {data.hallCondition.holds ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <h3 className="text-sm font-bold text-white">Hall&apos;s Marriage Condition</h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                data.hallCondition.holds
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {data.hallCondition.holds ? 'Condition Satisfied' : 'Condition Violated'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {data.hallCondition.explanation}
          </p>

          {/* Constructive Violator Witness S if violated */}
          {!data.hallCondition.holds && data.hallCondition.violatingSubsetS && (
            <div className="p-3 rounded-lg bg-slate-950 border border-rose-900/40 text-xs flex flex-col gap-1.5 font-mono">
              <span className="text-rose-400 font-bold">Constructive Failure Witness:</span>
              <div className="text-slate-300">
                • Violating subset S:{' '}
                <strong className="text-rose-300">
                  {'{ ' +
                    data.hallCondition.violatingSubsetS
                      .map((id) => vertexLabelMap.get(id) || id)
                      .join(', ') +
                    ' }'}
                </strong>{' '}
                (|S| = {data.hallCondition.violatingSubsetS.length})
              </div>
              <div className="text-slate-300">
                • Open neighborhood N(S):{' '}
                <strong className="text-amber-300">
                  {'{ ' +
                    (data.hallCondition.neighborsNS || [])
                      .map((id) => vertexLabelMap.get(id) || id)
                      .join(', ') +
                    ' }'}
                </strong>{' '}
                (|N(S)| = {data.hallCondition.neighborsNS?.length || 0})
              </div>
              <span className="text-[11px] text-slate-400 italic">
                Because |N(S)| &lt; |S|, no matching can saturate this partition.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step Player for Augmenting Paths */}
      {data.isBipartite && steps.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Augmenting Path Steps</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                Step {matchingStepIndex + 1} of {steps.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMatchingStepIndex(Math.max(0, matchingStepIndex - 1))}
                  disabled={matchingStepIndex === 0}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMatchingStepIndex(Math.min(maxStep, matchingStepIndex + 1))}
                  disabled={matchingStepIndex >= maxStep}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono">
            {steps[matchingStepIndex]?.description || 'Initial matching state'}
          </div>
        </div>
      )}
    </div>
  );
}
