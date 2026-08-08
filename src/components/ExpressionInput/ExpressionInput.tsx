'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { Play, AlertCircle, CheckCircle2, Sparkles, HelpCircle, Share2, Check } from 'lucide-react';

const PRESET_EXAMPLES = [
  { label: 'Basic AND/NOT', expr: '(A & B) | (!C)' },
  { label: 'XOR Gate', expr: 'A ^ B' },
  { label: 'NAND Gate', expr: 'A NAND B' },
  { label: 'NOR Gate', expr: 'A NOR B' },
  { label: 'Implication', expr: 'A -> B' },
  { label: 'Biconditional', expr: 'A <=> B' },
  { label: 'De Morgan Demo', expr: '!(A | B)' },
  { label: '4-Variable Circuit', expr: '(A & B) | (!C & D)' },
];

const LOGIC_GATES = [
  { symbol: '&', label: 'AND', description: 'Conjunction (Shift+7)' },
  { symbol: '|', label: 'OR', description: 'Disjunction (Shift+\\)' },
  { symbol: '!', label: 'NOT', description: 'Negation (Shift+1)' },
  { symbol: '^', label: 'XOR', description: 'Exclusive OR (Shift+6)' },
  { symbol: 'NAND', label: 'NAND', description: 'Not AND' },
  { symbol: 'NOR', label: 'NOR', description: 'Not OR' },
  { symbol: 'XNOR', label: 'XNOR', description: 'Exclusive NOR' },
];

const PROPOSITIONAL_OPS = [
  { symbol: '->', label: 'IMPLIES', description: 'Implication' },
  { symbol: '<=>', label: 'IFF', description: 'Biconditional' },
];

const GROUPING_OPS = [
  { symbol: '(', label: '(', description: 'Open parenthesis' },
  { symbol: ')', label: ')', description: 'Close parenthesis' },
];

export function ExpressionInput() {
  const searchParams = useSearchParams();
  const { expression, setExpression, generateAnalysis, analysisResult, isEvaluating } = useBooleanStudio();
  const [localExpr, setLocalExpr] = useState(expression);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if query parameter `expr` exists in URL on mount
    const paramExpr = searchParams.get('expr');
    if (paramExpr && paramExpr.trim() !== '') {
      setLocalExpr(paramExpr);
      setExpression(paramExpr);
      generateAnalysis(paramExpr);
    } else {
      generateAnalysis(expression);
    }
  }, []);

  const updateURL = (exprToShare: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (exprToShare.trim()) {
        url.searchParams.set('expr', exprToShare);
      } else {
        url.searchParams.delete('expr');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setExpression(localExpr);
    generateAnalysis(localExpr);
    updateURL(localExpr);
  };

  const insertSymbol = (sym: string) => {
    setLocalExpr((prev) => prev + sym);
  };

  const handleSelectPreset = (expr: string) => {
    setLocalExpr(expr);
    setExpression(expr);
    generateAnalysis(expr);
    updateURL(expr);
  };

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('expr', localExpr);
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-xl">
      <div className="flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <label htmlFor="boolean-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Enter Boolean Expression</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareLink}
              title="Copy shareable link for this expression"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
            </button>
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">Supported: & | ! ^ NAND NOR XNOR -{'>'} {'<=>'} ( )</span>
          </div>
        </div>

        {/* Input Bar & Action Buttons */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              id="boolean-input"
              type="text"
              value={localExpr}
              onChange={(e) => setLocalExpr(e.target.value)}
              placeholder="e.g. (A & B) | (!C)"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
            />
            {analysisResult && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {analysisResult.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isEvaluating}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isEvaluating ? 'Evaluating...' : 'Generate Results'}</span>
          </button>
        </form>

        {/* Quick Operator Insertion Toolbar */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2 w-32">Logic Gates</span>
            {LOGIC_GATES.map((op) => (
              <button
                key={op.symbol}
                type="button"
                onClick={() => insertSymbol(op.symbol)}
                title={op.description}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 hover:border-indigo-500/50 font-mono text-sm font-bold transition-colors"
              >
                {op.symbol} <span className="text-[10px] font-sans text-slate-400 font-normal ml-0.5">({op.label})</span>
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2 w-32">Propositional Logic</span>
            {PROPOSITIONAL_OPS.map((op) => (
              <button
                key={op.symbol}
                type="button"
                onClick={() => insertSymbol(op.symbol)}
                title={op.description}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 text-emerald-300 border border-slate-700 hover:border-emerald-500/50 font-mono text-sm font-bold transition-colors"
              >
                {op.symbol} <span className="text-[10px] font-sans text-slate-400 font-normal ml-0.5">({op.label})</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2 w-32">Grouping</span>
            {GROUPING_OPS.map((op) => (
              <button
                key={op.symbol}
                type="button"
                onClick={() => insertSymbol(op.symbol)}
                title={op.description}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-600/30 text-slate-300 border border-slate-700 hover:border-slate-500/50 font-mono text-sm font-bold transition-colors"
              >
                {op.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Status / Error Banner */}
        {analysisResult && !analysisResult.valid && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Syntax Error:</span> {analysisResult.error}
            </div>
          </div>
        )}

        {/* Detected Variables & Example Presets */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">Detected Variables:</span>
            {analysisResult?.variables && analysisResult.variables.length > 0 ? (
              analysisResult.variables.map((v) => (
                <span
                  key={v}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30"
                >
                  {v}
                </span>
              ))
            ) : (
              <span className="text-slate-500 font-mono">None</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Presets:
            </span>
            {PRESET_EXAMPLES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectPreset(item.expr)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
