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
  MousePointer,
  Sparkles,
  Scale,
  Calculator,
  BookOpen,
  Layers,
  RotateCcw,
  CheckSquare,
  Square,
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
    manualShading,
    toggleManualRegion,
    clearManualShading,
    fillAllManualShading,
    invertManualShading,
    parsedExpr,
    pieResult,
  } = useVennLabStore();

  const tabs: Array<{ id: VennLabTab; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'expression', label: 'Expression Shading', icon: Sparkles },
    { id: 'manual', label: 'Manual Shading', icon: MousePointer },
    { id: 'identity', label: 'Identity Checker', icon: Scale },
    { id: 'inclusion-exclusion', label: 'Inclusion-Exclusion', icon: Calculator },
    { id: 'word-problems', label: 'Word Problems', icon: BookOpen, badge: '4' },
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Venn & Sets Lab</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-normal">
                Units 1 & 3
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Interactive set theory laboratory: explore unions, intersections, complements, and symmetric differences, verify set algebra identities, and solve Principle of Inclusion-Exclusion cardinalities.
          </p>
        </div>

        {/* 2-Set vs 3-Set Selector Toggle */}
        <div className="flex items-center self-start md:self-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setVarCount(2)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
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

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'expression' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Interactive Venn Diagram:
              </span>
              <span className="text-xs font-mono text-indigo-400">
                {parsedExpr?.valid ? `${parsedExpr.shadedMasks.length} Shaded` : '0 Shaded'}
              </span>
            </div>
            <VennDiagram
              varCount={varCount}
              shading={currentShading}
              hoveredMask={hoveredMask}
              onHoverRegion={setHoveredMask}
              interactive={false}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <ExpressionShadingPanel />
            <TruthLinkPanel />
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Click Regions to Toggle Shading:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearManualShading}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <Square className="w-3 h-3" />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={fillAllManualShading}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>All (U)</span>
                </button>
                <button
                  type="button"
                  onClick={invertManualShading}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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
              interactive={true}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Shaded Set Expression:
              </span>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-sm text-emerald-300 break-words font-semibold">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Cardinality Heatmap & Region Counts:
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Union = {pieResult.unionCount}
              </span>
            </div>
            <VennDiagram
              varCount={varCount}
              shading={currentShading}
              regionCounts={pieResult.valid ? pieResult.regionCounts : undefined}
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
