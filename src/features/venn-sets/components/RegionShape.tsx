'use client';

import React from 'react';
import { RegionMask } from '../types';

interface RegionShapeProps {
  mask: RegionMask;
  bits: number[];
  setNames: string[];
  idPrefix: string;
  width: number;
  height: number;
  label: string;
  isShaded: boolean;
  isHovered: boolean;
  interactive?: boolean;
  onToggle?: (mask: RegionMask) => void;
  onHover?: (mask: RegionMask | null) => void;
}

export function RegionShape({
  mask,
  bits,
  setNames,
  idPrefix,
  width,
  height,
  label,
  isShaded,
  isHovered,
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

  // Region fill colors:
  // - Shaded: vibrant indigo (#6366f1) or lighter hover (#818cf8)
  // - Unshaded + hovered: soft indigo preview (rgba(99, 102, 241, 0.25))
  // - Unshaded: transparent (with minimal alpha to reliably receive pointer events)
  let fill = 'rgba(15, 23, 42, 0.001)';
  if (isShaded) {
    fill = isHovered ? '#818cf8' : '#6366f1';
  } else if (isHovered) {
    fill = 'rgba(99, 102, 241, 0.25)';
  }

  // Construct nested clipPath / mask hierarchy:
  // For each set:
  // If bits[i] === 1: keep inside circle (clip-path = #clipX)
  // If bits[i] === 0: keep outside circle (mask = #notX)
  let content: React.ReactNode = (
    <rect
      width={width}
      height={height}
      fill={fill}
      pointerEvents={interactive ? 'all' : 'none'}
      className="transition-colors duration-150"
    />
  );

  for (let i = 0; i < setNames.length; i++) {
    const name = setNames[i];
    const isInside = Boolean(bits[i]);
    content = isInside ? (
      <g clipPath={`url(#${idPrefix}-clip${name})`}>{content}</g>
    ) : (
      <g mask={`url(#${idPrefix}-not${name})`}>{content}</g>
    );
  }

  return (
    <g
      className={`transition-all duration-150 ${
        interactive ? 'cursor-pointer focus:outline-none' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover && onHover(mask)}
      onMouseLeave={() => onHover && onHover(null)}
      tabIndex={interactive ? 0 : -1}
      role={interactive ? 'button' : undefined}
      aria-label={`${label}: ${isShaded ? 'Shaded' : 'Unshaded'}`}
    >
      <title>{`${label}: ${isShaded ? 'Shaded' : 'Unshaded'}`}</title>
      {content}
    </g>
  );
}
