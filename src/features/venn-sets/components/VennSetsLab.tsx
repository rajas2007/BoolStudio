'use client';

import React from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { VennDiagram } from './VennDiagram';
import { ExpressionShadingPanel } from './ExpressionShadingPanel';
import { IdentityCheckerPanel } from './IdentityCheckerPanel';
import { InclusionExclusionPanel } from './InclusionExclusionPanel';
import { WordProblemPanel } from './WordProblemPanel';
import { TruthLinkPanel } from './TruthLinkPanel';
import { formatCanonicalExpression } from '../lib/regions';
import { shadingMapToMasks } from '../lib/shading';
import {
  RotateCcw,
  CheckSquare,
  Square,
  Layers,
} from 'lucide-react';
import { VennLabTab } from '../types';

export function VennSetsLab() {
  const {
    varCount,
    setVarCount,
    activeTab,
    setActiveTab,
    hoveredMask,
    setHoveredMask,
    showLabels,
    toggleShowLabels,
    manualShading,
    toggleManualRegion,
    clearManualShading,
    fillAllManualShading,
    invertManualShading,
    parsedExpr,
    pieResult,
  } = useVennLabStore();

  const tabs: Array<{ id: VennLabTab; label: string }> = [
    { id: 'expression', label: 'Expression Shading' },
    { id: 'manual', label: 'Manual Shading' },
    { id: 'identity', label: 'Identity Checker' },
    { id: 'inclusion-exclusion', label: 'Inclusion-Exclusion' },
    { id: 'word-problems', label: 'Word Problems' },
  ];

  // Active shading for diagram in expression vs manual vs PIE modes
  const currentShading =
    activeTab === 'manual'
      ? manualShading
      : activeTab === 'expression'
      ? Object.fromEntries(
          Array.from({ length: Math.pow(2, varCount) }, (_, i) => [
            i,
            Boolean(parsedExpr?.valid && parsedExpr.shadedMasks.includes(i)),
          ])
        )
      : activeTab === 'inclusion-exclusion'
      ? Object.fromEntries(
          Array.from({ length: Math.pow(2, varCount) }, (_, i) => [
            i,
            Boolean(pieResult.valid && (pieResult.regionCounts[i] ?? 0) > 0),
          ])
        )
      : manualShading;

  const manualShadedMasks = shadingMapToMasks(manualShading, varCount);
  const manualCanonical = formatCanonicalExpression(manualShadedMasks, varCount);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex flex-col gap-2.5">
      {/* Studio Toolbar (Contains Branding, Units Badge, 2/3 Sets Toggle, and Region Shading Tools) */}
      <div className="w-full px-3.5 py-2 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 shadow-xl">
        {/* Left: Branding & Unit Badge */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight hidden sm:inline">Venn &amp; Sets Lab</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            Units 1 &amp; 3
          </span>
        </div>

        {/* Center: 2-Set vs 3-Set Segmented Switch */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setVarCount(2)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
              varCount === 2
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2 Sets (A, B)</span>
          </button>
          <button
            type="button"
            onClick={() => setVarCount(3)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
              varCount === 3
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3 Sets (A, B, C)</span>
          </button>
        </div>

        {/* Right: Quick Controls & Manual Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleShowLabels}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              showLabels
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={showLabels ? 'Hide region labels' : 'Show region labels'}
          >
            <Layers className="w-3 h-3" />
            <span>{showLabels ? 'Labels: ON' : 'Labels: OFF'}</span>
          </button>

          {activeTab === 'manual' && (
            <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800">
              <button
                type="button"
                onClick={clearManualShading}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
                title="Clear all shaded regions"
              >
                <Square className="w-3 h-3" />
                <span>Clear</span>
              </button>
              <button
                type="button"
                onClick={fillAllManualShading}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
                title="Shade all regions"
              >
                <CheckSquare className="w-3 h-3" />
                <span>All</span>
              </button>
              <button
                type="button"
                onClick={invertManualShading}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
                title="Invert shaded regions"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Invert</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mode Segmented Navigation Tabs */}
      <div className="w-full flex items-center gap-1 p-1 rounded-xl glass-panel border border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-1 text-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Areas with Matched 560px Viewport Height */}
      {activeTab === 'expression' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Left Column: Large Venn Diagram Canvas (~58%) */}
          <div className="lg:col-span-7 flex flex-col h-[560px] items-center justify-center">
            <VennDiagram
              varCount={varCount}
              shading={currentShading}
              hoveredMask={hoveredMask}
              onHoverRegion={setHoveredMask}
              showLabels={showLabels}
              onToggleLabels={toggleShowLabels}
              interactive={false}
            />
          </div>

          {/* Right Column: Expression Shading Panel (~42%) */}
          <div className="lg:col-span-5 flex flex-col h-[560px]">
            <div className="w-full h-full glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
              <ExpressionShadingPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Left Column: Interactive Venn Diagram Canvas (~58%) */}
          <div className="lg:col-span-7 flex flex-col h-[560px] items-center justify-center">
            <VennDiagram
              varCount={varCount}
              shading={manualShading}
              hoveredMask={hoveredMask}
              onToggleRegion={toggleManualRegion}
              onHoverRegion={setHoveredMask}
              showLabels={showLabels}
              onToggleLabels={toggleShowLabels}
              interactive={true}
            />
          </div>

          {/* Right Column: Computed Canonical Expression & Truth Table (~42%) */}
          <div className="lg:col-span-5 flex flex-col h-[560px]">
            <div className="w-full h-full glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600 flex flex-col gap-4">
              <div className="p-4 rounded-xl glass-panel border border-slate-800 bg-slate-900/60 flex flex-col gap-2.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Computed Set Expression (Canonical Form)
                </span>
                <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-sm text-emerald-300 break-words font-semibold">
                  {manualCanonical}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Active Minterms:</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {manualShadedMasks.length === 0
                      ? 'None (∅)'
                      : manualShadedMasks.map((m) => `m${m}`).join(', ')}
                  </span>
                </div>
              </div>

              <TruthLinkPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'identity' && <IdentityCheckerPanel />}

      {activeTab === 'inclusion-exclusion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          <div className="lg:col-span-7 flex flex-col h-[560px] items-center justify-center">
            <VennDiagram
              varCount={varCount}
              shading={currentShading}
              regionCounts={pieResult.valid ? pieResult.regionCounts : undefined}
              showLabels={true}
              interactive={false}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col h-[560px]">
            <div className="w-full h-full glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
              <InclusionExclusionPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'word-problems' && <WordProblemPanel />}
    </div>
  );
}
