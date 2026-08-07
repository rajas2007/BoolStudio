import React from 'react';
import Link from 'next/link';
import { Cpu, BookOpen, Layers, ShieldCheck, Play, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About | BoolStudio Educational Logic Platform',
  description: 'Learn how BoolStudio processes Boolean expressions, evaluates digital logic circuits, and formats Karnaugh Maps.',
};

export default function AboutPage() {
  const operators = [
    { symbol: '&', name: 'AND (Conjunction)', example: 'A & B', truth: 'Outputs 1 only if both A and B are 1.' },
    { symbol: '|', name: 'OR (Disjunction)', example: 'A | B', truth: 'Outputs 1 if either A or B (or both) are 1.' },
    { symbol: '!', name: 'NOT (Negation)', example: '!A', truth: 'Inverts the signal (0 becomes 1, 1 becomes 0).' },
    { symbol: '^', name: 'XOR (Exclusive OR)', example: 'A ^ B', truth: 'Outputs 1 if A and B are different.' },
    { symbol: '( )', name: 'Parentheses', example: '(A | B) & C', truth: 'Controls precedence and grouping.' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider w-fit">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Educational Documentation</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">About BoolStudio</h1>
        <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
          BoolStudio is designed to provide immediate visual feedback for Boolean algebra concepts. Similar to graphing tools like Desmos or GeoGebra for calculus, BoolStudio helps students visualize how logic operators function inside digital circuits.
        </p>
      </div>

      {/* Operator Reference Guide */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Supported Operators & Syntax</span>
        </h2>
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 w-24 text-center">Operator</th>
                <th className="p-4 font-bold text-white">Name</th>
                <th className="p-4 font-bold text-indigo-300">Example</th>
                <th className="p-4 text-slate-300">Logic Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {operators.map((op) => (
                <tr key={op.symbol} className="hover:bg-slate-900/40">
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {op.symbol}
                    </span>
                  </td>
                  <td className="p-4 font-sans font-semibold text-white">{op.name}</td>
                  <td className="p-4 font-bold text-emerald-400">{op.example}</td>
                  <td className="p-4 font-sans text-slate-400 text-xs">{op.truth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Principles & K-Map Guard Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Karnaugh Map Rules</span>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Karnaugh maps (K-Maps) use Gray code ordering where adjacent cells differ by only one binary bit. BoolStudio supports 2, 3, and 4 variable maps. If an expression contains more than 4 variables, K-Map generation is automatically disabled with a clear notice while all other features continue to function.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Client-Side Engine</span>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            BoolStudio executes entirely in your browser using TypeScript algorithms. No data is sent to external servers, providing zero latency calculations and instant circuit simulations.
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to test an expression?</h3>
          <p className="text-slate-400 text-sm">Jump right into the workspace and evaluate your logic equations.</p>
        </div>
        <Link
          href="/workspace"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
