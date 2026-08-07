import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-sm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-slate-200">BoolStudio</span>
          <span className="text-slate-600">|</span>
          <span>Interactive Boolean Logic & Circuit Engine</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <Link href="/workspace" className="hover:text-slate-300 transition-colors">Workspace</Link>
          <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
          <span>© {new Date().getFullYear()} BoolStudio</span>
        </div>
      </div>
    </footer>
  );
}
