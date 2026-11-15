'use client';

import React from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { WORD_PROBLEMS } from '../lib/word-problems';
import { masksToShadingMap } from '../lib/shading';
import { VennDiagram } from './VennDiagram';
import { BookOpen, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export function WordProblemPanel() {
  const {
    selectedProblemId,
    isAnswerRevealed,
    selectWordProblem,
    toggleRevealAnswer,
    pieResult,
    setActiveTab,
  } = useVennLabStore();

  const currentProblem = WORD_PROBLEMS.find((p) => p.id === selectedProblemId) || WORD_PROBLEMS[0];

  const targetShading = masksToShadingMap(currentProblem.targetRegionMasks, currentProblem.varCount);

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Problem Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {WORD_PROBLEMS.map((prob) => {
          const isSelected = prob.id === currentProblem.id;
          return (
            <button
              key={prob.id}
              type="button"
              onClick={() => selectWordProblem(prob.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {prob.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {prob.varCount} Sets
                </span>
              </div>
              <h4 className={`text-xs font-bold truncate w-full ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                {prob.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Main Problem Card & Visual Diagram Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch h-[500px]">
        {/* Narrative & Questions (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 flex flex-col gap-3.5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">{currentProblem.title}</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {currentProblem.varCount} Sets ({currentProblem.inputs.universal ? `|U|=${currentProblem.inputs.universal}` : ''})
            </span>
          </div>

          {/* Scenario description */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            {currentProblem.description}
          </p>

          {/* Set definitions */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/50 font-semibold text-[11px]">
              Set A: {currentProblem.setNames.A}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-semibold text-[11px]">
              Set B: {currentProblem.setNames.B}
            </span>
            {currentProblem.varCount === 3 && currentProblem.setNames.C && (
              <span className="px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-300 border border-amber-800/50 font-semibold text-[11px]">
                Set C: {currentProblem.setNames.C}
              </span>
            )}
          </div>

          {/* Target Question */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Target Challenge:
            </span>
            <p className="text-xs font-semibold text-white">
              {currentProblem.targetQuestion}
            </p>
          </div>

          {/* Reveal Answer Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={toggleRevealAnswer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {isAnswerRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isAnswerRevealed ? 'Hide Solution' : 'Reveal Answer & Derivation'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inclusion-exclusion')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <span>Explore in Calculator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Revealed Answer Content */}
          {isAnswerRevealed && (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-600/40 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Answer: {currentProblem.expectedAnswer}</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                {currentProblem.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Target Region Diagram (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 h-full shadow-2xl">
          <div className="flex items-center justify-between w-full px-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Target Region(s) Shaded:
            </span>
            <span className="text-xs font-mono text-indigo-400 font-bold">
              {currentProblem.targetRegionMasks.length} Region(s)
            </span>
          </div>
          <div className="w-full flex items-center justify-center">
            <VennDiagram
              varCount={currentProblem.varCount}
              shading={targetShading}
              regionCounts={pieResult.regionCounts}
              interactive={false}
              customSetNames={currentProblem.setNames}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
