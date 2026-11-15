'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeRepresentations } from '@/lib/graph-theory/matrix-builders';
import { Table, Grid, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export function RepresentationsPanel() {
  const {
    graph,
    powerK,
    setPowerK,
    setHoveredElement,
    setActiveHighlight,
    loadPreset,
  } = useGraphLab();

  const output = useMemo(
    () => computeRepresentations(graph, powerK),
    [graph, powerK]
  );
  const data = output.result;

  useEffect(() => {
    setActiveHighlight(null);
  }, [setActiveHighlight]);

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header & Quick Definition */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 1
          </span>
          <button
            type="button"
            onClick={() => loadPreset('k_n', 4)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Try Example (K₄)</span>
          </button>
        </div>
        <h2 className="text-lg font-bold text-white">Representations &amp; Properties</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Graphs can be represented symbolically via an Adjacency List, algebraic incidence via Matrix{' '}
          <code className="text-indigo-300">A</code>, or vertex-edge incidence via Matrix{' '}
          <code className="text-emerald-300">M</code>.
        </p>
      </div>

      {/* Handshaking Lemma Card */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>The Handshaking Lemma</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
            Theorem Verified
          </span>
        </div>
        <div className="font-mono text-xs font-semibold text-white bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          {data.handshake.formula}
        </div>
        <p className="text-xs text-slate-300">
          {graph.isDirected
            ? 'In any directed graph, the sum of all in-degrees equals the sum of all out-degrees, which equals |E|.'
            : 'In every finite undirected graph, the sum of all vertex degrees equals twice the number of edges: Σ deg(v) = 2|E|.'}
        </p>
      </div>

      {/* 1. Adjacency Matrix */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Adjacency Matrix A ({data.order} × {data.order})
            </h3>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${
              data.adjacencyMatrix.isSymmetric
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
          >
            {graph.isDirected
              ? 'Directed Matrix'
              : data.adjacencyMatrix.isSymmetric
              ? 'Symmetric (A = Aᵀ)'
              : 'Asymmetric'}
          </span>
        </div>

        {data.order === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            Graph has no vertices.
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-2.5 text-left font-bold text-white border-r border-slate-800 w-16">
                    v \ v
                  </th>
                  {data.adjacencyMatrix.labels.map((lbl, idx) => (
                    <th
                      key={idx}
                      className="p-2.5 min-w-8 text-indigo-300 hover:bg-indigo-900/40 cursor-pointer font-bold"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'vertex',
                          id: graph.vertices[idx]?.id || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {lbl}
                    </th>
                  ))}
                  <th className="p-2.5 bg-slate-900/90 text-amber-300 font-bold border-l border-slate-800">
                    Row Sum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.adjacencyMatrix.matrix.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/50">
                    <td
                      className="p-2.5 text-left font-bold text-indigo-300 bg-slate-900/50 border-r border-slate-800 cursor-pointer hover:bg-indigo-900/40"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'vertex',
                          id: graph.vertices[rIdx]?.id || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {data.adjacencyMatrix.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-2.5 ${
                          rIdx === cIdx
                            ? 'text-slate-600'
                            : val > 0
                            ? 'text-emerald-400 font-bold bg-emerald-500/5'
                            : 'text-slate-500'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                    <td className="p-2.5 text-amber-300 font-bold border-l border-slate-800 bg-slate-900/30">
                      {data.adjacencyMatrix.rowSums[rIdx]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Walk Counter A^k */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Walk Counter Matrix A^{powerK}
            </h3>
          </div>
          {/* Power k selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Power k:</span>
            {[1, 2, 3, 4, 5].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPowerK(k)}
                className={`w-6 h-6 rounded-md font-mono font-bold text-xs transition-colors ${
                  powerK === k
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Theorem: Entry <code className="text-amber-300">(A^{powerK})[i, j]</code> equals the exact
          number of distinct walks of length {powerK} connecting vertex v_i to v_j.
        </p>

        {data.order > 0 && (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-2 text-left font-bold text-white border-r border-slate-800 w-16">
                    v \ v
                  </th>
                  {data.adjacencyMatrix.labels.map((lbl, idx) => (
                    <th key={idx} className="p-2 min-w-8 text-amber-300 font-bold">
                      {lbl}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.walkMatrixPowerK.matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-2 text-left font-bold text-amber-300 bg-slate-900/50 border-r border-slate-800">
                      {data.adjacencyMatrix.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-2 ${
                          val > 0 ? 'text-amber-300 font-bold bg-amber-500/5' : 'text-slate-600'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Incidence Matrix */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Incidence Matrix M ({data.order} × {data.size})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {graph.isDirected ? 'Tail = +1, Head = -1' : 'Incident = 1'}
          </span>
        </div>

        {data.size === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            Graph has no edges.
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-2.5 text-left font-bold text-white border-r border-slate-800 w-16">
                    v \ e
                  </th>
                  {data.incidenceMatrix.edgeLabels.map((lbl, idx) => (
                    <th
                      key={idx}
                      className="p-2.5 min-w-8 text-emerald-300 hover:bg-emerald-900/40 cursor-pointer font-bold"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'edge',
                          id: data.incidenceMatrix.edgeIds[idx] || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {lbl}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.incidenceMatrix.matrix.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/50">
                    <td className="p-2.5 text-left font-bold text-indigo-300 bg-slate-900/50 border-r border-slate-800">
                      {data.incidenceMatrix.vertexLabels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-2.5 ${
                          val === 1
                            ? 'text-emerald-400 font-bold'
                            : val === -1
                            ? 'text-rose-400 font-bold'
                            : 'text-slate-600'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Column Sums */}
                <tr className="bg-slate-900 border-t-2 border-slate-800 font-bold text-amber-300">
                  <td className="p-2.5 text-left text-amber-300 border-r border-slate-800 bg-slate-900/90">
                    Col Sum
                  </td>
                  {data.incidenceMatrix.colSums.map((sum, cIdx) => (
                    <td key={cIdx} className="p-2.5">
                      {sum}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Adjacency List */}
      <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Adjacency List
        </h3>
        <div className="font-mono text-xs flex flex-col gap-1 text-slate-300">
          {Object.entries(data.adjacencyList).map(([v, neighbors]) => (
            <div key={v} className="flex items-center gap-2">
              <span className="font-bold text-indigo-400 w-8">{v} →</span>
              <span>[{neighbors.join(', ') || 'Ø'}]</span>
            </div>
          ))}
          {Object.keys(data.adjacencyList).length === 0 && (
            <span className="text-slate-500 italic">No vertices</span>
          )}
        </div>
      </div>
    </div>
  );
}
