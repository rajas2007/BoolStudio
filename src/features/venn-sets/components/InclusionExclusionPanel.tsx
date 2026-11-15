'use client';

import React from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { AlertCircle, CheckCircle2, Calculator } from 'lucide-react';

export function InclusionExclusionPanel() {
  const { varCount, pieInput, pieResult, setPieInput } = useVennLabStore();

  const handleNumChange = (field: keyof typeof pieInput, valStr: string) => {
    const parsed = valStr === '' ? 0 : parseInt(valStr, 10);
    setPieInput({ [field]: isNaN(parsed) ? 0 : parsed });
  };

  const handleUniversalChange = (valStr: string) => {
    if (valStr.trim() === '') {
      setPieInput({ universal: undefined });
    } else {
      const parsed = parseInt(valStr, 10);
      setPieInput({ universal: isNaN(parsed) ? undefined : parsed });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Input Form Card */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Cardinality Inputs ({varCount} Sets)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Values update the Venn diagram numbers live
          </span>
        </div>

        {/* Universal Set & Single Sets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              |U| <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={pieInput.universal ?? ''}
              onChange={(e) => handleUniversalChange(e.target.value)}
              placeholder="e.g. 100"
              className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-indigo-300">
              |A| (Set A)
            </label>
            <input
              type="number"
              min="0"
              value={pieInput.cardA}
              onChange={(e) => handleNumChange('cardA', e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-950/80 border border-indigo-700/60 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-emerald-300">
              |B| (Set B)
            </label>
            <input
              type="number"
              min="0"
              value={pieInput.cardB}
              onChange={(e) => handleNumChange('cardB', e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-950/80 border border-emerald-700/60 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {varCount === 3 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-amber-300">
                |C| (Set C)
              </label>
              <input
                type="number"
                min="0"
                value={pieInput.cardC ?? 0}
                onChange={(e) => handleNumChange('cardC', e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950/80 border border-amber-700/60 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          )}
        </div>

        {/* Pairwise & Triple Intersections */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Intersection Sizes
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                |A ∩ B|
              </label>
              <input
                type="number"
                min="0"
                value={pieInput.cardA_B}
                onChange={(e) => handleNumChange('cardA_B', e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            {varCount === 3 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    |A ∩ C|
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pieInput.cardA_C ?? 0}
                    onChange={(e) => handleNumChange('cardA_C', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    |B ∩ C|
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pieInput.cardB_C ?? 0}
                    onChange={(e) => handleNumChange('cardB_C', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-amber-300 font-mono">
                    |A ∩ B ∩ C|
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pieInput.cardA_B_C ?? 0}
                    onChange={(e) => handleNumChange('cardA_B_C', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-950/80 border border-amber-500/50 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Validation Violations (if inconsistent) */}
      {!pieResult.valid && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-600/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Inconsistent Cardinalities Detected</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-rose-200 pl-2">
            {pieResult.violations.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step-by-Step Mathematical Derivations */}
      {pieResult.valid && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-slate-900/40 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                Principle of Inclusion-Exclusion Breakdown
              </span>
            </div>
            <div className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
              Total Union = {pieResult.unionCount}
            </div>
          </div>

          {/* Formula expansions */}
          <div className="flex flex-col gap-2 font-mono text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400">
              <span className="text-indigo-400 font-bold">1. General Formula:</span>{' '}
              {pieResult.steps.formulaSymbolic}
            </div>
            <div className="text-slate-300">
              <span className="text-indigo-400 font-bold">2. Substitution:</span>{' '}
              {pieResult.steps.formulaSubstituted}
            </div>
            <div className="text-emerald-300 font-bold text-sm pt-1">
              <span className="text-indigo-400">3. Union Result:</span>{' '}
              {pieResult.steps.formulaEvaluated}
            </div>
            {pieResult.outsideCount !== null && (
              <div className="text-sky-300 font-bold pt-1 border-t border-slate-800">
                Outside |U \ Union| = {pieInput.universal} − {pieResult.unionCount} = {pieResult.outsideCount}
              </div>
            )}
          </div>

          {/* Disjoint Region Derivations Grid */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Exact Disjoint Region Decomposition (Inside-Out Derivation):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pieResult.steps.regionDerivations.map((step) => (
                <div
                  key={step.mask}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs font-mono"
                >
                  <span className="text-slate-400">{step.label}:</span>
                  <span className="text-emerald-300 font-semibold">{step.equation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
