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

  const tabs: { id: TopicTab; num: number; label: string; fullTitle: string; icon: React.ElementType }[] = [
    { id: 'representations', num: 1, label: 'Reps & Matrices', fullTitle: '1. Representations & Basic Properties', icon: Table },
    { id: 'walks-connectivity', num: 2, label: 'Degrees & Walks', fullTitle: '2. Degrees, Walks, Paths & Components', icon: Footprints },
    { id: 'euler', num: 3, label: 'Euler Tours', fullTitle: '3. Euler Tours & Trails (Hierholzer)', icon: Sparkles },
    { id: 'hamiltonian', num: 4, label: 'Hamiltonian', fullTitle: '4. Hamiltonian Paths & Cycles', icon: Compass },
    { id: 'trees', num: 5, label: 'Trees', fullTitle: '5. Trees & Spanning Trees', icon: GitFork },
    { id: 'bipartite', num: 6, label: 'Bipartite', fullTitle: '6. Bipartite Graphs & 2-Colourability', icon: Split },
    { id: 'matching', num: 7, label: 'Matching & Hall', fullTitle: '7. Bipartite Matching & Hall Condition', icon: Link2 },
    { id: 'planar', num: 8, label: 'Planar Bounds', fullTitle: '8. Planar Graphs & Edge Bounds', icon: Maximize2 },
    { id: 'colouring', num: 9, label: 'Colouring', fullTitle: '9. Graph Colouring & Chromatic Number', icon: Palette },
  ];

  return (
    <div className="w-full flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTopic === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTopic(tab.id)}
            title={tab.fullTitle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all duration-150 flex-1 justify-center ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono font-bold shrink-0 ${
                isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.num}
            </span>
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
