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
    <div className="w-full flex flex-col gap-6">
      {/* Problem Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {WORD_PROBLEMS.map((prob) => {
          const isSelected = prob.id === currentProblem.id;
          return (
            <button
              key={prob.id}
              type="button"
              onClick={() => selectWordProblem(prob.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {prob.category}
                </span>
                <h4 className={`text-xs font-bold mt-1.5 ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                  {prob.title}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {prob.varCount} Sets ({prob.inputs.universal ? `|U|=${prob.inputs.universal}` : ''})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Problem Card & Visual Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Narrative & Questions (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">{currentProblem.title}</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {currentProblem.varCount} Sets
            </span>
          </div>

          {/* Scenario description */}
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {currentProblem.description}
          </p>

          {/* Set definitions */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/50 font-semibold">
              Set A: {currentProblem.setNames.A}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-semibold">
              Set B: {currentProblem.setNames.B}
            </span>
            {currentProblem.varCount === 3 && currentProblem.setNames.C && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 font-semibold">
                Set C: {currentProblem.setNames.C}
              </span>
            )}
          </div>

          {/* Target Question */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Target Challenge:
            </span>
            <p className="text-sm font-semibold text-white">
              {currentProblem.targetQuestion}
            </p>
          </div>

          {/* Reveal Answer Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={toggleRevealAnswer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {isAnswerRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isAnswerRevealed ? 'Hide Solution' : 'Reveal Answer & Step-by-Step Derivation'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inclusion-exclusion')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <span>Explore in Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Revealed Answer Content */}
          {isAnswerRevealed && (
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-600/40 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Target Answer: {currentProblem.expectedAnswer}</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-mono">
                {currentProblem.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Target Region Diagram (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Target Region(s) Shaded:
            </span>
            <span className="text-xs font-mono text-indigo-400">
              {currentProblem.targetRegionMasks.length} Region(s)
            </span>
          </div>
          <div className="w-full">
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
