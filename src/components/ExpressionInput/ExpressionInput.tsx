'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import {
  Play,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Share2,
  Check,
  ChevronDown,
  Cpu,
  X,
} from 'lucide-react';

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
  { symbol: '&', label: 'AND' },
  { symbol: '|', label: 'OR' },
  { symbol: '!', label: 'NOT' },
  { symbol: '^', label: 'XOR' },
  { symbol: 'NAND', label: 'NAND' },
  { symbol: 'NOR', label: 'NOR' },
  { symbol: 'XNOR', label: 'XNOR' },
];

const PROPOSITIONAL_OPS = [
  { symbol: '->', label: 'IMPLIES' },
  { symbol: '<=>', label: 'IFF' },
];

const GROUPING_OPS = [
  { symbol: '(' },
  { symbol: ')' },
];

export function ExpressionInput() {
  const searchParams = useSearchParams();
  const { expression, setExpression, generateAnalysis, analysisResult, isEvaluating } = useBooleanStudio();
  const paramExpr = searchParams.get('expr');
  const [localExpr, setLocalExpr] = useState(paramExpr && paramExpr.trim() !== '' ? paramExpr : expression);
  const [copied, setCopied] = useState(false);
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  useEffect(() => {
    const urlExpr = searchParams.get('expr');
    if (urlExpr && urlExpr.trim() !== '') {
      setExpression(urlExpr);
      generateAnalysis(urlExpr);
    } else {
      generateAnalysis(expression);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setPresetMenuOpen(false);
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
    <div className="w-full flex flex-col gap-2">
      {/* Studio Header & Expression Toolbar (~44px) */}
      <div className="w-full px-3.5 py-2 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 shadow-xl">
        {/* Left: Branding & Unit Badge */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight hidden sm:inline">Boolean Studio</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            Unit 1
          </span>
        </div>

        {/* Center: Expression Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 max-w-xl min-w-[280px]">
          <div className="relative flex-1">
            <input
              id="boolean-input"
              type="text"
              value={localExpr}
              onChange={(e) => setLocalExpr(e.target.value)}
              placeholder="e.g. (A & B) | (!C), A ^ B, A -> B"
              className="w-full pl-3.5 pr-8 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
            />
            {localExpr && (
              <button
                type="button"
                onClick={() => setLocalExpr('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isEvaluating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isEvaluating ? 'Evaluating...' : 'Evaluate'}</span>
          </button>
        </form>

        {/* Right: Presets Dropdown & Share Button */}
        <div className="flex items-center gap-1.5">
          {/* Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPresetMenuOpen(!presetMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Presets</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {presetMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 p-1.5 rounded-xl glass-panel border border-slate-700 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Standard Circuit Presets
                </div>
                <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5 p-0.5">
                  {PRESET_EXAMPLES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSelectPreset(item.expr)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-800/80 transition-colors flex flex-col"
                    >
                      <span className="text-xs font-bold text-slate-100">{item.label}</span>
                      <span className="text-[10px] font-mono text-emerald-400 truncate">{item.expr}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share Link Button */}
          <button
            type="button"
            onClick={handleShareLink}
            title="Copy shareable link"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Operators Ribbon & Detected Variables (~34px) */}
      <div className="w-full px-3 py-1 rounded-xl glass-panel border border-slate-800/80 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Quick Operator Chips */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 mr-0.5">Gates:</span>
          {LOGIC_GATES.map((op) => (
            <button
              key={op.symbol}
              type="button"
              onClick={() => insertSymbol(op.symbol)}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 border border-slate-800 hover:border-indigo-500/50 font-mono text-xs font-bold transition-colors"
            >
              {op.symbol}
            </button>
          ))}

          <span className="text-slate-700 mx-0.5">|</span>

          <span className="text-[11px] font-semibold text-slate-500 mr-0.5">Logic:</span>
          {PROPOSITIONAL_OPS.map((op) => (
            <button
              key={op.symbol}
              type="button"
              onClick={() => insertSymbol(op.symbol)}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-emerald-600/30 text-emerald-300 border border-slate-800 hover:border-emerald-500/50 font-mono text-xs font-bold transition-colors"
            >
              {op.symbol}
            </button>
          ))}

          <span className="text-slate-700 mx-0.5">|</span>

          {GROUPING_OPS.map((op) => (
            <button
              key={op.symbol}
              type="button"
              onClick={() => insertSymbol(op.symbol)}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-800 font-mono text-xs font-bold transition-colors"
            >
              {op.symbol}
            </button>
          ))}
        </div>

        {/* Right: Detected Variables & Inline Validation */}
        <div className="flex items-center gap-2">
          {analysisResult && (
            <div className="flex items-center gap-1.5">
              {analysisResult.valid ? (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{analysisResult.error}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <span className="text-[11px] text-slate-500">Vars:</span>
            {analysisResult?.variables && analysisResult.variables.length > 0 ? (
              analysisResult.variables.map((v) => (
                <span
                  key={v}
                  className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px] border border-indigo-500/30"
                >
                  {v}
                </span>
              ))
            ) : (
              <span className="text-slate-500 font-mono text-[10px]">None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
