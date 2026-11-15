'use client';

import React from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { TopicTab } from '@/lib/types/graph';
import {
  Table,
  Footprints,
  Sparkles,
  Compass,
  GitFork,
  Split,
  Link2,
  Maximize2,
  Palette,
} from 'lucide-react';

export function TopicTabs() {
  const { activeTopic, setActiveTopic } = useGraphLab();

  const tabs: { id: TopicTab; num: number; label: string; icon: React.ElementType }[] = [
    { id: 'representations', num: 1, label: 'Representations & Properties', icon: Table },
    { id: 'walks-connectivity', num: 2, label: 'Degrees, Walks & Components', icon: Footprints },
    { id: 'euler', num: 3, label: 'Euler Tours & Trails', icon: Sparkles },
    { id: 'hamiltonian', num: 4, label: 'Hamiltonian Paths & Cycles', icon: Compass },
    { id: 'trees', num: 5, label: 'Trees & Spanning Trees', icon: GitFork },
    { id: 'bipartite', num: 6, label: 'Bipartite & 2-Colouring', icon: Split },
    { id: 'matching', num: 7, label: 'Bipartite Matching & Hall', icon: Link2 },
    { id: 'planar', num: 8, label: 'Planar Graphs & Edge Bound', icon: Maximize2 },
    { id: 'colouring', num: 9, label: 'Graph Colouring', icon: Palette },
  ];

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTopic === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTopic(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono font-bold ${
                isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.num}
            </span>
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
