'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { ExpressionInput } from '@/components/ExpressionInput/ExpressionInput';
import { Table, Cpu, Grid, GitCommit, AlertCircle, ShieldAlert } from 'lucide-react';

const TruthTable = dynamic(() => import('@/components/TruthTable/TruthTable').then((m) => m.TruthTable), {
  loading: () => <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">Loading Truth Table...</div>,
});

const LogicCircuit = dynamic(() => import('@/components/LogicCircuit/LogicCircuit').then((m) => m.LogicCircuit), {
  loading: () => <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">Loading Logic Circuit Visualizer...</div>,
});

const KMap = dynamic(() => import('@/components/KMap/KMap').then((m) => m.KMap), {
  loading: () => <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">Loading Karnaugh Map Solver...</div>,
});

const Simplification = dynamic(() => import('@/components/Simplification/Simplification').then((m) => m.Simplification), {
  loading: () => <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">Loading Simplification Engine...</div>,
});

const LogicAnalysis = dynamic(() => import('@/components/LogicAnalysis/LogicAnalysis').then((m) => m.LogicAnalysis), {
  loading: () => <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse text-sm">Loading Logic Analysis...</div>,
});

export function WorkspaceView() {
  const { activeTab, setActiveTab, analysisResult } = useBooleanStudio();

  const tabs = [
    { id: 'truth-table', label: 'Truth Table', icon: Table },
    { id: 'circuit', label: 'Logic Circuit', icon: Cpu },
    { id: 'kmap', label: 'Karnaugh Map', icon: Grid },
    { id: 'simplification', label: 'Simplification', icon: GitCommit },
    { id: 'logic-analysis', label: 'Logic Analysis', icon: ShieldAlert },
  ] as const;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex flex-col gap-2.5">
      {/* Expression Input Panel & Header Toolbar wrapped in Suspense */}
      <Suspense fallback={<div className="h-20 rounded-2xl glass-panel animate-pulse text-slate-400 flex items-center justify-center text-xs">Loading Boolean Studio...</div>}>
        <ExpressionInput />
      </Suspense>

      {/* Navigation Tabs Bar (~36px) */}
      <div className="w-full flex items-center gap-1 p-1 rounded-xl glass-panel border border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-1 text-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport Container with Matched 560px Height */}
      <div className="w-full h-[560px] rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
        {analysisResult && analysisResult.valid ? (
          <div className="w-full transition-all duration-200">
            {activeTab === 'truth-table' && <TruthTable />}
            {activeTab === 'circuit' && <LogicCircuit />}
            {activeTab === 'kmap' && <KMap />}
            {activeTab === 'simplification' && <Simplification />}
            {activeTab === 'logic-analysis' && <LogicAnalysis />}
          </div>
        ) : analysisResult && !analysisResult.valid ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-8">
            <AlertCircle className="w-10 h-10 text-rose-400" />
            <h3 className="text-base font-bold text-white">Invalid Boolean Expression</h3>
            <p className="text-xs text-slate-400 max-w-md font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              {analysisResult.error}
            </p>
            <p className="text-xs text-slate-500">
              Please fix the syntax in the top toolbar and click &quot;Evaluate&quot; to build visualizations.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 p-8 text-slate-400">
            <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
            <p className="text-xs">Enter an expression above or choose a preset to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
