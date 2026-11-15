'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useGraphLab } from '@/hooks/useGraphLab';
import { Toolbar } from './Toolbar';
import { GraphCanvas } from './GraphCanvas';
import { TopicTabs } from './TopicTabs';
import { Network } from 'lucide-react';

const RepresentationsPanel = dynamic(
  () => import('./RepresentationsPanel').then((m) => m.RepresentationsPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Representations &amp; Properties...
      </div>
    ),
  }
);

const DegreeWalksPanel = dynamic(
  () => import('./DegreeWalksPanel').then((m) => m.DegreeWalksPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Degrees, Walks &amp; Components...
      </div>
    ),
  }
);

const EulerPanel = dynamic(
  () => import('./EulerPanel').then((m) => m.EulerPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Euler Traversal Analyzer...
      </div>
    ),
  }
);

const HamiltonianPanel = dynamic(
  () => import('./HamiltonianPanel').then((m) => m.HamiltonianPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Hamiltonian Solver...
      </div>
    ),
  }
);

const TreePanel = dynamic(
  () => import('./TreePanel').then((m) => m.TreePanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Tree Diagnostic Engine...
      </div>
    ),
  }
);

const BipartitePanel = dynamic(
  () => import('./BipartitePanel').then((m) => m.BipartitePanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Bipartite 2-Colouring...
      </div>
    ),
  }
);

const MatchingPanel = dynamic(
  () => import('./MatchingPanel').then((m) => m.MatchingPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Bipartite Matching Engine...
      </div>
    ),
  }
);

const PlanarPanel = dynamic(
  () => import('./PlanarPanel').then((m) => m.PlanarPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Planar Bound Evaluator...
      </div>
    ),
  }
);

const ColoringPanel = dynamic(
  () => import('./ColoringPanel').then((m) => m.ColoringPanel),
  {
    loading: () => (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Graph Colouring Engine...
      </div>
    ),
  }
);

export function GraphLabView() {
  const { activeTopic } = useGraphLab();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Title & Description Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-400 shrink-0" />
            <span>Graph Theory Lab</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-normal">
              Unit 6
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Interactive discrete mathematics laboratory: representations, connectivity, Eulerian &amp;
            Hamiltonian traversals, trees, bipartite matching, planar bounds, and chromatic coloring.
          </p>
        </div>
      </div>

      {/* Editor Toolbar (Uncluttered, larger controls) */}
      <Toolbar />

      {/* 9 Syllabus Topic Tabs */}
      <TopicTabs />

      {/* Main 2-Column Desktop Grid Layout (Left ~60% Canvas, Right ~40% Active Topic Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas (~60%) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <GraphCanvas />
        </div>

        {/* Right Column: Active Topic's Panel with Input, Result, & Explanation (~40%) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="w-full glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-2xl max-h-[820px] overflow-y-auto">
            {activeTopic === 'representations' && <RepresentationsPanel />}
            {activeTopic === 'walks-connectivity' && <DegreeWalksPanel />}
            {activeTopic === 'euler' && <EulerPanel />}
            {activeTopic === 'hamiltonian' && <HamiltonianPanel />}
            {activeTopic === 'trees' && <TreePanel />}
            {activeTopic === 'bipartite' && <BipartitePanel />}
            {activeTopic === 'matching' && <MatchingPanel />}
            {activeTopic === 'planar' && <PlanarPanel />}
            {activeTopic === 'colouring' && <ColoringPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
