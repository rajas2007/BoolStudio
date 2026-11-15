'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { evaluatePlanarBound } from '@/lib/graph-theory/planar-bound';
import {
  CheckCircle2,
  XCircle,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';

export function PlanarPanel() {
  const { graph } = useGraphLab();
  const result = useMemo(() => evaluatePlanarBound(graph), [graph]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Status */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
          result.status === 'VIOLATES'
            ? 'bg-rose-950/20 border-rose-500/30'
            : result.status === 'SATISFIES'
            ? 'bg-indigo-950/20 border-indigo-500/30'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          {result.status === 'VIOLATES' ? (
            <XCircle className="w-6 h-6 text-rose-400" />
          ) : result.status === 'SATISFIES' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <Layers className="w-6 h-6 text-slate-400" />
          )}

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white">
              {result.status === 'VIOLATES'
                ? 'VIOLATES Planar Edge Bound (Definitely Non-Planar)'
                : result.status === 'SATISFIES'
                ? 'SATISFIES Edge Bounds (Necessary Condition Only)'
                : 'Trivially Planar (|V| < 3)'}
            </h3>
            <span className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {result.explanation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.status === 'VIOLATES'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {result.status === 'VIOLATES'
              ? '✕ Definitely Non-Planar'
              : '✓ Bound Satisfied'}
          </span>
        </div>
      </div>

      {/* Inequality Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* General Bound Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2 ${
            result.violatesGeneral
              ? 'bg-rose-950/20 border-rose-500/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300">
              General Planar Bound
            </span>
            <span
              className={`text-xs font-bold ${
                result.violatesGeneral ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {result.violatesGeneral ? '✕ Violates' : '✓ Satisfies'}
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <span>|E| = {result.size}</span>
            <span className="text-slate-500">vs</span>
            <span className="text-indigo-300">3|V| - 6 = {result.generalBound}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            For simple planar graphs with |V| ≥ 3, every face has boundary length ≥ 3,
            yielding the upper bound: <code>e ≤ 3v - 6</code>.
          </span>
        </div>

        {/* Bipartite Bound Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2 ${
            result.violatesBipartite
              ? 'bg-rose-950/20 border-rose-500/30'
              : !result.isBipartite
              ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300">
              Bipartite Planar Bound
            </span>
            {result.isBipartite ? (
              <span
                className={`text-xs font-bold ${
                  result.violatesBipartite ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {result.violatesBipartite ? '✕ Violates' : '✓ Satisfies'}
              </span>
            ) : (
              <span className="text-xs text-slate-500">N/A (Not Bipartite)</span>
            )}
          </div>
          <div className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <span>|E| = {result.size}</span>
            <span className="text-slate-500">vs</span>
            <span className="text-emerald-300">2|V| - 4 = {result.bipartiteBound}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Bipartite graphs have no odd cycles, meaning all faces have length ≥ 4,
            yielding the tighter bound: <code>e ≤ 2v - 4</code>.
          </span>
        </div>
      </div>

      {/* Critical Note on Bound Sufficiency */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <strong className="text-amber-300">Crucial Educational Note: The Bound Is Only Necessary</strong>
          <p className="text-slate-300 leading-relaxed">
            Satisfying <code>e ≤ 3v - 6</code> does <strong>NOT</strong> prove that a graph is planar!
            For example, the <strong>Petersen Graph</strong> has |V| = 10, |E| = 15. It satisfies the bound
            easily (15 ≤ 3(10) - 6 = 24), yet it is <em>famously non-planar</em> (by Kuratowski&apos;s Theorem,
            it contains a subgraph homeomorphic to K_{'{3,3}'}). The bound can only prove non-planarity when violated.
          </p>
        </div>
      </div>

      {/* Euler's Formula Reference */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Euler&apos;s Polyhedral Formula (1758):</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          {result.eulersFormulaNote}
        </p>
        <p className="text-[11px] text-slate-400">
          <strong>Kuratowski&apos;s Theorem (1930):</strong> A finite graph is planar if and only if
          it does not contain a subgraph that is a subdivision of K_5 or K_{'{3,3}'}.
        </p>
      </div>
    </div>
  );
}
