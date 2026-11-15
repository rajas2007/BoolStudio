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
  showLabels?: boolean;
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
  showLabels = false,
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

  // Visual appearance:
  // Shaded: vibrant, opaque indigo fill so it pops clearly against dark background
  // Unshaded: near-transparent
  let fill = 'rgba(15, 23, 42, 0.15)';
  let stroke = 'rgba(148, 163, 184, 0.25)';
  let strokeWidth = 1.5;

  if (isShaded) {
    fill = isHovered ? 'rgba(99, 102, 241, 0.9)' : 'rgba(99, 102, 241, 0.75)';
    stroke = '#c7d2fe'; // indigo-200
    strokeWidth = 2.5;
  } else if (isHovered) {
    fill = 'rgba(99, 102, 241, 0.25)';
    stroke = '#818cf8';
    strokeWidth = 2;
  }

  // Outside universe mask (mask 0)
  if (mask === 0 && !isShaded && !isHovered) {
    fill = 'rgba(2, 6, 23, 0.1)';
    stroke = 'rgba(71, 85, 105, 0.25)';
  }

  const shouldShowText = countDisplay !== undefined && countDisplay !== null ? true : showLabels;

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

      {/* Region Label or Count only if toggled or count provided */}
      {shouldShowText && (
        <g
          transform={`translate(${labelPosition.x}, ${labelPosition.y})`}
          className="pointer-events-none select-none"
        >
          {countDisplay !== undefined && countDisplay !== null ? (
            <>
              <rect
                x="-22"
                y="-13"
                width="44"
                height="26"
                rx="6"
                fill="rgba(15, 23, 42, 0.9)"
                stroke={isShaded ? '#a5b4fc' : 'rgba(255, 255, 255, 0.2)'}
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
              className={`text-[12px] font-sans font-bold transition-colors duration-150 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                isShaded ? 'fill-white' : 'fill-slate-300'
              }`}
            >
              {shortLabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
