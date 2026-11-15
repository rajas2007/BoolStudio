'use client';

import React from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { EditorMode, PresetName } from '@/lib/types/graph';
import {
  MousePointer,
  CirclePlus,
  GitCommit,
  Trash2,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function Toolbar() {
  const {
    mode,
    graph,
    presetParamN,
    presetParamM,
    setMode,
    toggleDirectedMode,
    loadPreset,
    clearGraph,
  } = useGraphLab();

  const modes: { id: EditorMode; label: string; icon: React.ElementType }[] = [
    { id: 'select', label: 'Select / Move', icon: MousePointer },
    { id: 'add-vertex', label: 'Add Vertex', icon: CirclePlus },
    { id: 'add-edge', label: 'Add Edge', icon: GitCommit },
    { id: 'delete', label: 'Delete', icon: Trash2 },
  ];

  const presets: { id: PresetName; label: string }[] = [
    { id: 'k_n', label: `Complete K_${presetParamN}` },
    { id: 'cycle', label: 'Cycle C_5' },
    { id: 'path', label: 'Path P_5' },
    { id: 'k_mn', label: `Bipartite K_${presetParamN},${presetParamM}` },
    { id: 'tree', label: 'Tree (7 Nodes)' },
    { id: 'petersen', label: 'Petersen Graph' },
    { id: 'disconnected', label: 'Disconnected' },
    { id: 'single', label: 'Single Vertex' },
    { id: 'empty', label: 'Empty' },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/60 shadow-xl">
      {/* Editor Tools */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mr-2 hidden sm:inline">
          Tools:
        </span>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}

        {/* Directed / Undirected Toggle */}
        <button
          onClick={toggleDirectedMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ml-1 ${
            graph.isDirected
              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle between Directed and Undirected graph"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>{graph.isDirected ? 'Directed' : 'Undirected'}</span>
        </button>
      </div>

      {/* Preset Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">
            Presets:
          </span>
          <select
            aria-label="Preset Graph Selection"
            onChange={(e) => {
              const val = e.target.value as PresetName;
              loadPreset(val);
            }}
            defaultValue="k_n"
            className="bg-transparent text-slate-200 text-xs font-medium rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.label}
              </option>
            ))}
          </select>

          {/* K_n parameter selector (1..7) */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2 pr-1">
            <span className="text-[11px] text-slate-500">n=</span>
            {[3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => loadPreset('k_n', num)}
                className={`w-5 h-5 rounded text-[11px] font-mono flex items-center justify-center transition-colors ${
                  presetParamN === num
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={`Load K_${num}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Button */}
        <button
          onClick={clearGraph}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          title="Clear all vertices and edges"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
