'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { checkBipartite } from '@/lib/graph-theory/bipartite';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function BipartitePanel() {
  const { graph, setActiveHighlight, loadPreset } = useGraphLab();

  const output = useMemo(() => checkBipartite(graph), [graph]);
  const data = output.result;

  useEffect(() => {
    setActiveHighlight(output.highlight);
  }, [output.highlight, setActiveHighlight]);

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
            Syllabus Unit 6 • Topic 6
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadPreset('k_mn', 3, 3)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Try K₃,₃</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('cycle')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Cycle (C₅)</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Bipartite Graphs &amp; 2-Colouring</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          A graph is <strong>Bipartite</strong> (or 2-colourable) if its vertices can be partitioned into two
          independent sets <code className="text-indigo-300">Set A</code> and{' '}
          <code className="text-emerald-300">Set B</code> such that every edge connects a vertex in A to a vertex in B.
        </p>
      </div>

      {/* Main Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          data.isBipartite
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {data.isBipartite ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white">
              {data.isBipartite ? 'Graph is BIPARTITE (2-Colourable)' : 'Graph is NOT Bipartite'}
            </h3>
            <span className="text-xs text-slate-300 leading-relaxed">
              {output.explanation}
            </span>
          </div>
        </div>
      </div>

      {/* Kőnig's Theorem Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex flex-col gap-1.5">
        <span className="font-semibold text-white">Kőnig&apos;s Theorem (1936):</span>
        <p className="text-slate-300 leading-relaxed">
          A graph is bipartite if and only if it contains <strong>NO odd cycle</strong>.
          {data.isBipartite
            ? ' No odd cycles exist in this graph, confirming bipartiteness.'
            : ' An odd cycle was detected and highlighted on the canvas.'}
        </p>
      </div>

      {/* Partition Sets if Bipartite */}
      {data.isBipartite ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2-Colourable Partitions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Set A */}
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                  <span>Partition Set A</span>
                </span>
                <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-950">
                  |A| = {data.partitionA.length}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-300 break-words bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                {data.partitionA.length > 0
                  ? '{ ' + data.partitionA.map((id) => vertexLabelMap.get(id) || id).join(', ') + ' }'
                  : 'Empty'}
              </div>
            </div>

            {/* Set B */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span>Partition Set B</span>
                </span>
                <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-950">
                  |B| = {data.partitionB.length}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-300 break-words bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                {data.partitionB.length > 0
                  ? '{ ' + data.partitionB.map((id) => vertexLabelMap.get(id) || id).join(', ') + ' }'
                  : 'Empty'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Odd Cycle Witness Card */
        data.oddCycle && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-col gap-2">
            <span className="font-bold text-sm text-rose-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Odd Cycle Witness (Length {data.oddCycle.length - 1}):</span>
            </span>
            <div className="font-mono text-xs font-bold text-rose-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {data.oddCycle.map((id) => vertexLabelMap.get(id) || id).join(' → ')}
            </div>
            <p className="text-[11px] text-slate-400">
              Since an odd cycle cannot be 2-coloured without two adjacent vertices sharing the same colour, the entire graph is not bipartite.
            </p>
          </div>
        )
      )}
    </div>
  );
}
