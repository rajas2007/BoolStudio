'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useGraphLab } from '@/hooks/useGraphLab';
import { Toolbar } from './Toolbar';
import { GraphCanvas } from './GraphCanvas';
import { TopicTabs } from './TopicTabs';
import { Network } from 'lucide-react';

const PropertiesPanel = dynamic(
  () => import('./PropertiesPanel').then((m) => m.PropertiesPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Graph Properties...
      </div>
    ),
  }
);

const MatrixPanel = dynamic(
  () => import('./MatrixPanel').then((m) => m.MatrixPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Matrix Representations...
      </div>
    ),
  }
);

const WalkPanel = dynamic(
  () => import('./WalkPanel').then((m) => m.WalkPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Walk & Cycle Explorer...
      </div>
    ),
  }
);

const ConnectivityPanel = dynamic(
  () => import('./ConnectivityPanel').then((m) => m.ConnectivityPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Connectivity Solver...
      </div>
    ),
  }
);

const EulerPanel = dynamic(
  () => import('./EulerPanel').then((m) => m.EulerPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Euler Traversal Analyzer...
      </div>
    ),
  }
);

const BipartitePanel = dynamic(
  () => import('./BipartitePanel').then((m) => m.BipartitePanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Bipartite 2-Colouring...
      </div>
    ),
  }
);

const ColoringPanel = dynamic(
  () => import('./ColoringPanel').then((m) => m.ColoringPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Graph Colouring Engine...
      </div>
    ),
  }
);

const TreePanel = dynamic(
  () => import('./TreePanel').then((m) => m.TreePanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Tree Diagnostic Engine...
      </div>
    ),
  }
);

const HamiltonianPanel = dynamic(
  () => import('./HamiltonianPanel').then((m) => m.HamiltonianPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Hamiltonian Explorer...
      </div>
    ),
  }
);

const PlanarPanel = dynamic(
  () => import('./PlanarPanel').then((m) => m.PlanarPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">
        Loading Planar Bound Evaluator...
      </div>
    ),
  }
);

export function GraphLabView() {
  const { activeTopic } = useGraphLab();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title & Description Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Network className="w-8 h-8 text-indigo-400" />
          <span>Graph Theory Lab</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-normal">
            Unit 6
          </span>
        </h1>
        <p className="text-slate-400 text-sm">
          Interactive laboratory for graph representations, adjacency &amp; incidence
          matrices, walks and cycles, Euler tours, bipartite 2-colouring, trees, and
          chromatic numbers.
        </p>
      </div>

      {/* Editor Toolbar */}
      <Toolbar />

      {/* Interactive SVG Graph Canvas */}
      <GraphCanvas />

      {/* Topic Panels Section */}
      <div className="flex flex-col gap-6">
        <TopicTabs />

        <div className="w-full transition-all duration-300">
          {activeTopic === 'properties' && <PropertiesPanel />}
          {activeTopic === 'matrices' && <MatrixPanel />}
          {activeTopic === 'walks' && <WalkPanel />}
          {activeTopic === 'components' && <ConnectivityPanel />}
          {activeTopic === 'euler' && <EulerPanel />}
          {activeTopic === 'hamiltonian' && <HamiltonianPanel />}
          {activeTopic === 'bipartite' && <BipartitePanel />}
          {activeTopic === 'coloring' && <ColoringPanel />}
          {activeTopic === 'tree' && <TreePanel />}
          {activeTopic === 'planar' && <PlanarPanel />}
        </div>
      </div>
    </div>
  );
}
