'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { analyzeWalk } from '@/lib/graph-theory/walks-cycles';
import {
  Footprints,
  RotateCcw,
  Delete,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export function WalkPanel() {
  const {
    graph,
    walkVertexSequence,
    walkError,
    addWalkStep,
    popWalkStep,
    resetWalk,
  } = useGraphLab();

  const analysis = useMemo(
    () => analyzeWalk(graph, walkVertexSequence),
    [graph, walkVertexSequence]
  );

  const vertexLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    graph.vertices.forEach((v) => map.set(v.id, v.label));
    return map;
  }, [graph.vertices]);

  return (
    <div className="flex flex-col gap-6">
      {/* Walk Builder Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Footprints className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Walk, Trail, Path & Cycle Explorer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={popWalkStep}
            disabled={walkVertexSequence.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Step Back</span>
          </button>
          <button
            onClick={resetWalk}
            disabled={walkVertexSequence.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Walk</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Click vertices on the canvas (or the vertex buttons below) to extend your
        traversal step by step. BoolStudio validates every step and classifies the
        sequence live.
      </p>

      {/* Vertex Click Shortcuts */}
      <div className="flex items-center gap-2 flex-wrap p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <span className="text-xs text-slate-400 font-semibold mr-1">
          Click Vertex to Step:
        </span>
        {graph.vertices.map((v) => (
          <button
            key={v.id}
            onClick={() => addWalkStep(v.id)}
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 text-slate-200 transition-all"
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Illegal Step Error Notification */}
      {walkError && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Illegal Step Rejected:</strong> {walkError}
          </span>
        </div>
      )}

      {/* Current Walk Sequence Display */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Active Sequence ({walkVertexSequence.length} vertices, length {analysis.length}):</span>
          <span className="font-mono text-[11px] text-slate-500">
            {analysis.isClosed ? 'Closed (v_start = v_end)' : 'Open (v_start ≠ v_end)'}
          </span>
        </div>

        {walkVertexSequence.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2">
            No vertices chosen. Click any vertex to start your walk.
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-sm py-1">
            {walkVertexSequence.map((vId, idx) => {
              const label = vertexLabelMap.get(vId) || vId;
              const isFirst = idx === 0;
              const isLast = idx === walkVertexSequence.length - 1;

              return (
                <React.Fragment key={idx}>
                  <div
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 shadow-sm ${
                      isFirst && isLast
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                        : isFirst
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                        : isLast
                        ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40'
                        : 'bg-amber-600/20 text-amber-200 border border-amber-500/30'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      #{idx + 1}
                    </span>
                  </div>
                  {idx < walkVertexSequence.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Classification Result Card */}
      {analysis.isValid && (
        <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 bg-indigo-950/20 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Classification:
              </span>
              <span className="text-lg font-extrabold text-white px-3 py-0.5 rounded-full bg-indigo-600/30 border border-indigo-500/40">
                {analysis.classification}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                Length: {analysis.length}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-mono ${
                  analysis.isClosed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {analysis.isClosed ? 'Closed' : 'Open'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.explanation}
          </p>

          {/* Hierarchy Breakdown Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Walk:</span>
              <span className="text-emerald-400 font-bold">✓ Yes</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Trail (Edges unique):</span>
              <span
                className={
                  analysis.isTrail ? 'text-emerald-400 font-bold' : 'text-slate-500'
                }
              >
                {analysis.isTrail ? '✓ Yes' : '✕ No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Path (Verts unique):</span>
              <span
                className={
                  analysis.isPath ? 'text-emerald-400 font-bold' : 'text-slate-500'
                }
              >
                {analysis.isPath ? '✓ Yes' : '✕ No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Cycle / Circuit:</span>
              <span
                className={
                  analysis.isCycle || analysis.isCircuit
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-500'
                }
              >
                {analysis.isCycle ? '✓ Cycle' : analysis.isCircuit ? '✓ Circuit' : '✕ No'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Educational Definitions Reference */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Discrete Mathematics Definitions (Unit 6):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
          <div>
            <strong className="text-slate-300">Walk:</strong> Any alternating sequence
            of vertices and edges.
          </div>
          <div>
            <strong className="text-slate-300">Trail:</strong> A walk with{' '}
            <em>no repeated edges</em>.
          </div>
          <div>
            <strong className="text-slate-300">Path:</strong> An open walk with{' '}
            <em>no repeated vertices</em>.
          </div>
          <div>
            <strong className="text-slate-300">Circuit:</strong> A closed trail (starts
            and ends at same vertex, all edges distinct).
          </div>
          <div>
            <strong className="text-slate-300">Cycle:</strong> A closed path (starts and
            ends at same vertex, length ≥ 3, distinct intermediate vertices).
          </div>
        </div>
      </div>
    </div>
  );
}
