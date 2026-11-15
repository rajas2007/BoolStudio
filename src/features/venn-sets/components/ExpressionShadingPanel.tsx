'use client';

import React from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { formatCanonicalExpression } from '../lib/regions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const QUICK_SYMBOLS = [
  { symbol: ' ∪ ', label: '∪', desc: 'Union (OR)' },
  { symbol: ' ∩ ', label: '∩', desc: 'Intersection (AND)' },
  { symbol: "'", label: "'", desc: 'Complement (NOT)' },
  { symbol: ' \\ ', label: '\\', desc: 'Set Difference' },
  { symbol: ' △ ', label: '△', desc: 'Symmetric Difference (XOR)' },
  { symbol: '(', label: '(', desc: 'Open bracket' },
  { symbol: ')', label: ')', desc: 'Close bracket' },
  { symbol: 'U', label: 'U', desc: 'Universal set' },
  { symbol: '∅', label: '∅', desc: 'Empty set' },
];

const PRESETS_2 = [
  { label: 'Union: A ∪ B', expr: 'A ∪ B' },
  { label: 'Intersection: A ∩ B', expr: 'A ∩ B' },
  { label: 'Difference: A \\ B', expr: 'A \\ B' },
  { label: 'Symm Diff: A △ B', expr: 'A △ B' },
  { label: "De Morgan: (A ∪ B)'", expr: "(A ∪ B)'" },
  { label: "Complement: A'", expr: "A'" },
];

const PRESETS_3 = [
  { label: 'Distributive: A ∩ (B ∪ C)', expr: 'A ∩ (B ∪ C)' },
  { label: 'Triple Union: A ∪ B ∪ C', expr: 'A ∪ B ∪ C' },
  { label: 'Triple Overlap: A ∩ B ∩ C', expr: 'A ∩ B ∩ C' },
  { label: 'Exclusive Pair: (A ∩ B) \\ C', expr: '(A ∩ B) \\ C' },
  { label: "De Morgan: (A ∪ B ∪ C)'", expr: "(A ∪ B ∪ C)'" },
  { label: 'All Pairs: (A ∩ B) ∪ (A ∩ C) ∪ (B ∩ C)', expr: '(A ∩ B) ∪ (A ∩ C) ∪ (B ∩ C)' },
];

export function ExpressionShadingPanel() {
  const {
    varCount,
    expressionText,
    parsedExpr,
    setExpressionText,
    insertSymbolIntoExpression,
  } = useVennLabStore();

  const presets = varCount === 2 ? PRESETS_2 : PRESETS_3;
  const canonicalExpr = parsedExpr && parsedExpr.valid
    ? formatCanonicalExpression(parsedExpr.shadedMasks, varCount)
    : '';

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Expression Input Card */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label htmlFor="set-expr-input" className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Set Expression</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              (Type with keyboard or use buttons below)
            </span>
          </label>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            {varCount} Sets Mode
          </span>
        </div>

        {/* Input Field */}
        <div className="relative flex items-center">
          <input
            id="set-expr-input"
            type="text"
            value={expressionText}
            onChange={(e) => setExpressionText(e.target.value)}
            placeholder={varCount === 2 ? 'e.g. A ∪ B, A \\ B, (A ∩ B)\'' : 'e.g. A ∩ (B ∪ C), A △ B'}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
          />
          {expressionText && (
            <button
              onClick={() => setExpressionText('')}
              className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Symbol Insert Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-medium mr-1 select-none">Symbols:</span>
          {QUICK_SYMBOLS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertSymbolIntoExpression(item.symbol)}
              title={item.desc}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-200 border border-slate-700/70 font-mono text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              {item.label}
            </button>
          ))}
          {/* Variable buttons */}
          <span className="text-slate-600 mx-1">|</span>
          <button
            type="button"
            onClick={() => insertSymbolIntoExpression('A')}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/50 font-mono text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => insertSymbolIntoExpression('B')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-mono text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
          >
            B
          </button>
          {varCount === 3 && (
            <button
              type="button"
              onClick={() => insertSymbolIntoExpression('C')}
              className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 font-mono text-xs font-bold hover:bg-amber-600 hover:text-white transition-all"
            >
              C
            </button>
          )}
        </div>

        {/* Validation or Canonical Representation Status */}
        {parsedExpr && !parsedExpr.valid ? (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-rose-200">Syntax Error</span>
              <span>{parsedExpr.error}</span>
            </div>
          </div>
        ) : parsedExpr && parsedExpr.valid ? (
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Valid Expression — Shading {parsedExpr.shadedMasks.length} Region(s)</span>
              </div>
              <span className="text-slate-400 font-mono">
                Boolean: <code className="text-indigo-200 font-mono">{parsedExpr.adaptedBoolExpr}</code>
              </span>
            </div>
            {canonicalExpr && (
              <div className="flex flex-col gap-1 pt-1 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                  Canonical Sum of Disjoint Regions:
                </span>
                <span className="font-mono text-emerald-300 break-words font-medium">
                  {canonicalExpr}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Presets List */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/70">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Quick Examples:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setExpressionText(p.expr)}
                className="px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
