'use client';

import React from 'react';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { CircuitNode, CircuitWire } from '@/lib/types/boolean';
import { Activity, Power, Info, Zap } from 'lucide-react';

export function LogicCircuit() {
  const { analysisResult, activeInputValues, toggleInputValue } = useBooleanStudio();

  if (!analysisResult || !analysisResult.valid || !analysisResult.circuit) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
        <p className="text-sm">Enter a valid Boolean expression to visualize the logic gate circuit.</p>
      </div>
    );
  }

  const { nodes, wires, output } = analysisResult.circuit;

  // Calculate SVG bounds dynamically
  const maxX = Math.max(...nodes.map((n) => n.x), 500) + 120;
  const maxY = Math.max(...nodes.map((n) => n.y), 300) + 100;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Circuit Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Interactive Circuit Simulation</span>
          <span className="text-xs text-slate-500 font-mono">(Click input switches to toggle signals)</span>
        </div>

        {/* Live Input Switches */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Input Switches:</span>
          {analysisResult.variables.map((v) => {
            const isHigh = Boolean(activeInputValues[v]);
            return (
              <button
                key={v}
                onClick={() => toggleInputValue(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isHigh
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 glow-emerald'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Power className={`w-3.5 h-3.5 ${isHigh ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{v}:</span>
                <span className={isHigh ? 'text-emerald-400' : 'text-slate-400'}>{isHigh ? '1' : '0'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Circuit SVG Canvas */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl relative min-h-[380px] flex items-center justify-center">
        <svg
          width={maxX}
          height={maxY}
          viewBox={`0 0 ${maxX} ${maxY}`}
          className="w-full h-auto select-none"
        >
          <defs>
            {/* Glow Filter for Active Signals */}
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Wires */}
          {wires.map((wire) => {
            const { fromPoint, toPoint, active } = wire;
            // Draw smooth Bezier curve wire
            const midX = (fromPoint.x + toPoint.x) / 2;
            const pathData = `M ${fromPoint.x} ${fromPoint.y} C ${midX} ${fromPoint.y}, ${midX} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`;

            return (
              <g key={wire.id}>
                {/* Background shadow path */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.8)'}
                  strokeWidth={active ? 8 : 4}
                  strokeLinecap="round"
                />
                {/* Active/Inactive signal wire */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={active ? '#10b981' : '#475569'}
                  strokeWidth={active ? 3 : 2}
                  strokeLinecap="round"
                  className={active ? 'animate-wire-active' : ''}
                  filter={active ? 'url(#glow-emerald)' : undefined}
                />
              </g>
            );
          })}

          {/* Render Gate & Input/Output Nodes */}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {node.type === 'INPUT' && (
                <g
                  onClick={() => toggleInputValue(node.label)}
                  className="cursor-pointer group"
                >
                  <rect
                    x="-35"
                    y="-20"
                    width="70"
                    height="40"
                    rx="10"
                    fill={node.value ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.9)'}
                    stroke={node.value ? '#10b981' : '#64748b'}
                    strokeWidth="2"
                    filter={node.value ? 'url(#glow-emerald)' : undefined}
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="-10"
                    y="5"
                    fill="#f8fafc"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                  <circle
                    cx="20"
                    cy="0"
                    r="8"
                    fill={node.value ? '#10b981' : '#475569'}
                  />
                  <text
                    x="20"
                    y="4"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.value ? '1' : '0'}
                  </text>
                </g>
              )}

              {node.type === 'OUTPUT' && (
                <g>
                  <circle
                    cx="0"
                    cy="0"
                    r="28"
                    fill={node.value ? 'rgba(16, 185, 129, 0.3)' : 'rgba(15, 23, 42, 0.9)'}
                    stroke={node.value ? '#10b981' : '#64748b'}
                    strokeWidth="3"
                    filter={node.value ? 'url(#glow-emerald)' : undefined}
                  />
                  <text
                    x="0"
                    y="-35"
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    OUTPUT
                  </text>
                  <text
                    x="0"
                    y="6"
                    fill={node.value ? '#34d399' : '#94a3b8'}
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {node.value ? '1' : '0'}
                  </text>
                </g>
              )}

              {['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'].includes(node.type) && (
                <g transform="translate(-30, -25)">
                  {/* Gate Base Box / Shape */}
                  <rect
                    x="0"
                    y="0"
                    width="60"
                    height="50"
                    rx="12"
                    fill="rgba(30, 41, 59, 0.95)"
                    stroke={node.value ? '#818cf8' : '#475569'}
                    strokeWidth="2"
                    filter={node.value ? 'url(#glow-indigo)' : undefined}
                  />
                  <text
                    x="30"
                    y="24"
                    fill={node.value ? '#a5b4fc' : '#cbd5e1'}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    {node.type}
                  </text>
                  <text
                    x="30"
                    y="40"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    val: {node.value ? '1' : '0'}
                  </text>
                  {/* Inversion Bubble for negative gates */}
                  {['NOT', 'NAND', 'NOR', 'XNOR'].includes(node.type) && (
                    <circle cx="64" cy="25" r="4" fill="rgba(30, 41, 59, 0.95)" stroke={node.value ? '#818cf8' : '#475569'} strokeWidth="1.5" />
                  )}
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>Green glowing lines represent HIGH signals (1). Click input badges to toggle live state propagation.</span>
      </div>
    </div>
  );
}
