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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch h-[560px]">
      {/* Left Column: Side-by-Side Diagram Visual Comparison & Verdict (~58%) */}
      <div className="lg:col-span-7 flex flex-col h-full rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600 gap-3">
        {/* Equivalence Verdict Banner */}
        {identityResult && (
          <div
            className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all shrink-0 ${
              identityResult.equivalent
                ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                : 'bg-rose-950/30 border-rose-500/40 shadow-sm shadow-rose-500/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {identityResult.equivalent ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span
                  className={`text-sm font-bold ${
                    identityResult.equivalent ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {identityResult.equivalent
                    ? 'Logically Equivalent (Identical Shading)'
                    : 'Not Equivalent (Distinguishable Shading)'}
                </span>
              </div>
              {identityResult.matchingLaw && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                  {identityResult.matchingLaw}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {identityResult.reason}
            </p>
          </div>
        )}

        {/* Side-by-Side Diagram Visual Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start flex-1">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-indigo-300 px-2.5 py-0.5 rounded-full bg-indigo-950/40 border border-indigo-800/40">
              LHS: {leftExprText || 'None'}
            </span>
            <div className="w-full">
              <VennDiagram
                varCount={varCount}
                shading={leftShading}
                interactive={false}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40">
              RHS: {rightExprText || 'None'}
            </span>
            <div className="w-full">
              <VennDiagram
                varCount={varCount}
                shading={rightShading}
                interactive={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Inputs & Classic Presets Selector (~42%) */}
      <div className="lg:col-span-5 flex flex-col h-full rounded-2xl glass-panel border border-slate-800/80 bg-slate-950/70 p-4 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600 gap-4">
        {/* Inputs for Left and Right expressions */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="p-3 rounded-xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Left Side Expression</span>
              <span className="text-indigo-400 font-mono font-bold text-[11px]">LHS</span>
            </label>
            <input
              type="text"
              value={leftExprText}
              onChange={(e) => setIdentityExpressions(e.target.value, rightExprText)}
              placeholder="e.g. (A ∪ B)'"
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="p-3 rounded-xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Right Side Expression</span>
              <span className="text-emerald-400 font-mono font-bold text-[11px]">RHS</span>
            </label>
            <input
              type="text"
              value={rightExprText}
              onChange={(e) => setIdentityExpressions(leftExprText, e.target.value)}
              placeholder="e.g. A' ∩ B'"
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Preset Selector */}
        <div className="p-3 rounded-xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Identity Presets</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {presetsForCount.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presetsForCount.map((preset) => {
              const isSelected = selectedPresetName === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyIdentityPreset(preset.name)}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                      {preset.name}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {preset.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 font-mono text-[11px] text-emerald-300">
                    <span>{preset.leftExpr}</span>
                    <span className="text-slate-500">=</span>
                    <span>{preset.rightExpr}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
