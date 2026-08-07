'use client';

import React, { Suspense } from 'react';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { ExpressionInput } from '@/components/ExpressionInput/ExpressionInput';
import { TruthTable } from '@/components/TruthTable/TruthTable';
import { LogicCircuit } from '@/components/LogicCircuit/LogicCircuit';
import { KMap } from '@/components/KMap/KMap';
import { Simplification } from '@/components/Simplification/Simplification';
import { Table, Cpu, Grid, GitCommit, AlertCircle } from 'lucide-react';

export function WorkspaceView() {
  const { activeTab, setActiveTab, analysisResult } = useBooleanStudio();

  const tabs = [
    { id: 'truth-table', label: 'Truth Table', icon: Table },
    { id: 'circuit', label: 'Logic Circuit', icon: Cpu },
    { id: 'kmap', label: 'Karnaugh Map', icon: Grid },
    { id: 'simplification', label: 'Simplification', icon: GitCommit },
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Boolean Logic Workspace</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-normal">
            v1.0
          </span>
        </h1>
        <p className="text-slate-400 text-sm">
          Enter a Boolean expression below to generate truth tables, interactive logic gate circuits, Karnaugh Maps, and step-by-step simplifications.
        </p>
      </div>

      {/* Expression Input Panel wrapped in Suspense */}
      <Suspense fallback={<div className="p-8 rounded-2xl glass-panel text-slate-400 text-center text-sm">Loading workspace...</div>}>
        <ExpressionInput />
      </Suspense>

      {/* Main Results View with Tabs */}
      {analysisResult && analysisResult.valid ? (
        <div className="flex flex-col gap-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="w-full transition-all duration-300">
            {activeTab === 'truth-table' && <TruthTable />}
            {activeTab === 'circuit' && <LogicCircuit />}
            {activeTab === 'kmap' && <KMap />}
            {activeTab === 'simplification' && <Simplification />}
          </div>
        </div>
      ) : analysisResult && !analysisResult.valid ? (
        <div className="p-8 rounded-2xl glass-panel text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <h3 className="text-lg font-bold text-white">Invalid Expression</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Please fix the syntax error above and click &quot;Generate Results&quot; to build visualizations.
          </p>
        </div>
      ) : null}
    </div>
  );
}
