'use client';

import React, { useState } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { PresetName } from '@/lib/types/graph';
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
  const kmnParamM = 3;
  const kmnParamN = 3;

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
    <div className="w-full flex flex-col gap-3">
      {/* Top Toolbar Container */}
      <div className="w-full p-3 rounded-2xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        {/* Left: Mode Selection Buttons */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('select')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'select'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Select & drag vertices"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Select / Move</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('add-vertex')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'add-vertex'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Click canvas to place a new vertex"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Vertex</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('add-edge')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'add-edge'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Click two vertices in sequence to connect them"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add Edge</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('delete')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
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

        {/* Center: Graph Stats Badge & Directed Toggle */}
        <div className="flex items-center gap-2">
          {/* V and E count badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
            <span>
              V = <span className="font-bold text-indigo-400">{graph.vertices.length}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              E = <span className="font-bold text-emerald-400">{graph.edges.length}</span>
            </span>
          </div>

          {/* Undirected / Directed Toggle Button */}
          <button
            type="button"
            onClick={toggleDirectedMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              graph.isDirected
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Toggle between directed and undirected graph mode"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{graph.isDirected ? 'Directed' : 'Undirected'}</span>
          </button>
        </div>

        {/* Right: Presets, Undo & Clear */}
        <div className="flex items-center gap-2">
          {/* Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPresetMenuOpen(!presetMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Presets</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {presetMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl glass-panel border border-slate-700/80 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Standard Graph Presets</span>
                </div>

                <div className="max-h-80 overflow-y-auto flex flex-col gap-1 p-1">
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
                      className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-xs font-bold text-slate-100">{preset.label}</span>
                      <span className="text-[11px] text-slate-400">{preset.description}</span>
                    </button>
                  ))}
                </div>

                {/* Sub-selector for Complete Kn */}
                <div className="p-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>K_n vertices:</span>
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
                        className={`w-6 h-6 rounded text-xs font-mono font-bold ${
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
            title="Undo last action"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          {/* Clear Graph Button */}
          <button
            type="button"
            onClick={clearGraph}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 text-xs font-semibold transition-colors"
            title="Clear all vertices and edges"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Helper Context Notification / Status Banner */}
      {(statusMessage || edgeStartVertexId) && (
        <div
          className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-150 ${
            statusMessage?.type === 'error'
              ? 'bg-rose-950/40 text-rose-300 border-rose-800/50'
              : statusMessage?.type === 'success'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
              : 'bg-indigo-950/40 text-indigo-300 border-indigo-800/50'
          }`}
        >
          {statusMessage?.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : statusMessage?.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          )}
          <span>
            {edgeStartVertexId
              ? `Connecting edge from vertex '${
                  graph.vertices.find((v) => v.id === edgeStartVertexId)?.label || edgeStartVertexId
                }'. Click target vertex to complete.`
              : statusMessage?.text}
          </span>
        </div>
      )}
    </div>
  );
}
