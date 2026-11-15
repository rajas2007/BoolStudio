'use client';

import React from 'react';
import { RegionMask, RegionShading, SetVarCount } from '../types';
import { getVennGeometry } from './venn-geometry';
import { RegionShape } from './RegionShape';
import { getRegionInfoList } from '../lib/regions';

interface VennDiagramProps {
  varCount: SetVarCount;
  shading: RegionShading;
  hoveredMask?: RegionMask | null;
  regionCounts?: Record<RegionMask, number>;
  interactive?: boolean;
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
  onToggleRegion,
  onHoverRegion,
  customSetNames,
}: VennDiagramProps) {
  const geometry = getVennGeometry(varCount);
  const regionInfoList = getRegionInfoList(varCount);
  const regionInfoMap = new Map(regionInfoList.map((r) => [r.mask, r]));

  const viewBox = varCount === 2 ? '0 0 600 420' : '0 0 600 460';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[620px] aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-slate-800/80 bg-slate-950/70 p-3 flex items-center justify-center shadow-xl">
        <svg
          viewBox={viewBox}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Universal Set Rectangle Label */}
          <text
            x="38"
            y="50"
            className="text-xs font-mono font-bold fill-slate-400 select-none"
          >
            Universal Set (U)
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
                countDisplay={countDisplay}
                interactive={interactive}
                onToggle={onToggleRegion}
                onHover={onHoverRegion}
              />
            );
          })}

          {/* Circle Boundary Outlines (rendered on top for crisp visual distinction) */}
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
                  strokeOpacity="0.85"
                />
                {/* Set Title Pill */}
                <text
                  x={c.labelPos.x}
                  y={c.labelPos.y}
                  textAnchor="middle"
                  className="text-sm font-bold font-sans fill-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {displayName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
