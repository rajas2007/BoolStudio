'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { findHamiltonianPathsAndCycles } from '@/lib/graph-theory/hamiltonian';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export function HamiltonianPanel() {
  const { graph } = useGraphLab();
  const result = useMemo(() => findHamiltonianPathsAndCycles(graph), [graph]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  return (
    <div className="flex flex-col gap-6">
      {/* Exceeds limit warning if n > 10 */}
      {result.exceedsLimit && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">Order Exceeds Backtracking Limit (|V| &gt; 10):</span>
            <p className="text-slate-300 leading-relaxed">{result.explanation}</p>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {!result.exceedsLimit && (
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
            result.hasCycle
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : result.hasPath
              ? 'bg-indigo-950/20 border-indigo-500/30'
              : 'bg-rose-950/20 border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.hasCycle ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : result.hasPath ? (
              <CheckCircle2 className="w-6 h-6 text-indigo-400" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400" />
            )}

            <div className="flex flex-col">
              <h3 className="text-base font-bold text-white">
                {result.hasCycle
                  ? 'Hamiltonian Cycle & Path Detected'
                  : result.hasPath
                  ? 'Hamiltonian Path Detected (No Cycle)'
                  : 'No Hamiltonian Path or Cycle'}
              </h3>
              <span className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {result.explanation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                result.hasCycle
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : result.hasPath
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {result.hasCycle
                ? '✓ Cycle Found'
                : result.hasPath
                ? '✓ Path Found'
                : '✕ Not Hamiltonian'}
            </span>
          </div>
        </div>
      )}

      {/* Discovered Path or Cycle Sequence */}
      {!result.exceedsLimit && (result.hasCycle || result.hasPath) && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              {result.hasCycle ? 'Discovered Hamiltonian Cycle:' : 'Discovered Hamiltonian Path:'}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Highlighted on canvas in emerald
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            {(result.hasCycle ? result.cycle : result.path).map((vId, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2.5 py-1 rounded-lg font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                  {vertexLabelMap.get(vId) || vId}
                </span>
                {idx < (result.hasCycle ? result.cycle.length : result.path.length) - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Educational Contrast: Euler vs. Hamiltonian */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-xs text-slate-300 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 font-bold text-white text-sm">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Euler vs. Hamiltonian: The Contrast in Complexity</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
            <strong className="text-emerald-300 text-xs">Eulerian Paths (Edge-Visiting)</strong>
            <p className="text-slate-400">
              Visits every <strong>edge</strong> exactly once. Solved by Leonhard Euler in 1736 with
              an elegant necessary and sufficient condition: a connected graph has an Euler circuit
              if and only if all vertex degrees are even. Solvable in linear polynomial time{' '}
              <code className="text-emerald-300 font-mono">O(|E|)</code>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
            <strong className="text-indigo-300 text-xs">Hamiltonian Paths (Vertex-Visiting)</strong>
            <p className="text-slate-400">
              Visits every <strong>vertex</strong> exactly once. Despite the surface similarity, there is{' '}
              <strong>no simple necessary and sufficient criterion</strong> known in mathematics. Determining
              whether an arbitrary graph contains a Hamiltonian cycle is <strong>NP-complete</strong> (Karp, 1972).
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <strong>Convention:</strong> In simple graphs, a Hamiltonian cycle requires at least 3 vertices (n ≥ 3). A single vertex or an edge possesses a Hamiltonian path, but no Hamiltonian cycle.
        </div>
        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <strong>Sufficient Theorems:</strong> Dirac&apos;s Theorem (1952) guarantees a Hamiltonian cycle if every
          vertex has degree ≥ n/2. Ore&apos;s Theorem (1960) guarantees one if deg(u) + deg(v) ≥ n for every non-adjacent pair.
          However, graphs like the Petersen graph satisfy neither yet remain important case studies.
        </div>
      </div>
    </div>
  );
}
