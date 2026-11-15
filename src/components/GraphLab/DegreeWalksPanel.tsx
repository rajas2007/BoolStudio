'use client';

import React, { useMemo, useEffect } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { computeDegreesAndConnectivity } from '@/lib/graph-theory/connectivity';
import { analyzeWalk } from '@/lib/graph-theory/walks-cycles';
import {
  Footprints,
  Layers,
  ArrowRight,
  Hash,
  RotateCcw,
} from 'lucide-react';

export function DegreeWalksPanel() {
  const {
    graph,
    queryStartId,
    queryEndId,
    walkVertexSequence,
    setQueryStartId,
    setQueryEndId,
    addWalkStep,
    popWalkStep,
    resetWalk,
    setActiveHighlight,
    loadPreset,
  } = useGraphLab();

  const connOutput = useMemo(
    () => computeDegreesAndConnectivity(graph, queryStartId || undefined, queryEndId || undefined),
    [graph, queryStartId, queryEndId]
  );
  const connData = connOutput.result;

  const walkOutput = useMemo(
    () => analyzeWalk(graph, walkVertexSequence),
    [graph, walkVertexSequence]
  );
  const walkData = walkOutput.result;

  // Sync canvas highlight: if user is querying a path or building a walk, highlight that, else highlight components
  useEffect(() => {
    if (walkVertexSequence.length > 0) {
      setActiveHighlight(walkOutput.highlight);
    } else if (connOutput.highlight) {
      setActiveHighlight(connOutput.highlight);
    }
  }, [walkVertexSequence, walkOutput.highlight, connOutput.highlight, setActiveHighlight]);

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  return (
    <div className="flex flex-col gap-3 text-slate-200">
      {/* Header & Definition */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Syllabus Unit 6 • Topic 2: Degrees, Walks &amp; Components
          </span>
          <button
            type="button"
            onClick={() => loadPreset('disconnected')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Disconnected</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          {connOutput.explanation}
        </p>
      </div>

      {/* 1. Connected Components Overview */}
      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Connected Components</h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              connData.components.count <= 1
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
          >
            {connData.components.count <= 1
              ? 'Connected (1 Component)'
              : `Disconnected (${connData.components.count} Components)`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {connData.components.groups.map((group, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950/80 text-xs flex items-center gap-2"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    connOutput.highlight.vertexColors?.[group[0]] || '#6366f1',
                }}
              />
              <span className="font-semibold text-white">C{idx + 1}:</span>
              <span className="font-mono text-slate-300">
                {'{ ' + group.map((id) => vertexLabelMap.get(id) || id).join(', ') + ' }'}
              </span>
            </div>
          ))}
        </div>

        {graph.isDirected && connData.components.strongComponents && (
          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span>Strongly Connected Components (Kosaraju/Tarjan):</span>
            <span className="font-bold text-indigo-300 font-mono">
              {connData.components.strongComponents.length}
            </span>
          </div>
        )}
      </div>

      {/* 2. Degree Table with Odd Highlights */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Vertex Degree Table</h3>
          </div>
          <span className="text-xs text-slate-400">
            Odd degrees:{' '}
            <strong className="text-amber-400 font-mono">
              {connData.oddDegreeVertices.length}
            </strong>
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-center font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <th className="p-2.5 text-left text-white border-r border-slate-800">Vertex</th>
                {graph.isDirected ? (
                  <>
                    <th className="p-2.5 text-indigo-300">In-Degree</th>
                    <th className="p-2.5 text-emerald-300">Out-Degree</th>
                    <th className="p-2.5 text-amber-300">Total Degree</th>
                  </>
                ) : (
                  <th className="p-2.5 text-indigo-300">Degree deg(v)</th>
                )}
                <th className="p-2.5 text-slate-400">Parity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {graph.vertices.map((v) => {
                const deg = connData.degrees[v.id] ?? 0;
                const isOdd = deg % 2 !== 0;

                return (
                  <tr key={v.id} className={isOdd ? 'bg-amber-500/5' : ''}>
                    <td className="p-2.5 text-left font-bold text-white border-r border-slate-800">
                      {v.label}
                    </td>
                    {graph.isDirected ? (
                      <>
                        <td className="p-2.5 text-indigo-300">{connData.inDegrees[v.id] ?? 0}</td>
                        <td className="p-2.5 text-emerald-300">{connData.outDegrees[v.id] ?? 0}</td>
                        <td className="p-2.5 text-amber-300 font-bold">{deg}</td>
                      </>
                    ) : (
                      <td className="p-2.5 font-bold text-indigo-300">{deg}</td>
                    )}
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isOdd
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isOdd ? 'Odd' : 'Even'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Shortest Path Query Picker */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <span>BFS Shortest Path Query</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Start Vertex:</label>
            <select
              value={queryStartId || ''}
              onChange={(e) => setQueryStartId(e.target.value || null)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            >
              <option value="">Select source...</option>
              {graph.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Target Vertex:</label>
            <select
              value={queryEndId || ''}
              onChange={(e) => setQueryEndId(e.target.value || null)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            >
              <option value="">Select target...</option>
              {graph.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {connData.queryPath?.shortestPath && connData.queryPath.shortestPath.length > 0 ? (
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs flex flex-col gap-1">
            <span className="font-semibold text-emerald-300">Shortest Path Found:</span>
            <div className="font-mono text-sm font-bold text-white">
              {connData.queryPath.shortestPath.map((id) => vertexLabelMap.get(id) || id).join(' → ')}
            </div>
            <span className="text-[11px] text-slate-400">
              Length (edges): {connData.queryPath.shortestPath.length - 1}
            </span>
          </div>
        ) : queryStartId && queryEndId && queryStartId !== queryEndId ? (
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
            No path exists between {vertexLabelMap.get(queryStartId)} and {vertexLabelMap.get(queryEndId)} (different components).
          </div>
        ) : null}
      </div>

      {/* 4. Interactive Walk / Trail / Path / Circuit / Cycle Sequence */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Sequence Classifier</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={popWalkStep}
              disabled={walkVertexSequence.length === 0}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 transition-colors"
            >
              Undo Step
            </button>
            <button
              type="button"
              onClick={resetWalk}
              disabled={walkVertexSequence.length === 0}
              className="px-2 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/40 disabled:opacity-40 text-xs text-rose-300 border border-rose-800/40 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Vertex Add Buttons */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-400 mr-1">Append vertex:</span>
          {graph.vertices.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => addWalkStep(v.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white font-mono font-bold text-xs transition-colors"
            >
              +{v.label}
            </button>
          ))}
        </div>

        {/* Current Sequence Display */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <span className="text-slate-400 block mb-1">Active Traversal:</span>
          {walkVertexSequence.length === 0 ? (
            <span className="text-slate-600 italic">No vertices selected. Click &quot;+Label&quot; above.</span>
          ) : (
            <div className="font-mono text-sm font-bold text-amber-300 flex items-center flex-wrap gap-1.5">
              {walkVertexSequence.map((id, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <span>{vertexLabelMap.get(id) || id}</span>
                  {idx < walkVertexSequence.length - 1 && <span className="text-slate-500">→</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Classification Result Banner */}
        {walkVertexSequence.length > 0 && (
          <div
            className={`p-3 rounded-lg border text-xs flex flex-col gap-1 ${
              !walkData.isValid
                ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">
                Classification: {walkData.classification}
              </span>
              <span className="text-[11px] font-mono">Length: {walkData.length}</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{walkData.explanation}</p>
          </div>
        )}

        {/* Definitions Reference Card */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">Definitions:</div>
          <div>• <strong>Walk:</strong> Any alternating sequence of vertices and edges.</div>
          <div>• <strong>Trail:</strong> A walk with NO repeated edges.</div>
          <div>• <strong>Path:</strong> A walk with NO repeated vertices (and therefore no repeated edges).</div>
          <div>• <strong>Circuit:</strong> A closed trail (starts and ends at same vertex, no repeated edges).</div>
          <div>• <strong>Cycle:</strong> A closed path of length ≥ 3 (starts and ends at same vertex, no other repeated vertices).</div>
        </div>
      </div>
    </div>
  );
}
