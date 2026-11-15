'use client';

import React from 'react';
import { RegionMask, RegionShading, SetVarCount } from '../types';
import { getVennGeometry } from './venn-geometry';
import { RegionShape } from './RegionShape';
import { getRegionInfoList } from '../lib/regions';
import { Eye, EyeOff } from 'lucide-react';

interface VennDiagramProps {
  varCount: SetVarCount;
  shading: RegionShading;
  hoveredMask?: RegionMask | null;
  regionCounts?: Record<RegionMask, number>;
  interactive?: boolean;
  showLabels?: boolean;
  onToggleLabels?: () => void;
  onToggleRegion?: (mask: RegionMask) => void;
  onHoverRegion?: (mask: RegionMask | null) => void;
  customSetNames?: { A?: string; B?: string; C?: string };
}

export function VennDiagram({
  varCount,
  shading,
  hoveredMask = null,
  regionCounts,
  interactive = true,
  showLabels = false,
  onToggleLabels,
  onToggleRegion,
  onHoverRegion,
  customSetNames,
}: VennDiagramProps) {
  const geometry = getVennGeometry(varCount);
  const regionInfoList = getRegionInfoList(varCount);
  const regionInfoMap = new Map(regionInfoList.map((r) => [r.mask, r]));

  const viewBox = varCount === 2 ? '0 0 600 420' : '0 0 600 460';

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Venn Diagram Container */}
      <div className="relative w-full min-w-[320px] max-w-[560px] aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-slate-800 bg-slate-950/80 p-2 shadow-2xl">
        <svg
          viewBox={viewBox}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Universal Set (U) Boundary Rectangle */}
          <rect
            x="20"
            y="20"
            width="560"
            height={varCount === 2 ? 380 : 420}
            rx="16"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="1.5"
          />

          {/* Small Universal Set symbol in top-left corner */}
          <text
            x="36"
            y="48"
            className="text-base font-serif italic font-bold fill-slate-400 select-none"
          >
            U
          </text>

          {/* Render All Disjoint Regions */}
          {geometry.regions.map((reg) => {
            const info = regionInfoMap.get(reg.mask);
            const isShaded = Boolean(shading[reg.mask]);
            const isHovered = hoveredMask === reg.mask;
            const countDisplay = regionCounts ? regionCounts[reg.mask] : undefined;

            return (
              <RegionShape
                key={reg.mask}
                mask={reg.mask}
                pathD={reg.pathD}
                labelPosition={reg.labelPosition}
                label={info?.label ?? reg.defaultName}
                shortLabel={info?.shortLabel ?? reg.defaultName}
                isShaded={isShaded}
                isHovered={isHovered}
                showLabels={showLabels}
                countDisplay={countDisplay}
                interactive={interactive}
                onToggle={onToggleRegion}
                onHover={onHoverRegion}
              />
            );
          })}

          {/* Circle Boundary Outlines: 3 distinct colors with ~35% opacity stroke */}
          {geometry.circles.map((c) => {
            const displayName =
              c.id === 'A'
                ? customSetNames?.A || c.name
                : c.id === 'B'
                ? customSetNames?.B || c.name
                : customSetNames?.C || c.name;

            return (
              <g key={c.id} className="pointer-events-none">
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="none"
                  stroke={c.color}
                  strokeWidth="2.5"
                  strokeOpacity="0.45"
                />
                {/* Bold Set Name outside circle */}
                <text
                  x={c.labelPos.x}
                  y={c.labelPos.y}
                  textAnchor="middle"
                  className="text-base font-bold font-sans fill-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {displayName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Controls Toolbar under diagram */}
      <div className="w-full max-w-[560px] flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-400/50 shadow-sm shadow-indigo-500/50" />
          <span className="font-medium text-slate-300">Shaded = in result</span>
        </div>

        {onToggleLabels && (
          <button
            type="button"
            onClick={onToggleLabels}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {showLabels ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showLabels ? 'Hide labels' : 'Show labels'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
