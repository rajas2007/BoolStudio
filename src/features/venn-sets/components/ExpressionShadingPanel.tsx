'use client';

import React, { useState } from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { TruthLinkPanel } from './TruthLinkPanel';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const EXAMPLES_3_PRIMARY = [
  { label: 'A ∪ B', expr: 'A ∪ B' },
  { label: 'A ∩ (B ∪ C)', expr: 'A ∩ (B ∪ C)' },
  { label: "(A ∪ B ∪ C)'", expr: "(A ∪ B ∪ C)'" },
];

const EXAMPLES_3_SECONDARY = [
  { label: 'A Δ B', expr: 'A Δ B' },
  { label: '(A ∩ B) \\ C', expr: '(A ∩ B) \\ C' },
  { label: 'A ∩ B ∩ C', expr: 'A ∩ B ∩ C' },
  { label: 'A Δ B Δ C', expr: 'A Δ B Δ C' },
  { label: 'U \\ (A ∩ B)', expr: 'U \\ (A ∩ B)' },
];

const EXAMPLES_2_PRIMARY = [
  { label: 'A ∪ B', expr: 'A ∪ B' },
  { label: 'A ∩ B', expr: 'A ∩ B' },
  { label: "A \\ B", expr: "A \\ B" },
];

const EXAMPLES_2_SECONDARY = [
  { label: 'A Δ B', expr: 'A Δ B' },
  { label: "(A ∪ B)'", expr: "(A ∪ B)'" },
  { label: "A'", expr: "A'" },
  { label: "U \\ A", expr: "U \\ A" },
];

export function ExpressionShadingPanel() {
  const {
    varCount,
    expressionText,
    parsedExpr,
    setExpressionText,
    insertSymbolIntoExpression,
  } = useVennLabStore();

  const [showMoreExamples, setShowMoreExamples] = useState(false);

  const primaryExamples = varCount === 2 ? EXAMPLES_2_PRIMARY : EXAMPLES_3_PRIMARY;
  const secondaryExamples = varCount === 2 ? EXAMPLES_2_SECONDARY : EXAMPLES_3_SECONDARY;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Input Card Container */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col gap-4">
        {/* Label & Variable Indicators */}
        <div className="flex items-center justify-between">
          <label htmlFor="set-input-field" className="text-sm font-semibold text-slate-200">
            Set Expression
          </label>
          <span className="text-xs text-slate-400 font-mono">
            {varCount} Sets: <span className="text-indigo-400 font-bold">A</span>,{' '}
            <span className="text-emerald-400 font-bold">B</span>
            {varCount === 3 && <>, <span className="text-amber-400 font-bold">C</span></>}
          </span>
        </div>

        {/* Large Input Box */}
        <div className="relative flex items-center">
          <input
            id="set-input-field"
            type="text"
            value={expressionText}
            onChange={(e) => setExpressionText(e.target.value)}
            placeholder={varCount === 2 ? 'e.g. A ∪ B, A \\ B, (A ∩ B)\'' : 'e.g. A ∩ (B ∪ C), A Δ B'}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
          />
          {expressionText && (
            <button
              type="button"
              onClick={() => setExpressionText('')}
              className="absolute right-3.5 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Inline Status Line (never a big banner box) */}
        <div className="min-h-[22px] flex items-center text-xs">
          {parsedExpr?.valid ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium text-slate-300">
                {parsedExpr.plainEnglish
                  ? `${expressionText} = ${parsedExpr.plainEnglish}`
                  : 'Valid set expression'}
              </span>
            </div>
          ) : parsedExpr && !parsedExpr.valid ? (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">
                {parsedExpr.error}
                {parsedExpr.errorIndex !== undefined && (
                  <span className="text-slate-400 ml-1 font-mono">
                    (at col {parsedExpr.errorIndex + 1})
                  </span>
                )}
              </span>
            </div>
          ) : null}
        </div>

        {/* Grouped Symbol Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Sets Group */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">Sets:</span>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression('A')}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/50 font-bold hover:bg-indigo-600 hover:text-white transition-all"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression('B')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              B
            </button>
            {varCount === 3 && (
              <button
                type="button"
                onClick={() => insertSymbolIntoExpression('C')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 font-bold hover:bg-amber-600 hover:text-white transition-all"
              >
                C
              </button>
            )}
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression('U')}
              title="Universal Set"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold hover:bg-slate-700 hover:text-white transition-all font-serif italic"
            >
              U
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression('Ø')}
              title="Empty Set"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold hover:bg-slate-700 hover:text-white transition-all"
            >
              Ø
            </button>
          </div>

          <span className="text-slate-700">|</span>

          {/* Operators Group */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">Operators:</span>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression(' ∪ ')}
              title="Union (OR)"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 font-bold hover:bg-indigo-600 hover:text-white transition-all"
            >
              ∪
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression(' ∩ ')}
              title="Intersection (AND)"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 font-bold hover:bg-indigo-600 hover:text-white transition-all"
            >
              ∩
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression("'")}
              title="Complement (NOT)"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 font-bold hover:bg-indigo-600 hover:text-white transition-all"
            >
              ′
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression(' \\ ')}
              title="Set Difference (minus)"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 font-bold hover:bg-indigo-600 hover:text-white transition-all"
            >
              \
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression(' Δ ')}
              title="Symmetric Difference (XOR)"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 font-bold hover:bg-indigo-600 hover:text-white transition-all"
            >
              Δ
            </button>
          </div>

          <span className="text-slate-700">|</span>

          {/* Brackets Group */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression('(')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold hover:bg-slate-700 hover:text-white transition-all"
            >
              (
            </button>
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression(')')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold hover:bg-slate-700 hover:text-white transition-all"
            >
              )
            </button>
          </div>
        </div>

        {/* Quick Examples: 3 default chips + toggle */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Examples:
            </span>
            <button
              type="button"
              onClick={() => setShowMoreExamples(!showMoreExamples)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>{showMoreExamples ? 'Fewer examples' : 'More examples'}</span>
              {showMoreExamples ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {primaryExamples.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setExpressionText(ex.expr);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 transition-all hover:scale-105 active:scale-95"
              >
                {ex.label}
              </button>
            ))}

            {showMoreExamples &&
              secondaryExamples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    setExpressionText(ex.expr);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 transition-all hover:scale-105 active:scale-95 animate-in fade-in duration-150"
                >
                  {ex.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Collapsible Truth Table (collapsed by default) */}
      <TruthLinkPanel />
    </div>
  );
}
