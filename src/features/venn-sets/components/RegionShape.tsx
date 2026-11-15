'use client';

import React from 'react';
import { RegionMask } from '../types';

interface RegionShapeProps {
  mask: RegionMask;
  pathD: string;
  labelPosition: { x: number; y: number };
  label: string;
  shortLabel: string;
  isShaded: boolean;
  isHovered: boolean;
  countDisplay?: number | null;
  interactive?: boolean;
  onToggle?: (mask: RegionMask) => void;
  onHover?: (mask: RegionMask | null) => void;
}

export function RegionShape({
  mask,
  pathD,
  labelPosition,
  label,
  shortLabel,
  isShaded,
  isHovered,
  countDisplay,
  interactive = true,
  onToggle,
  onHover,
}: RegionShapeProps) {
  const handleClick = () => {
    if (interactive && onToggle) {
      onToggle(mask);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (onToggle) onToggle(mask);
    }
  };

  // Determine styling based on shading and hover states
  let fill = 'rgba(15, 23, 42, 0.4)'; // subtle slate dark fill
  let stroke = 'rgba(148, 163, 184, 0.25)'; // slate-400 subtle outline
  let strokeWidth = 1.5;

  if (isShaded) {
    fill = isHovered ? 'rgba(99, 102, 241, 0.75)' : 'rgba(99, 102, 241, 0.55)';
    stroke = '#a5b4fc'; // indigo-300
    strokeWidth = 2;
  } else if (isHovered) {
    fill = 'rgba(99, 102, 241, 0.25)';
    stroke = '#818cf8';
    strokeWidth = 2;
  }

  // Special outside background styling
  if (mask === 0 && !isShaded && !isHovered) {
    fill = 'rgba(2, 6, 23, 0.3)';
    stroke = 'rgba(71, 85, 105, 0.3)';
  }

  return (
    <g
      className={`transition-all duration-150 ${interactive ? 'cursor-pointer focus:outline-none' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover && onHover(mask)}
      onMouseLeave={() => onHover && onHover(null)}
      tabIndex={interactive ? 0 : -1}
      role={interactive ? 'button' : undefined}
      aria-label={`${label}: ${isShaded ? 'Shaded' : 'Unshaded'}${countDisplay !== undefined ? `, Count: ${countDisplay}` : ''}`}
    >
      <title>{`${label}${countDisplay !== undefined ? ` (Count: ${countDisplay})` : ''}`}</title>
      <path
        d={pathD}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fillRule="evenodd"
        className="transition-colors duration-150"
      />

      {/* Region Center Label or Count */}
      <g
        transform={`translate(${labelPosition.x}, ${labelPosition.y})`}
        className="pointer-events-none select-none"
      >
        {countDisplay !== undefined && countDisplay !== null ? (
          <>
            {/* Pill backdrop for number */}
            <rect
              x="-24"
              y="-14"
              width="48"
              height="28"
              rx="8"
              fill="rgba(15, 23, 42, 0.85)"
              stroke={isShaded ? '#818cf8' : 'rgba(255, 255, 255, 0.15)'}
              strokeWidth="1"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-mono font-bold fill-white"
            >
              {countDisplay}
            </text>
          </>
        ) : (
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className={`text-[11px] font-mono font-semibold transition-colors duration-150 ${
              isShaded ? 'fill-white' : 'fill-slate-400'
            }`}
          >
            {shortLabel}
          </text>
        )}
      </g>
    </g>
  );
}
