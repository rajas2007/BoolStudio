'use client';

import React, { useId } from 'react';
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
  const reactId = useId();
  // Safe SVG ID prefix without colons
  const idPrefix = `venn-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const geometry = getVennGeometry(varCount);
  const regionInfoList = getRegionInfoList(varCount);
  const regionInfoMap = new Map(regionInfoList.map((r) => [r.mask, r]));

  const { width, height, viewBox, circles, regions, setNames } = geometry;

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Venn Diagram Container */}
      <div className="relative w-full min-w-[320px] max-w-[560px] aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-slate-800 bg-slate-950/80 p-2 shadow-2xl">
        <svg
          viewBox={viewBox}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Exact Venn Circle Clip Paths and Inverted Circle Masks */}
          <defs>
            {circles.map((c) => (
              <React.Fragment key={c.id}>
                {/* Kept when bit is 1 (inside this circle) */}
                <clipPath id={`${idPrefix}-clip${c.id}`}>
                  <circle cx={c.cx} cy={c.cy} r={c.r} />
                </clipPath>

                {/* Kept when bit is 0 (outside this circle: white background, black circle cutout) */}
                <mask id={`${idPrefix}-not${c.id}`}>
                  <rect width={width} height={height} fill="white" />
                  <circle cx={c.cx} cy={c.cy} r={c.r} fill="black" />
                </mask>
              </React.Fragment>
            ))}
          </defs>

          {/* Universal Set (U) Boundary Rectangle */}
          <rect
            x="12"
            y="12"
            width={width - 24}
            height={height - 24}
            rx="14"
            fill="none"
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth="1.5"
          />

          {/* Small Universal Set symbol in top-left corner */}
          <text
            x="24"
            y="36"
            className="text-sm font-serif italic font-bold fill-slate-400 select-none"
          >
            U
          </text>

          {/* Render All 8 (or 4) Disjoint Regions via Exact ClipPath + Mask Composition */}
          {regions.map((reg) => {
            const info = regionInfoMap.get(reg.mask);
            const isShaded = Boolean(shading[reg.mask]);
            const isHovered = hoveredMask === reg.mask;

            return (
              <RegionShape
                key={reg.mask}
                mask={reg.mask}
                bits={reg.bits}
                setNames={setNames}
                idPrefix={idPrefix}
                width={width}
                height={height}
                label={info?.label ?? reg.defaultName}
                isShaded={isShaded}
                isHovered={isHovered}
                interactive={interactive}
                onToggle={onToggleRegion}
                onHover={onHoverRegion}
              />
            );
          })}

          {/* Circle Boundary Outlines Drawn on Top */}
          {circles.map((c) => {
            const displayName =
              c.id === 'A'
                ? customSetNames?.A || c.name
                : c.id === 'B'
                ? customSetNames?.B || c.name
                : customSetNames?.C || c.name;

            return (
              <g key={c.id} className="pointer-events-none select-none">
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="none"
                  stroke={c.strokeColor}
                  strokeWidth="2.5"
                  strokeOpacity="0.45"
                />
                {/* Bold Set Name Outside Circle */}
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

          {/* Region Label / Count Chips (Shown when toggled or count provided) */}
          {regions.map((reg) => {
            const count = regionCounts ? regionCounts[reg.mask] : undefined;
            const shouldShow =
              count !== undefined && count !== null ? true : showLabels;
            if (!shouldShow) return null;

            const info = regionInfoMap.get(reg.mask);
            const displayText =
              count !== undefined ? String(count) : info?.shortLabel ?? reg.defaultName;

            return (
              <g
                key={`label-${reg.mask}`}
                transform={`translate(${reg.labelPosition.x}, ${reg.labelPosition.y})`}
                className="pointer-events-none select-none"
              >
                <rect
                  x={-24}
                  y={-11}
                  width={48}
                  height={22}
                  rx={6}
                  fill="rgba(2, 6, 23, 0.85)"
                  stroke="rgba(148, 163, 184, 0.4)"
                  strokeWidth={1}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-semibold font-mono fill-slate-100"
                >
                  {displayText}
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
            {showLabels ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            <span>{showLabels ? 'Hide labels' : 'Show labels'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
