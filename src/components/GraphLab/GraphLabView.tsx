'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useGraphLab } from '@/hooks/useGraphLab';
import { Toolbar } from './Toolbar';
import { GraphCanvas } from './GraphCanvas';
import { TopicTabs } from './TopicTabs';

const RepresentationsPanel = dynamic(
  () => import('./RepresentationsPanel').then((m) => m.RepresentationsPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Representations &amp; Properties...
      </div>
    ),
  }
);

const DegreeWalksPanel = dynamic(
  () => import('./DegreeWalksPanel').then((m) => m.DegreeWalksPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Degrees, Walks &amp; Components...
      </div>
    ),
  }
);

const EulerPanel = dynamic(
  () => import('./EulerPanel').then((m) => m.EulerPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Euler Traversal Analyzer...
      </div>
    ),
  }
);

const HamiltonianPanel = dynamic(
  () => import('./HamiltonianPanel').then((m) => m.HamiltonianPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Hamiltonian Solver...
      </div>
    ),
  }
);

const TreePanel = dynamic(
  () => import('./TreePanel').then((m) => m.TreePanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Tree Diagnostic Engine...
      </div>
    ),
  }
);

const BipartitePanel = dynamic(
  () => import('./BipartitePanel').then((m) => m.BipartitePanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Bipartite 2-Colouring...
      </div>
    ),
  }
);

const MatchingPanel = dynamic(
  () => import('./MatchingPanel').then((m) => m.MatchingPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Bipartite Matching Engine...
      </div>
    ),
  }
);

const PlanarPanel = dynamic(
  () => import('./PlanarPanel').then((m) => m.PlanarPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Planar Bound Evaluator...
      </div>
    ),
  }
);

const ColoringPanel = dynamic(
  () => import('./ColoringPanel').then((m) => m.ColoringPanel),
  {
    loading: () => (
      <div className="p-6 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-xs">
        Loading Graph Colouring Engine...
      </div>
    ),
  }
);

export function GraphLabView() {
  const { activeTopic } = useGraphLab();

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex flex-col gap-2.5">
      {/* Studio Toolbar (Contains Branding, Mode Buttons, Stats, Directed Toggle, Inline Toast, Presets, Undo, Clear) */}
      <Toolbar />

      {/* 9 Syllabus Topic Tabs */}
      <TopicTabs />

      {/* Main 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Left Column: Canvas (~58%) */}
        <div className="lg:col-span-7 flex flex-col h-[560px]">
          <GraphCanvas />
        </div>

        {/* Right Column: Active Topic's Panel with Input, Result, & Explanation (~42%) */}
        <div className="lg:col-span-5 flex flex-col h-[560px]">
          <div className="w-full h-full glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
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
