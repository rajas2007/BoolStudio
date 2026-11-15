'use client';

import React from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { TopicTab } from '@/lib/types/graph';
import {
  Activity,
  Table,
  Footprints,
  Layers,
  Sparkles,
  Split,
  Palette,
  GitFork,
  Compass,
} from 'lucide-react';

export function TopicTabs() {
  const { activeTopic, setActiveTopic } = useGraphLab();

  const tabs: { id: TopicTab; label: string; icon: React.ElementType }[] = [
    { id: 'properties', label: 'Properties & Handshake', icon: Activity },
    { id: 'matrices', label: 'Adjacency & Incidence', icon: Table },
    { id: 'walks', label: 'Walks, Paths & Cycles', icon: Footprints },
    { id: 'components', label: 'Connected Components', icon: Layers },
    { id: 'euler', label: 'Euler Circuit & Trail', icon: Sparkles },
    { id: 'hamiltonian', label: 'Hamiltonian Paths & Cycles', icon: Compass },
    { id: 'bipartite', label: 'Bipartite & Odd Cycles', icon: Split },
    { id: 'coloring', label: 'Graph Colouring', icon: Palette },
    { id: 'tree', label: 'Tree Detection', icon: GitFork },
  ];

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTopic === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTopic(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
