'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeGraphProperties } from '@/lib/graph-theory/graph-model';
import { CheckCircle2, Hash, Info } from 'lucide-react';

export function PropertiesPanel() {
  const { graph } = useGraphLab();
  const props = useMemo(() => computeGraphProperties(graph), [graph]);

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Order |V|
          </span>
          <span className="text-2xl font-bold text-white font-mono">{props.order}</span>
          <span className="text-[11px] text-slate-500">Number of vertices</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Size |E|
          </span>
          <span className="text-2xl font-bold text-white font-mono">{props.size}</span>
          <span className="text-[11px] text-slate-500">Number of edges</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Sum of Degrees
          </span>
          <span className="text-2xl font-bold text-indigo-400 font-mono">
            {props.sumOfDegrees}
          </span>
          <span className="text-[11px] text-slate-500">
            {graph.isDirected ? 'Σ(in + out)' : 'Σ deg(v)'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Type
          </span>
          <span className="text-lg font-bold text-emerald-400">
            {graph.isDirected ? 'Directed' : 'Undirected'}
          </span>
          <span className="text-[11px] text-slate-500">
            {graph.edges.length === 0 ? 'Null/Empty Edges' : 'Simple Graph'}
          </span>
        </div>
      </div>

      {/* Handshake Lemma Section */}
      <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>The Handshaking Lemma (Euler)</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
            Satisfied
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {graph.isDirected ? (
            <>
              In any directed graph, the sum of all in-degrees equals the sum of all
              out-degrees, which both equal the total number of edges:
              <br />
              <code className="text-indigo-300 font-mono font-bold block mt-1.5 p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                {props.handshakeFormula}
              </code>
            </>
          ) : (
            <>
              In every finite undirected graph, the sum of the degrees of all vertices
              equals twice the number of edges:
              <br />
              <code className="text-indigo-300 font-mono font-bold block mt-1.5 p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                {props.handshakeFormula}
              </code>
            </>
          )}
        </p>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>Corollary: An undirected graph always has an even number of vertices with odd degrees.</span>
        </div>
      </div>

      {/* Vertex Degrees Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Vertex Degrees
          </h3>
        </div>

        {graph.vertices.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 glass-panel rounded-xl">
            No vertices present. Add vertices to see degree distribution.
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase">
                  <th className="p-3">Vertex</th>
                  {graph.isDirected ? (
                    <>
                      <th className="p-3">In-Degree (deg⁻)</th>
                      <th className="p-3">Out-Degree (deg⁺)</th>
                      <th className="p-3">Total Degree</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3">Degree deg(v)</th>
                      <th className="p-3">Parity</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {graph.vertices.map((v) => {
                  const deg = props.degrees[v.id] || 0;
                  const inDeg = props.inDegrees[v.id] || 0;
                  const outDeg = props.outDegrees[v.id] || 0;
                  const isOdd = deg % 2 !== 0;

                  return (
                    <tr key={v.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span>{v.label}</span>
                      </td>
                      {graph.isDirected ? (
                        <>
                          <td className="p-3 text-indigo-300 font-bold">{inDeg}</td>
                          <td className="p-3 text-emerald-300 font-bold">{outDeg}</td>
                          <td className="p-3 text-slate-200">{deg}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-indigo-300 font-bold">{deg}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isOdd
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {isOdd ? 'Odd' : 'Even'}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
