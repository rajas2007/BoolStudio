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
      : activeTab === 'expression' && parsedExpr && parsedExpr.valid
      ? Object.fromEntries(
          Array.from({ length: Math.pow(2, varCount) }, (_, i) => [
            i,
            parsedExpr.shadedMasks.includes(i),
          ])
        )
      : activeTab === 'inclusion-exclusion'
      ? Object.fromEntries(
          Array.from({ length: Math.pow(2, varCount) }, (_, i) => [
            i,
            pieResult.valid && (pieResult.regionCounts[i] ?? 0) > 0,
          ])
        )
      : manualShading;

  const manualShadedMasks = shadingMapToMasks(manualShading, varCount);
  const manualCanonical = formatCanonicalExpression(manualShadedMasks, varCount);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Venn & Sets Lab
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
              Units 1 & 3
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Interactive set algebra laboratory: shade expressions, verify set identities, and calculate Principle of Inclusion-Exclusion cardinalities.
          </p>
        </div>

        {/* 2-Set vs 3-Set Segmented Switch */}
        <div className="flex items-center self-start md:self-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setVarCount(2)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              varCount === 2
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2 Sets (A, B)</span>
          </button>
          <button
            type="button"
            onClick={() => setVarCount(3)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              varCount === 3
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3 Sets (A, B, C)</span>
          </button>
        </div>
      </div>

      {/* Mode Segmented Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Areas */}
      {activeTab === 'expression' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Large Venn Diagram (at least 480px) */}
          <div className="lg:col-span-6 flex flex-col items-center">
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

          {/* Right Column: Input & Results */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <ExpressionShadingPanel />
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col items-center gap-3">
            <div className="w-full max-w-[560px] flex items-center justify-between px-1 text-xs">
              <span className="text-slate-400 font-medium">Click regions to toggle shading</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearManualShading}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <Square className="w-3 h-3" />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={fillAllManualShading}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>All</span>
                </button>
                <button
                  type="button"
                  onClick={invertManualShading}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Invert</span>
                </button>
              </div>
            </div>

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

          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Computed Set Expression (Canonical Form)
              </span>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-sm text-emerald-300 break-words font-semibold">
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
      )}

      {activeTab === 'identity' && <IdentityCheckerPanel />}

      {activeTab === 'inclusion-exclusion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col items-center">
            <VennDiagram
              varCount={varCount}
              shading={currentShading}
              regionCounts={pieResult.valid ? pieResult.regionCounts : undefined}
              showLabels={true}
              interactive={false}
            />
          </div>

          <div className="lg:col-span-6">
            <InclusionExclusionPanel />
          </div>
        </div>
      )}

      {activeTab === 'word-problems' && <WordProblemPanel />}
    </div>
  );
}
