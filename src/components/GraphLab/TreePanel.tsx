'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { analyzeTreeProperties } from '@/lib/graph-theory/tree';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  TreeDeciduous,
  Leaf,
} from 'lucide-react';

export function TreePanel() {
  const { graph, setActiveHighlight, loadPreset } = useGraphLab();
  const [showSpanningTree, setShowSpanningTree] = useState(false);

  const output = useMemo(() => analyzeTreeProperties(graph), [graph]);
  const data = output.result;

  // Sync canvas highlight
  useEffect(() => {
    if (showSpanningTree && data.spanningTreeEdges && data.spanningTreeEdges.length > 0) {
      setActiveHighlight({
        vertices: graph.vertices.map((v) => v.id),
        edges: data.spanningTreeEdges,
      });
    } else {
      setActiveHighlight(output.highlight);
    }
  }, [showSpanningTree, data.spanningTreeEdges, output.highlight, graph.vertices, setActiveHighlight]);

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
            Syllabus Unit 6 • Topic 5
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setShowSpanningTree(false);
                loadPreset('tree');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Try Tree Preset</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSpanningTree(false);
                loadPreset('path');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Path (P₅)</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Trees &amp; Spanning Trees</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          A <strong>Tree</strong> is an undirected graph that is connected and acyclic.
          Fundamental theorem: Any two conditions from {'{Connected, Acyclic, |E| = |V| - 1}'} imply the third.
        </p>
      </div>

      {/* Main Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          data.isTree
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {data.isTree ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white">
              {data.isTree ? 'Confirmed: Graph is a Tree' : 'Graph is NOT a Tree'}
            </h3>
            <span className="text-xs text-slate-300 leading-relaxed">
              {output.explanation}
            </span>
          </div>
        </div>
      </div>

      {/* The Triad Conditions */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          The Tree Triad Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Connected */}
          <div
            className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
              data.isConnected
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">1. Connected</span>
              {data.isConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {data.isConnected ? 'Single component' : 'Multiple components'}
            </span>
          </div>

          {/* 2. Acyclic */}
          <div
            className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
              data.isAcyclic
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">2. Acyclic</span>
              {data.isAcyclic ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {data.isAcyclic ? 'No cycles found' : 'Cycle witness detected'}
            </span>
          </div>

          {/* 3. |E| = |V| - 1 */}
          <div
            className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
              data.satisfiesSizeCondition
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">3. |E| = |V| - 1</span>
              {data.satisfiesSizeCondition ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              |E|={data.size}, |V|-1={Math.max(0, data.order - 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Cycle Witness Banner if Cyclic */}
      {!data.isAcyclic && data.cycleWitness && (
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs flex flex-col gap-1.5">
          <span className="font-semibold text-rose-300">Cycle Failure Witness:</span>
          <p className="text-slate-300">
            A tree cannot contain cycles. Found cycle highlighted on canvas:
          </p>
          <div className="font-mono text-xs font-bold text-rose-300 bg-slate-950 p-2 rounded border border-slate-800">
            {data.cycleWitness.map((id) => vertexLabelMap.get(id) || id).join(' → ')}
          </div>
        </div>
      )}

      {/* Leaves & Degree Sequence */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Leaf className="w-3.5 h-3.5" />
            <span>Leaves (deg = 1):</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">{data.leaves.length}</span>
          <span className="text-[11px] text-slate-400">
            {data.leaves.length > 0
              ? data.leaves.map((id) => vertexLabelMap.get(id) || id).join(', ')
              : 'None'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1">
          <span className="text-slate-400 font-semibold">Degree Sequence:</span>
          <span className="text-sm font-mono font-bold text-indigo-300 mt-1">
            [{data.degreeSequence.join(', ') || 'Ø'}]
          </span>
          <span className="text-[11px] text-slate-500">Sorted descending</span>
        </div>
      </div>

      {/* Spanning Tree Generator */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">BFS Spanning Tree</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowSpanningTree(!showSpanningTree)}
            disabled={!data.isConnected || data.order === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showSpanningTree
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 disabled:opacity-40'
            }`}
          >
            {showSpanningTree ? 'Hide Spanning Tree' : 'Generate Spanning Tree'}
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Every connected graph G contains at least one spanning tree T containing all |V| vertices
          and exactly |V| - 1 edges.
        </p>

        {showSpanningTree && data.spanningTreeEdges && (
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
            Highlighted {data.spanningTreeEdges.length} spanning edges on canvas.
          </div>
        )}
      </div>
    </div>
  );
}
