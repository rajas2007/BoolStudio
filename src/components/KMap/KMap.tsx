'use client';

import React from 'react';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { Grid, AlertTriangle, Sparkles, Tag } from 'lucide-react';

export function KMap() {
  const { analysisResult } = useBooleanStudio();

  if (!analysisResult || !analysisResult.valid || !analysisResult.kmap) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
        <p className="text-sm">Enter a valid Boolean expression to generate the Karnaugh Map.</p>
      </div>
    );
  }

  const { kmap } = analysisResult;

  // Handle > 4 variable rule limit
  if (kmap.exceedsLimit) {
    return (
      <div className="w-full p-8 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-amber-200 flex flex-col items-center justify-center text-center gap-3 shadow-lg">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg text-amber-300">K-Map Variable Limit Exceeded</h3>
        <p className="text-sm text-amber-300/80 max-w-lg">
          {kmap.message ||
            'Karnaugh Maps support a maximum of 4 variables. This expression contains more than four variables, so K-Map generation is unavailable.'}
        </p>
        <div className="text-xs text-amber-400/60 font-mono mt-2">
          Detected: {kmap.numVariables} variables ({analysisResult.variables.join(', ')})
        </div>
      </div>
    );
  }

  const { rowVars, colVars, rowHeaders, colHeaders, grid, groups, simplifiedExpression } = kmap;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Simplified Result */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Grid className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Karnaugh Map Reduction</span>
          <span className="text-xs text-slate-500 font-mono">({kmap.numVariables} Variables Grid)</span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>K-Map Simplified:</span>
          <span className="font-bold text-emerald-400 text-sm">{simplifiedExpression || '0'}</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl flex flex-col items-center justify-center">
        <div className="inline-block">
          {/* Header Variable Indicator */}
          <div className="flex justify-between items-center mb-3 text-xs font-mono text-slate-400 px-2">
            <span className="text-indigo-400 font-bold">
              Rows: {rowVars.join('') || '—'}
            </span>
            <span className="text-emerald-400 font-bold">
              Cols: {colVars.join('') || '—'}
            </span>
          </div>

          <table className="border-collapse font-mono text-center select-none">
            <thead>
              <tr>
                {/* Top-left diagonal divider cell */}
                <th className="p-3 bg-slate-900 border border-slate-800 text-slate-500 text-xs">
                  {rowVars.join('') || ''} \ {colVars.join('') || ''}
                </th>
                {colHeaders.map((colHeader, cIdx) => (
                  <th
                    key={cIdx}
                    className="p-3 min-w-[70px] bg-slate-900/90 border border-slate-800 text-emerald-300 font-bold text-sm"
                  >
                    {colHeader}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-3 min-h-[60px] bg-slate-900/90 border border-slate-800 text-indigo-300 font-bold text-sm">
                    {rowHeaders[rIdx]}
                  </td>
                  {row.map((cell, cIdx) => {
                    const activeGroups = cell.groupIndices.map((gIdx) => groups[gIdx]).filter(Boolean);
                    const bgStyle =
                      activeGroups.length > 0
                        ? activeGroups[0].color
                        : cell.value
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(30, 41, 59, 0.4)';

                    return (
                      <td
                        key={cIdx}
                        style={{ backgroundColor: bgStyle }}
                        className={`p-4 border border-slate-800/80 transition-all duration-200 relative ${
                          cell.value ? 'font-bold text-white shadow-inner' : 'text-slate-500'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className={`text-base ${cell.value ? 'text-emerald-400 font-extrabold' : 'text-slate-600'}`}>
                            {cell.value ? '1' : '0'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal mt-0.5">m{cell.minterm}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Implicant Legends */}
      {groups.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Minterm Group Coverings:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950/70 text-xs font-mono"
              >
                <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: group.color }} />
                <span className="font-bold text-white">{group.term}</span>
                <span className="text-slate-400 text-[11px]">(m{group.minterms.join(', m')})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
