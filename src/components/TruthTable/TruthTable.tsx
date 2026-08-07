'use client';

import React from 'react';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { Table, Check, X, Info } from 'lucide-react';

export function TruthTable() {
  const { analysisResult, activeInputValues } = useBooleanStudio();

  if (!analysisResult || !analysisResult.valid || !analysisResult.truthTable) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
        <p className="text-sm">Enter a valid Boolean expression above to generate the truth table.</p>
      </div>
    );
  }

  const { variables, rows } = analysisResult.truthTable;
  const totalRows = rows.length;
  const trueCount = rows.filter((r) => r.output).length;
  const falseCount = totalRows - trueCount;

  // Determine if a row matches active workspace input toggles
  const isRowActive = (rowInputs: Record<string, boolean>) => {
    return variables.every((v) => rowInputs[v] === activeInputValues[v]);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Table Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Table className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">Truth Table Evaluation</span>
          <span className="text-xs text-slate-500 font-mono">({variables.length} Variables → {totalRows} Combinations)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
            TRUE (1): {trueCount}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 font-medium border border-rose-500/20">
            FALSE (0): {falseCount}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-lg">
        <table className="w-full text-left border-collapse font-mono text-sm">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 uppercase tracking-wider text-xs">
              <th className="py-3 px-4 text-slate-500 w-12 text-center">#</th>
              {variables.map((v) => (
                <th key={v} className="py-3 px-4 font-bold text-indigo-300">
                  {v}
                </th>
              ))}
              <th className="py-3 px-4 font-bold text-emerald-400 bg-emerald-950/30 text-right">
                Output: {analysisResult.expression}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row, idx) => {
              const active = isRowActive(row.inputs);
              return (
                <tr
                  key={row.id}
                  className={`transition-colors hover:bg-indigo-600/10 ${
                    active
                      ? 'bg-indigo-950/40 border-l-4 border-indigo-500 font-bold text-white shadow-inner'
                      : idx % 2 === 0
                      ? 'bg-slate-950/40'
                      : 'bg-slate-900/30'
                  }`}
                >
                  <td className="py-3 px-4 text-center text-slate-500 text-xs font-mono">{idx + 1}</td>

                  {variables.map((v) => {
                    const val = row.inputs[v];
                    return (
                      <td key={v} className="py-3 px-4 font-mono">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            val
                              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {val ? '1' : '0'}
                        </span>
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-right font-mono">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        row.output
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {row.output ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{row.output ? '1 (TRUE)' : '0 (FALSE)'}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
        <Info className="w-3.5 h-3.5 text-indigo-400" />
        <span>Highlighted row corresponds to the active input signals in the Workspace control bar.</span>
      </div>
    </div>
  );
}
