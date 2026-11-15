'use client';

import React, { useState } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { EditorMode, PresetName } from '@/lib/types/graph';
import {
  MousePointer,
  PlusCircle,
  Link as LinkIcon,
  Trash2,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
  Undo2,
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle2,
  Network,
} from 'lucide-react';

export function Toolbar() {
  const {
    graph,
    mode,
    setMode,
    toggleDirectedMode,
    loadPreset,
    clearGraph,
    undo,
    statusMessage,
    edgeStartVertexId,
  } = useGraphLab();

  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [knParam, setKnParam] = useState(4);
  const [kmnParamM, setKmnParamM] = useState(3);
  const [kmnParamN, setKmnParamN] = useState(3);

  const presets: Array<{ id: PresetName; label: string; description: string }> = [
    { id: 'k_n', label: `Complete K_${knParam}`, description: 'Complete graph on n vertices' },
    { id: 'k_mn', label: `Complete Bipartite K_${kmnParamM},${kmnParamN}`, description: 'Complete bipartite partitions' },
    { id: 'cycle', label: 'Cycle C_5', description: '5-vertex odd cycle' },
    { id: 'path', label: 'Path P_5', description: '5-vertex open trail & tree' },
    { id: 'star', label: 'Star K_1,4', description: '1 hub with 4 leaves (violates Hall)' },
    { id: 'tree', label: 'Binary Tree', description: '7-vertex balanced tree' },
    { id: 'petersen', label: 'Petersen Graph', description: '10 vertices, 15 edges (hypohamiltonian)' },
    { id: 'planar', label: 'Planar Wheel W_4', description: 'Wheel graph satisfying planarity' },
    { id: 'non_planar', label: 'Non-Planar K_3,3', description: 'Canonical non-planar bipartite' },
    { id: 'disconnected', label: 'Disconnected (3 Components)', description: 'Triangle, path, & isolated vertex' },
  ];

  return (
    <div className="w-full px-3.5 py-2 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 shadow-xl">
      {/* Left: Studio Title & Mode Selection Buttons */}
      <div className="flex items-center flex-wrap gap-2.5">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Network className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight hidden sm:inline">Graph Lab</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            Unit 6
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('select')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'select'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Select & drag vertices"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Select</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('add-vertex')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'add-vertex'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Click canvas to place a new vertex"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Vertex</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('add-edge')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'add-edge'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Click two vertices in sequence to connect them"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>+ Edge</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('delete')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'delete'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60'
            }`}
            title="Click vertex or edge to delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Center: Graph Stats Badge, Directed Toggle, and Inline Status Toast */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* V and E count badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
          <span>V = <strong className="text-indigo-400 font-bold">{graph.vertices.length}</strong></span>
          <span className="text-slate-700">|</span>
          <span>E = <strong className="text-emerald-400 font-bold">{graph.edges.length}</strong></span>
        </div>

        {/* Undirected / Directed Toggle Button */}
        <button
          type="button"
          onClick={toggleDirectedMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            graph.isDirected
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
          title="Toggle between directed and undirected graph mode"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>{graph.isDirected ? 'Directed' : 'Undirected'}</span>
        </button>

        {/* Inline Status Toast */}
        {(statusMessage || edgeStartVertexId) && (
          <div
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border animate-in fade-in duration-150 ${
              statusMessage?.type === 'error'
                ? 'bg-rose-950/50 text-rose-300 border-rose-800/60'
                : statusMessage?.type === 'success'
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                : 'bg-indigo-950/50 text-indigo-300 border-indigo-800/60'
            }`}
          >
            {statusMessage?.type === 'error' ? (
              <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
            ) : statusMessage?.type === 'success' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-3 h-3 text-indigo-400 shrink-0" />
            )}
            <span className="truncate max-w-[200px] sm:max-w-xs">
              {edgeStartVertexId
                ? `Click target vertex to complete edge`
                : statusMessage?.text}
            </span>
          </div>
        )}
      </div>

      {/* Right: Presets, Undo & Clear */}
      <div className="flex items-center gap-1.5">
        {/* Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPresetMenuOpen(!presetMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Presets</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {presetMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 p-1.5 rounded-xl glass-panel border border-slate-700 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Standard Graph Presets
              </div>

              <div className="max-h-72 overflow-y-auto flex flex-col gap-0.5 p-0.5">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      loadPreset(
                        preset.id,
                        preset.id === 'k_n' ? knParam : preset.id === 'k_mn' ? kmnParamM : undefined,
                        preset.id === 'k_mn' ? kmnParamN : undefined
                      );
                      setPresetMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-800/80 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-bold text-slate-100">{preset.label}</span>
                    <span className="text-[10px] text-slate-400 truncate">{preset.description}</span>
                  </button>
                ))}
              </div>

              {/* Sub-selector for Complete Kn */}
              <div className="p-1.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">K_n size:</span>
                <div className="flex gap-1">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setKnParam(num);
                        loadPreset('k_n', num);
                        setPresetMenuOpen(false);
                      }}
                      className={`w-5 h-5 rounded text-[11px] font-mono font-bold ${
                        knParam === num ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Undo Button */}
        <button
          type="button"
          onClick={undo}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
          title="Undo last action"
        >
          <Undo2 className="w-3 h-3" />
          <span>Undo</span>
        </button>

        {/* Clear Graph Button */}
        <button
          type="button"
          onClick={clearGraph}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 text-xs font-semibold transition-colors"
          title="Clear all vertices and edges"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
