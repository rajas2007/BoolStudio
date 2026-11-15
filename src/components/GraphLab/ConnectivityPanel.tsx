'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeConnectedComponents } from '@/lib/graph-theory/connectivity';
import { Layers, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const COMPONENT_COLORS = [
  { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/40', dot: 'bg-indigo-500' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40', dot: 'bg-amber-500' },
  { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/40', dot: 'bg-pink-500' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40', dot: 'bg-cyan-500' },
  { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40', dot: 'bg-purple-500' },
];

export function ConnectivityPanel() {
  const { graph } = useGraphLab();
  const result = useMemo(() => computeConnectedComponents(graph), [graph]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  const isConnected = result.count === 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
          isConnected
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : result.count === 0
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-amber-950/20 border-amber-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {isConnected ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : result.count === 0 ? (
            <Layers className="w-6 h-6 text-slate-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-400" />
          )}

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white">
              {result.count === 0
                ? 'Empty Graph'
                : isConnected
                ? graph.isDirected
                  ? 'Weakly Connected Graph'
                  : 'Connected Graph'
                : 'Disconnected Graph'}
            </h3>
            <span className="text-xs text-slate-400">
              {result.count === 0
                ? 'No vertices exist.'
                : isConnected
                ? 'There is a path between every pair of vertices.'
                : `Graph consists of ${result.count} separate connected components.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400">Total Components:</span>
          <span className="text-xl font-bold font-mono text-white px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
            {result.count}
          </span>
        </div>
      </div>

      {/* Component Cards Listing */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Connected Components Breakdown:
        </h4>

        {result.components.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 glass-panel rounded-xl">
            No components to display. Add vertices to see connected subsets.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.components.map((comp, idx) => {
              const color = COMPONENT_COLORS[idx % COMPONENT_COLORS.length];
              const labels = comp.map((id) => vertexLabelMap.get(id) || id);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 ${color.bg} ${color.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${color.dot}`} />
                      <span className={`text-sm font-bold ${color.text}`}>
                        Component #{idx + 1}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-300">
                      {comp.length} {comp.length === 1 ? 'vertex' : 'vertices'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {labels.map((lbl, lIdx) => (
                      <span
                        key={lIdx}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-950/70 text-white border border-slate-700/80"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Directed Graph Note */}
      {graph.isDirected && (
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <span>
            <strong>Note on Directed Graphs:</strong> BoolStudio computes{' '}
            <em>weakly connected components</em> by replacing all directed arcs with
            undirected edges. A directed graph is strongly connected only if every vertex is
            reachable from every other vertex following directed arc orientations.
          </span>
        </div>
      )}
    </div>
  );
}
