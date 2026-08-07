import React from 'react';
import Link from 'next/link';
import { Cpu, Table, Grid, GitCommit, ArrowRight, Play, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Table,
      title: 'Truth Table Generator',
      description: 'Automatically detects variables, generates $2^N$ input combinations, computes outputs, and highlights active input rows.',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      icon: Cpu,
      title: 'Interactive Circuit Visualizer',
      description: 'Converts expressions into live SVG digital logic circuits (AND, OR, NOT, XOR) with clickable input signal switches.',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      icon: Grid,
      title: 'Karnaugh Map Reduction',
      description: 'Generates Gray-code Karnaugh maps for up to 4 variables with minterm grouping color overlays and simplified expressions.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: GitCommit,
      title: 'Step-by-Step Simplification',
      description: 'Shows full algebraic breakdown displaying exact Boolean laws applied (De Morgan, Identity, Complement, Absorption).',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop blur circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-500">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Professional Digital Logic Workspace</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Design. Visualize. Learn <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400">
            Boolean Logic.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
          BoolStudio is an interactive learning platform for Boolean Algebra and Digital Logic. Evaluate expressions, inspect truth tables, simulate logic circuits, and simplify equations seamlessly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/workspace"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-current text-white" />
            <span>Launch Workspace</span>
            <ArrowRight className="w-5 h-5 text-white/80" />
          </Link>

          <Link
            href="/about"
            className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-base border border-slate-800 transition-colors"
          >
            Learn More
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl text-slate-400 text-xs font-mono">
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Instant Evaluation</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Syntax Validation</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Live Signal Propagation</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Grid className="w-4 h-4 text-emerald-400" />
            <span>K-Map Rectangles</span>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Four Powerful Logic Tools</h2>
          <p className="text-slate-400 text-sm mt-2">Everything updates automatically from your single Boolean expression input.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl glass-panel border ${f.borderColor} hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 shadow-xl`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.bgColor} flex items-center justify-center ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-emerald-950/60 border border-indigo-500/30 text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-extrabold text-white">Ready to Explore Boolean Logic?</h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Start building expressions like <code className="text-emerald-400 font-mono font-bold">(A & B) | (!C)</code> and inspect truth tables, live circuits, and Karnaugh maps instantly.
          </p>
          <Link
            href="/workspace"
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Open BoolStudio Workspace
          </Link>
        </div>
      </section>
    </div>
  );
}
