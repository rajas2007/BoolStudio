'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { checkBipartite } from '@/lib/graph-theory/bipartite';
import { CheckCircle2, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';

export function BipartitePanel() {
  const { graph } = useGraphLab();
  const result = useMemo(() => checkBipartite(graph), [graph]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  return (
    <div className="flex flex-col gap-6">
      {/* Result Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
          result.isBipartite
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {result.isBipartite ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertOctagon className="w-6 h-6 text-rose-400" />
          )}

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white">
              {result.isBipartite
                ? 'Graph is Bipartite (2-Colourable)'
                : 'Graph is NOT Bipartite'}
            </h3>
            <span className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {result.explanation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.isBipartite
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {result.isBipartite ? '✓ 2-Colourable' : '✕ Contains Odd Cycle'}
          </span>
        </div>
      </div>

      {/* Partitions or Odd Cycle Certificate */}
      {result.isBipartite ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Partition Set A */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-sm font-bold text-indigo-300">
                  Partition Set A (Color 0)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.partitionA.length} vertices
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {result.partitionA.map((id) => (
                <span
                  key={id}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-900/40 text-indigo-200 border border-indigo-500/40"
                >
                  {vertexLabelMap.get(id) || id}
                </span>
              ))}
            </div>
          </div>

          {/* Partition Set B */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-emerald-300">
                  Partition Set B (Color 1)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.partitionB.length} vertices
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {result.partitionB.map((id) => (
                <span
                  key={id}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-900/40 text-emerald-200 border border-emerald-500/40"
                >
                  {vertexLabelMap.get(id) || id}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Non-Bipartite Proof: Odd Cycle Certificate */
        result.oddCycle && (
          <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-rose-300 tracking-wider">
                Non-Bipartiteness Proof: Odd Cycle
              </span>
              <span className="text-xs font-mono text-rose-400">
                Cycle Length: {result.oddCycle.length - 1} (Odd)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              The following cycle of odd length was found by BFS. The edges and vertices
              of this odd cycle are highlighted in rose on the canvas:
            </p>
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs p-3 rounded-xl bg-slate-950/70 border border-rose-500/30">
              {result.oddCycle.map((vId, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded-lg font-bold bg-rose-500/20 text-rose-200 border border-rose-500/40">
                    {vertexLabelMap.get(vId) || vId}
                  </span>
                  {idx < result.oddCycle!.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      )}

      {/* Educational Theorem Note */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>König&apos;s Theorem (1936):</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          A graph is <strong>bipartite</strong> (and thus 2-colourable) if and only if it
          contains <strong>no odd cycles</strong>. If an odd cycle exists, it is impossible to
          alternate two colors without forcing two adjacent vertices to share the same color.
        </p>
      </div>
    </div>
  );
}
