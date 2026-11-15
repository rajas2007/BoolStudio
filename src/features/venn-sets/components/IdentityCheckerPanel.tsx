'use client';

import React from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { SET_IDENTITY_PRESETS } from '../lib/identities';
import { masksToShadingMap } from '../lib/shading';
import { VennDiagram } from './VennDiagram';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export function IdentityCheckerPanel() {
  const {
    varCount,
    leftExprText,
    rightExprText,
    identityResult,
    selectedPresetName,
    setIdentityExpressions,
    applyIdentityPreset,
  } = useVennLabStore();

  const presetsForCount = SET_IDENTITY_PRESETS.filter((p) => p.varCount === varCount);

  const leftShading = identityResult && identityResult.leftValid
    ? masksToShadingMap(identityResult.leftShaded, varCount)
    : masksToShadingMap([], varCount);

  const rightShading = identityResult && identityResult.rightValid
    ? masksToShadingMap(identityResult.rightShaded, varCount)
    : masksToShadingMap([], varCount);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Preset Selector */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Classic Set Identities Presets</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {presetsForCount.length} Presets Available for {varCount} Sets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {presetsForCount.map((preset) => {
            const isSelected = selectedPresetName === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyIdentityPreset(preset.name)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {preset.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {preset.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-emerald-300">
                  <span>{preset.leftExpr}</span>
                  <span className="text-slate-500">=</span>
                  <span>{preset.rightExpr}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs for Left and Right expressions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Expression */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Left Side Expression</span>
            <span className="text-indigo-400 font-mono font-bold">LHS</span>
          </label>
          <input
            type="text"
            value={leftExprText}
            onChange={(e) => setIdentityExpressions(e.target.value, rightExprText)}
            placeholder="e.g. (A ∪ B)'"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Right Expression */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Right Side Expression</span>
            <span className="text-emerald-400 font-mono font-bold">RHS</span>
          </label>
          <input
            type="text"
            value={rightExprText}
            onChange={(e) => setIdentityExpressions(leftExprText, e.target.value)}
            placeholder="e.g. A' ∩ B'"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Equivalence Verdict Banner */}
      {identityResult && (
        <div
          className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
            identityResult.equivalent
              ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
              : 'bg-rose-950/30 border-rose-500/40 shadow-lg shadow-rose-500/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {identityResult.equivalent ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
              <span
                className={`text-base font-bold ${
                  identityResult.equivalent ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {identityResult.equivalent
                  ? 'Identical Set Expressions (Logically Equivalent)'
                  : 'Not Equivalent (Distinguishable Shading)'}
              </span>
            </div>
            {identityResult.matchingLaw && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                {identityResult.matchingLaw}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-7">
            {identityResult.reason}
          </p>
        </div>
      )}

      {/* Side-by-Side Diagram Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono font-bold text-indigo-300 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/40">
            LHS: {leftExprText || 'None'}
          </span>
          <div className="w-full max-w-[420px]">
            <VennDiagram
              varCount={varCount}
              shading={leftShading}
              interactive={false}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-300 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40">
            RHS: {rightExprText || 'None'}
          </span>
          <div className="w-full max-w-[420px]">
            <VennDiagram
              varCount={varCount}
              shading={rightShading}
              interactive={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
