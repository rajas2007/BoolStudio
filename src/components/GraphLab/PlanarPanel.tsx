'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { evaluatePlanarBound } from '@/lib/graph-theory/planar-bound';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export function PlanarPanel() {
  const { graph, setActiveHighlight, loadPreset } = useGraphLab();

  const output = useMemo(() => evaluatePlanarBound(graph), [graph]);
  const data = output.result;

  useEffect(() => {
    setActiveHighlight(output.highlight);
  }, [output.highlight, setActiveHighlight]);

  const theoreticalFaces = Math.max(0, data.size - data.order + 2);

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 8
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => loadPreset('planar')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              <span>Planar (W₄)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('k_n', 5)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 border border-rose-800/40 text-xs font-medium transition-colors"
            >
              <span>K₅</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('non_planar')}
              className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 border border-rose-800/40 text-xs font-medium transition-colors"
            >
              <span>K₃,₃</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('petersen')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Petersen</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Planar Graphs &amp; Edge Bounds</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          A graph is <strong>Planar</strong> if it can be drawn in the plane without edges crossing.
          Necessary edge bounds: <code className="text-indigo-300">E ≤ 3V - 6</code> (general), and{' '}
          <code className="text-emerald-300">E ≤ 2V - 4</code> (bipartite / triangle-free).
        </p>
      </div>

      {/* Main Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          data.status === 'DEFINITELY_NON_PLANAR'
            ? 'bg-rose-950/20 border-rose-500/30'
            : data.status === 'TRIVIAL'
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-amber-950/20 border-amber-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {data.status === 'DEFINITELY_NON_PLANAR' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : data.status === 'TRIVIAL' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white">
              {data.status === 'DEFINITELY_NON_PLANAR'
                ? 'Definitely NOT Planar (Bound Violated)'
                : data.status === 'TRIVIAL'
                ? 'Trivially Planar (|V| < 3)'
                : 'Inconclusive (Edge Bounds Satisfied)'}
            </h3>
            <span className="text-xs text-slate-300 leading-relaxed">
              {output.explanation}
            </span>
          </div>
        </div>
      </div>

      {/* Edge Bound Cards */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Planar Edge Bounds Evaluation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* General Bound */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
              data.violatesGeneral
                ? 'bg-rose-950/20 border-rose-500/30'
                : 'bg-slate-900/40 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">General Bound: E ≤ 3V - 6</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  data.violatesGeneral
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {data.violatesGeneral ? 'VIOLATED' : 'Satisfied'}
              </span>
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
              |E| = {data.size} {data.violatesGeneral ? '>' : '≤'} 3({data.order}) - 6 = {data.generalBound}
            </div>
            <span className="text-[11px] text-slate-400">
              Every planar simple graph with |V| ≥ 3 must satisfy this bound.
            </span>
          </div>

          {/* Bipartite Bound */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
              data.violatesBipartite
                ? 'bg-rose-950/20 border-rose-500/30'
                : 'bg-slate-900/40 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Bipartite Bound: E ≤ 2V - 4</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  data.violatesBipartite
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : data.isBipartite
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {data.violatesBipartite
                  ? 'VIOLATED'
                  : data.isBipartite
                  ? 'Satisfied'
                  : 'N/A (Not Bipartite)'}
              </span>
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
              |E| = {data.size} {data.violatesBipartite ? '>' : '≤'} 2({data.order}) - 4 = {data.bipartiteBound}
            </div>
            <span className="text-[11px] text-slate-400">
              Applies to triangle-free or bipartite graphs (girth ≥ 4).
            </span>
          </div>
        </div>
      </div>

      {/* Crucial Inconclusive Rule Callout */}
      {data.status === 'INCONCLUSIVE' && (
        <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/40 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <Info className="w-4 h-4 text-amber-400" />
            <span>CRITICAL: Edge Bounds are Necessary, NOT Sufficient!</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Satisfying E ≤ 3V - 6 does <strong>NOT</strong> prove that a graph is planar!
            A classic counterexample is the <strong>Petersen Graph</strong>: with |V| = 10 and |E| = 15,
            it satisfies 15 ≤ 3(10) - 6 = 24, but it is <em>non-planar</em> by Kuratowski&apos;s Theorem
            because it contains a subdivision of K₃,₃.
          </p>
        </div>
      )}

      {/* Euler's Polyhedral Formula */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2.5 text-xs">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Euler&apos;s Polyhedral Formula</span>
        </div>
        <p className="text-slate-300">
          For any connected planar graph drawn in the plane:
        </p>
        <div className="font-mono text-xs font-bold text-indigo-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          V - E + F = 2 ⟹ F = E - V + 2 = {data.size} - {data.order} + 2 = {theoreticalFaces} faces
        </div>
        <span className="text-[11px] text-slate-400">
          (Assuming the graph is connected and planar; F includes the unbounded exterior face).
        </span>
      </div>

      {/* Canonical Non-Planar Graphs Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1">
          <span className="font-bold text-rose-300">K₅ Proof (Complete):</span>
          <span className="text-slate-400">
            V = 5, E = 10.
            <br />
            General bound: 3(5) - 6 = 9.
            <br />
            Since 10 &gt; 9, K₅ is definitely non-planar.
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1">
          <span className="font-bold text-rose-300">K₃,₃ Proof (Utility):</span>
          <span className="text-slate-400">
            Bipartite, V = 6, E = 9.
            <br />
            Bipartite bound: 2(6) - 4 = 8.
            <br />
            Since 9 &gt; 8, K₃,₃ is definitely non-planar.
          </span>
        </div>
      </div>
    </div>
  );
}
