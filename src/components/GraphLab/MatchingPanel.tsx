'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeBipartiteMatching } from '@/lib/graph-theory/matching';
import {
  XCircle,
  HelpCircle,
  Link2,
  AlertTriangle,
} from 'lucide-react';

export function MatchingPanel() {
  const { graph } = useGraphLab();
  const result = useMemo(() => computeBipartiteMatching(graph), [graph]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  return (
    <div className="flex flex-col gap-6">
      {/* Non-Bipartite Alert */}
      {!result.isBipartite && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-rose-400 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-white">Graph Is Not Bipartite</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Matching Status Banner if Bipartite */}
      {result.isBipartite && (
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
            result.isPerfect
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-indigo-950/20 border-indigo-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <Link2 className="w-6 h-6 text-emerald-400" />
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-white">
                {result.isPerfect
                  ? 'Perfect Matching Found'
                  : 'Maximum Matching Found (Not Perfect)'}
              </h3>
              <span className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {result.explanation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                result.isPerfect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {result.isPerfect ? '✓ Perfect Matching' : '✓ Maximum Matching'}
            </span>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {result.isBipartite && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Matching Size |M|
            </span>
            <span className="text-3xl font-extrabold text-white font-mono mt-1">
              {result.matchingSize}
            </span>
            <span className="text-[11px] text-slate-400">
              Independent non-adjacent edges
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Vertex Coverage
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              {result.matchingSize * 2} / {graph.vertices.length}
            </span>
            <span className="text-[11px] text-slate-400">
              Vertices paired in matching
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Perfect Status
            </span>
            <span className="text-lg font-bold text-white mt-1">
              {result.isPerfect
                ? graph.vertices.length === 0
                  ? 'Perfect (Size 0)'
                  : 'Perfect (100%)'
                : 'Imperfect'}
            </span>
            <span className="text-[11px] text-slate-400">
              {result.isPerfect
                ? 'All vertices are matched'
                : `${graph.vertices.length - result.matchingSize * 2} unmatched vertex(es)`}
            </span>
          </div>
        </div>
      )}

      {/* Hall's Condition Violator Alert */}
      {result.isBipartite && result.violatorSetS && result.neighborSetNS && (
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Hall&apos;s Marriage Condition Violator:</span>
            </div>
            <span className="text-xs font-mono text-amber-300">
              |N(S)| = {result.neighborSetNS.length} &lt; |S| = {result.violatorSetS.length}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            By <strong>Hall&apos;s Marriage Theorem</strong>, a complete matching from set A to set B exists
            if and only if for every subset S ⊆ A, the neighborhood satisfies <code>|N(S)| ≥ |S|</code>.
            Here, subset S has fewer combined neighbors than elements, making a complete matching mathematically impossible:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-indigo-300 font-bold">Subset S ({result.violatorSetS.length} vertices):</span>
              <div className="flex items-center gap-1 flex-wrap font-mono">
                {result.violatorSetS.map((id) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-200 border border-indigo-500/40">
                    {vertexLabelMap.get(id) || id}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-emerald-300 font-bold">Neighborhood N(S) ({result.neighborSetNS.length} vertices):</span>
              <div className="flex items-center gap-1 flex-wrap font-mono">
                {result.neighborSetNS.length === 0 ? (
                  <span className="text-slate-500 italic">Empty set ∅</span>
                ) : (
                  result.neighborSetNS.map((id) => (
                    <span key={id} className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-200 border border-emerald-500/40">
                      {vertexLabelMap.get(id) || id}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Theorem Reference Box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Bipartite Matching &amp; Hall&apos;s Theorem (Unit 6):</span>
        </div>
        <ul className="list-disc list-inside text-[11px] leading-relaxed space-y-1">
          <li>
            <strong>Matching:</strong> A set of edges without common vertices.
          </li>
          <li>
            <strong>Berge&apos;s Lemma (1957):</strong> A matching M is maximum if and only if
            there is no augmenting path with respect to M.
          </li>
          <li>
            <strong>Hall&apos;s Marriage Theorem (1935):</strong> If G = (A ∪ B, E) is bipartite,
            there is a matching that covers all vertices of A if and only if for every subset S ⊆ A,
            <code>|N(S)| ≥ |S|</code>.
          </li>
          <li>
            <strong>König&apos;s Theorem:</strong> In any bipartite graph, the size of a maximum matching
            equals the size of a minimum vertex cover.
          </li>
        </ul>
      </div>
    </div>
  );
}
