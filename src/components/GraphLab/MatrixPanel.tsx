'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import {
  buildAdjacencyMatrix,
  buildIncidenceMatrix,
} from '@/lib/graph-theory/matrix-builders';
import { Table, Grid, Info, Sparkles } from 'lucide-react';

export function MatrixPanel() {
  const { graph, setHoveredElement } = useGraphLab();

  const adj = useMemo(() => buildAdjacencyMatrix(graph), [graph]);
  const inc = useMemo(() => buildIncidenceMatrix(graph), [graph]);

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Adjacency Matrix Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Adjacency Matrix A (Order {adj.vertices.length} × {adj.vertices.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {graph.isDirected ? (
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                A[i, j] = 1 if (v_i → v_j) exists
              </span>
            ) : (
              <span
                className={`px-2.5 py-1 rounded-full border text-xs font-medium ${
                  adj.isSymmetric
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {adj.isSymmetric ? 'Symmetric (A = Aᵀ)' : 'Asymmetric'}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Hover over any row, column, or cell to highlight the corresponding vertex
          or edge on the canvas.
        </p>

        {adj.vertices.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 glass-panel rounded-xl">
            Graph has no vertices. Add vertices to generate the adjacency matrix.
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-lg">
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-3 text-left font-bold text-white bg-slate-900/90 border-r border-slate-800 w-20">
                    v \ v
                  </th>
                  {adj.vertices.map((vLabel, colIdx) => (
                    <th
                      key={colIdx}
                      className="p-3 min-w-10 hover:bg-indigo-900/40 cursor-pointer text-indigo-300 font-bold transition-colors"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'vertex',
                          id: graph.vertices[colIdx]?.id || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {vLabel}
                    </th>
                  ))}
                  <th className="p-3 bg-slate-900/90 text-amber-300 font-bold border-l border-slate-800">
                    Row Sum {graph.isDirected ? '(out-deg)' : '(deg)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {adj.matrix.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    <td
                      className="p-3 text-left font-bold text-indigo-300 bg-slate-900/50 border-r border-slate-800 cursor-pointer hover:bg-indigo-900/40"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'vertex',
                          id: graph.vertices[rowIdx]?.id || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {adj.vertices[rowIdx]}
                    </td>
                    {row.map((val, colIdx) => {
                      const isConnected = val > 0;
                      return (
                        <td
                          key={colIdx}
                          className={`p-3 transition-colors ${
                            rowIdx === colIdx
                              ? 'bg-slate-900/20 text-slate-500'
                              : isConnected
                              ? 'text-emerald-400 font-bold bg-emerald-500/5'
                              : 'text-slate-600'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                    <td className="p-3 text-amber-300 font-bold border-l border-slate-800 bg-slate-900/30">
                      {adj.rowSums[rowIdx]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Adjacency Matrix Properties Note */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-white">Mathematical Properties:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              <li>
                <strong>Main Diagonal:</strong> All entries A[i, i] = 0 since self-loops
                are disallowed in simple graphs.
              </li>
              <li>
                <strong>Row Sums:</strong> In an undirected graph, the sum of row i equals
                the degree deg(v_i). In a directed graph, row sum i = out-deg(v_i), and
                column sum j = in-deg(v_j).
              </li>
              <li>
                <strong>Symmetry:</strong> A is symmetric (A = Aᵀ) if and only if the
                graph is undirected.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Incidence Matrix Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Incidence Matrix M (|V| = {inc.vertices.length} × |E| = {inc.edges.length})
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
            {graph.isDirected
              ? 'Directed: Tail = -1, Head = +1'
              : 'Undirected: Incident = 1, Non-incident = 0'}
          </span>
        </div>

        {inc.edges.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 glass-panel rounded-xl">
            Graph has no edges. Add edges to generate the incidence matrix.
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-lg">
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-3 text-left font-bold text-white bg-slate-900/90 border-r border-slate-800 w-20">
                    Vertex \ Edge
                  </th>
                  {inc.edges.map((eLabel, colIdx) => (
                    <th
                      key={colIdx}
                      className="p-3 min-w-10 hover:bg-emerald-900/40 cursor-pointer text-emerald-300 font-bold transition-colors"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'edge',
                          id: inc.edgeIds[colIdx] || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {eLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {inc.matrix.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    <td
                      className="p-3 text-left font-bold text-indigo-300 bg-slate-900/50 border-r border-slate-800 cursor-pointer hover:bg-indigo-900/40"
                      onMouseEnter={() =>
                        setHoveredElement({
                          type: 'vertex',
                          id: graph.vertices[rowIdx]?.id || '',
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {inc.vertices[rowIdx]}
                    </td>
                    {row.map((val, colIdx) => {
                      let textColor = 'text-slate-600';
                      if (val === 1) textColor = 'text-emerald-400 font-bold';
                      else if (val === -1) textColor = 'text-rose-400 font-bold';

                      return (
                        <td
                          key={colIdx}
                          className={`p-3 transition-colors ${textColor} hover:bg-slate-800/50 cursor-pointer`}
                          onMouseEnter={() =>
                            setHoveredElement({
                              type: 'edge',
                              id: inc.edgeIds[colIdx] || '',
                            })
                          }
                          onMouseLeave={() => setHoveredElement(null)}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Column Sums Row */}
                <tr className="bg-slate-900 border-t-2 border-slate-800 font-bold text-amber-300">
                  <td className="p-3 text-left text-amber-300 border-r border-slate-800 bg-slate-900/90">
                    Column Sum
                  </td>
                  {inc.columnSums.map((sum, colIdx) => (
                    <td key={colIdx} className="p-3">
                      {sum}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Incidence Matrix Properties Note */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-white">Incidence Column Sum Theorem:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5">
              <li>
                <strong>Undirected Graph:</strong> Every column corresponds to an edge with
                two endpoints, so every column has exactly two 1s and its sum is{' '}
                <code className="text-emerald-300">Σ = 2</code>.
              </li>
              <li>
                <strong>Directed Graph:</strong> Every directed edge has one tail (-1) and
                one head (+1), so every column sum is{' '}
                <code className="text-emerald-300">Σ = -1 + 1 = 0</code>.
              </li>
              <li>
                <strong>Row Sums:</strong> In an undirected graph, the sum of row i equals
                the degree deg(v_i).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
