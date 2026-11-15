'use client';

import React, { useMemo } from 'react';
import { useGraphLab } from '@/hooks/useGraphLab';
import { analyzeTreeProperties } from '@/lib/graph-theory/tree';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export function TreePanel() {
  const { graph } = useGraphLab();
  const tree = useMemo(() => analyzeTreeProperties(graph), [graph]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Status */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
          tree.isTree
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {tree.isTree ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400" />
          )}

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white">
              {tree.isTree ? 'Graph is a TREE' : 'Graph is NOT a Tree'}
            </h3>
            <span className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {tree.explanation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              tree.isTree
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {tree.isTree ? '✓ Tree Verified' : '✕ Tree Conditions Violated'}
          </span>
        </div>
      </div>

      {/* Axiom Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Connected Condition */}
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2 ${
            tree.isConnected
              ? 'bg-emerald-950/15 border-emerald-500/30'
              : 'bg-rose-950/15 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300">
              1. Connectivity
            </span>
            {tree.isConnected ? (
              <span className="text-xs font-bold text-emerald-400">✓ Satisfied</span>
            ) : (
              <span className="text-xs font-bold text-rose-400">✕ Violated</span>
            )}
          </div>
          <span className="text-sm font-bold text-white">
            {tree.isConnected ? 'Connected Graph' : 'Disconnected'}
          </span>
          <span className="text-[11px] text-slate-400">
            A tree must contain exactly one connected component so every pair of vertices
            has a path.
          </span>
        </div>

        {/* 2. Acyclic Condition */}
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2 ${
            tree.isAcyclic
              ? 'bg-emerald-950/15 border-emerald-500/30'
              : 'bg-rose-950/15 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300">
              2. Acyclicity
            </span>
            {tree.isAcyclic ? (
              <span className="text-xs font-bold text-emerald-400">✓ Satisfied</span>
            ) : (
              <span className="text-xs font-bold text-rose-400">✕ Violated</span>
            )}
          </div>
          <span className="text-sm font-bold text-white">
            {tree.isAcyclic ? 'No Cycles (Acyclic)' : 'Contains Cycle(s)'}
          </span>
          <span className="text-[11px] text-slate-400">
            A tree must be circuit-free; any simple path between two vertices must be unique.
          </span>
        </div>

        {/* 3. Size Formula |E| = |V| - 1 */}
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2 ${
            tree.satisfiesSizeCondition
              ? 'bg-emerald-950/15 border-emerald-500/30'
              : 'bg-rose-950/15 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300">
              3. Size Formula |E| = |V| - 1
            </span>
            {tree.satisfiesSizeCondition ? (
              <span className="text-xs font-bold text-emerald-400">✓ Satisfied</span>
            ) : (
              <span className="text-xs font-bold text-rose-400">✕ Violated</span>
            )}
          </div>
          <span className="text-sm font-bold font-mono text-white">
            |E| = {tree.size}, |V| - 1 = {Math.max(0, tree.order - 1)}
          </span>
          <span className="text-[11px] text-slate-400">
            Any tree of order n has exactly n - 1 edges. Adding any edge creates a cycle;
            removing any edge disconnects it.
          </span>
        </div>
      </div>

      {/* Failed Conditions Detailed Feedback */}
      {tree.failedConditions.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Violated Axioms Diagnostic:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
            {tree.failedConditions.map((cond, idx) => (
              <li key={idx} className="text-rose-200">
                {cond}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Educational Theorem Reference Box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Fundamental Tree Equivalences (Unit 6):</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          For any undirected graph G with n vertices, the following statements are
          mathematically equivalent:
        </p>
        <ul className="list-disc list-inside text-[11px] leading-relaxed space-y-0.5">
          <li>G is connected and acyclic.</li>
          <li>G is connected and has exactly n - 1 edges.</li>
          <li>G is acyclic and has exactly n - 1 edges.</li>
          <li>There is a unique simple path between any pair of vertices in G.</li>
        </ul>
      </div>
    </div>
  );
}
