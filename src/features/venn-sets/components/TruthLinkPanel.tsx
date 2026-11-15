'use client';

import React from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { getRegionInfoList } from '../lib/regions';
import { Table, Check, X, ArrowLeftRight } from 'lucide-react';

export function TruthLinkPanel() {
  const {
    varCount,
    hoveredMask,
    setHoveredMask,
    parsedExpr,
    manualShading,
    activeTab,
  } = useVennLabStore();

  const regionInfoList = getRegionInfoList(varCount);

  // Check shaded status depending on active tab
  const isMaskShaded = (mask: number): boolean => {
    if (activeTab === 'manual') {
      return Boolean(manualShading[mask]);
    }
    if (parsedExpr && parsedExpr.valid) {
      return parsedExpr.shadedMasks.includes(mask);
    }
    return false;
  };

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2 text-slate-200">
          <Table className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Venn ↔ Truth Table Minterm Link
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
          <span>Hover row to highlight region</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-inner">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 text-center w-12 text-slate-500">Minterm</th>
              <th className="py-2.5 px-3 text-center text-indigo-300">A</th>
              <th className="py-2.5 px-3 text-center text-emerald-300">B</th>
              {varCount === 3 && (
                <th className="py-2.5 px-3 text-center text-amber-300">C</th>
              )}
              <th className="py-2.5 px-4 text-slate-300">Venn Region Meaning</th>
              <th className="py-2.5 px-3 text-right text-slate-300">Shaded</th>
            </tr>
          </thead>
          <tbody>
            {regionInfoList.map((r) => {
              const shaded = isMaskShaded(r.mask);
              const isHovered = hoveredMask === r.mask;

              return (
                <tr
                  key={r.mask}
                  onMouseEnter={() => setHoveredMask(r.mask)}
                  onMouseLeave={() => setHoveredMask(null)}
                  className={`border-b border-slate-900/80 transition-colors duration-150 cursor-pointer ${
                    isHovered
                      ? 'bg-indigo-600/25 text-white'
                      : shaded
                      ? 'bg-indigo-950/20 text-slate-200'
                      : 'hover:bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <td className="py-2 px-3 text-center text-slate-500 font-bold">
                    m{r.mask}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.inA ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-600'
                      }`}
                    >
                      {r.inA ? '1' : '0'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.inB ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-600'
                      }`}
                    >
                      {r.inB ? '1' : '0'}
                    </span>
                  </td>
                  {varCount === 3 && (
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          r.inC ? 'bg-amber-500/20 text-amber-300' : 'text-slate-600'
                        }`}
                      >
                        {r.inC ? '1' : '0'}
                      </span>
                    </td>
                  )}
                  <td className="py-2 px-4 font-sans font-medium text-xs text-slate-300">
                    <span className="font-mono text-indigo-300 mr-2">[{r.binaryString}]</span>
                    <span>{r.label}</span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {shaded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>TRUE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                        <X className="w-3.5 h-3.5" />
                        <span>FALSE</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
