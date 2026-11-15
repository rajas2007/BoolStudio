'use client';

import React, { useState } from 'react';
import { useVennLabStore } from '../store/useVennLabStore';
import { getRegionInfoList } from '../lib/regions';
import { Table, Check, X, ChevronDown, ChevronRight, ArrowLeftRight } from 'lucide-react';

export function TruthLinkPanel() {
  const {
    varCount,
    hoveredMask,
    setHoveredMask,
    parsedExpr,
    manualShading,
    activeTab,
  } = useVennLabStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const regionInfoList = getRegionInfoList(varCount);

  // Check shaded status from the single source of truth
  const isMaskShaded = (mask: number): boolean => {
    if (activeTab === 'manual') {
      return Boolean(manualShading[mask]);
    }
    if (parsedExpr && parsedExpr.valid) {
      return parsedExpr.shadedMasks.includes(mask);
    }
    return false;
  };

  const shadedCount = regionInfoList.filter((r) => isMaskShaded(r.mask)).length;

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-900/80 hover:bg-slate-800/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <Table className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-slate-200">
            Minterm Truth Table
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {shadedCount} of {regionInfoList.length} Shaded
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>{isExpanded ? 'Hide table' : 'Show table'}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-800 flex flex-col gap-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hovering a row highlights its region in the diagram</span>
            </span>
            <span className="font-mono text-indigo-300">
              MSB: A {varCount === 3 ? '→ B → C' : '→ B'}
            </span>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 text-center w-14 text-slate-500 font-bold">Minterm</th>
                  <th className="py-2.5 px-3 text-center text-indigo-300 font-bold">A</th>
                  <th className="py-2.5 px-3 text-center text-emerald-300 font-bold">B</th>
                  {varCount === 3 && (
                    <th className="py-2.5 px-3 text-center text-amber-300 font-bold">C</th>
                  )}
                  <th className="py-2.5 px-4 text-slate-300">Region Meaning</th>
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
                          ? 'bg-indigo-600/30 text-white'
                          : shaded
                          ? 'bg-indigo-950/25 text-slate-200'
                          : 'hover:bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      <td className="py-2 px-3 text-center text-slate-400 font-bold">
                        m{r.mask}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            r.inA ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-600'
                          }`}
                        >
                          {r.inA ? '1' : '0'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            r.inB ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-600'
                          }`}
                        >
                          {r.inB ? '1' : '0'}
                        </span>
                      </td>
                      {varCount === 3 && (
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              r.inC ? 'bg-amber-500/20 text-amber-300' : 'text-slate-600'
                            }`}
                          >
                            {r.inC ? '1' : '0'}
                          </span>
                        </td>
                      )}
                      <td className="py-2 px-4 font-sans font-medium text-xs text-slate-200">
                        <span className="font-mono text-indigo-300 mr-2">[{r.binaryString}]</span>
                        <span>{r.label}</span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {shaded ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                            <span>1</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                            <X className="w-3.5 h-3.5" />
                            <span>0</span>
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
      )}
    </div>
  );
}
