'use client';

import React from 'react';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { GitCommit, Sparkles, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

export function Simplification() {
  const { analysisResult } = useBooleanStudio();

  if (!analysisResult || !analysisResult.valid || !analysisResult.simplificationSteps) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
        <p className="text-sm">Enter a valid Boolean expression to view step-by-step simplification.</p>
      </div>
    );
  }

  const steps = analysisResult.simplificationSteps;
  const finalExpression = analysisResult.simplifiedExpression || '0';

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">Algebraic Simplification Steps</span>
          <span className="text-xs text-slate-500 font-mono">({steps.length} Transformations)</span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 px-3.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Minimized Form:</span>
          <span className="font-bold text-emerald-400 text-base">{finalExpression}</span>
        </div>
      </div>

      {/* Step-by-Step Timeline Breakdown */}
      <div className="w-full flex flex-col gap-4">
        {steps.map((step, index) => {
          const isFinal = index === steps.length - 1;
          return (
            <div
              key={step.stepNumber}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isFinal
                  ? 'bg-gradient-to-r from-slate-900 via-indigo-950/30 to-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                    isFinal
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {step.stepNumber}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                      {step.lawApplied}
                    </span>
                    {isFinal && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Minimized
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                </div>
              </div>

              {/* Expression Render */}
              <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800/80 font-mono text-sm sm:text-base text-white self-start md:self-auto">
                <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-bold text-indigo-200 tracking-wide">{step.expression}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
