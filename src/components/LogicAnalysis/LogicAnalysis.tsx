'use client';

import React, { useState } from 'react';
import { useBooleanStudio } from '@/hooks/useBooleanStudio';
import { parseExpression } from '@/lib/parser/parser';
import { generateTruthTable } from '@/lib/truth-table/generator';
import { CheckCircle2, XCircle, ArrowRightLeft, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import { ASTNode } from '@/lib/types/boolean';

function getContrapositive(ast: ASTNode): string | null {
  if (ast.type === 'IMPLIES') {
    // !Q -> !P
    return `!(${formatNode(ast.right)}) -> !(${formatNode(ast.left)})`;
  }
  return null;
}

function formatNode(node: ASTNode): string {
  if (node.type === 'VARIABLE') return node.name;
  if (node.type === 'NOT') return `!${formatNode(node.child)}`;
  if (node.type === 'AND') return `(${formatNode(node.left)} & ${formatNode(node.right)})`;
  if (node.type === 'OR') return `(${formatNode(node.left)} | ${formatNode(node.right)})`;
  if (node.type === 'XOR') return `(${formatNode(node.left)} ^ ${formatNode(node.right)})`;
  if (node.type === 'NAND') return `(${formatNode(node.left)} NAND ${formatNode(node.right)})`;
  if (node.type === 'NOR') return `(${formatNode(node.left)} NOR ${formatNode(node.right)})`;
  if (node.type === 'XNOR') return `(${formatNode(node.left)} XNOR ${formatNode(node.right)})`;
  if (node.type === 'IMPLIES') return `(${formatNode(node.left)} -> ${formatNode(node.right)})`;
  if (node.type === 'IFF') return `(${formatNode(node.left)} <=> ${formatNode(node.right)})`;
  return '';
}

export function LogicAnalysis() {
  const { analysisResult } = useBooleanStudio();
  const [compareExpr, setCompareExpr] = useState('');
  const [compareResult, setCompareResult] = useState<'equivalent' | 'not-equivalent' | 'invalid' | null>(null);
  const [compareError, setCompareError] = useState('');

  if (!analysisResult || !analysisResult.valid || !analysisResult.ast) {
    return null;
  }

  const handleCompare = () => {
    if (!compareExpr.trim()) {
      setCompareResult(null);
      return;
    }

    try {
      const { ast: ast2, variables: vars2 } = parseExpression(compareExpr);
      const combinedVars = Array.from(new Set([...analysisResult.variables, ...vars2])).sort();

      const tt1 = generateTruthTable(analysisResult.ast!, combinedVars);
      const tt2 = generateTruthTable(ast2, combinedVars);

      let isEquivalent = true;
      for (let i = 0; i < tt1.rows.length; i++) {
        if (tt1.rows[i].output !== tt2.rows[i].output) {
          isEquivalent = false;
          break;
        }
      }

      setCompareResult(isEquivalent ? 'equivalent' : 'not-equivalent');
      setCompareError('');
    } catch (err) {
      setCompareResult('invalid');
      setCompareError(err instanceof Error ? err.message : 'Invalid expression');
    }
  };

  const contrapositive = getContrapositive(analysisResult.ast);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Expression Type Card (Newly Added) */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Expression Type</h3>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm text-slate-400">Type of expression:</span>
            <div className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-between">
              <span className="font-mono text-indigo-400 text-lg font-bold">
                {analysisResult.ast?.type === 'IMPLIES' ? 'Implication' : 
                 analysisResult.ast?.type === 'IFF' ? 'Biconditional / IFF' : 
                 'Boolean Expression'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {analysisResult.ast?.type === 'IMPLIES' ? 'An implication statement (P -> Q).' : 
               analysisResult.ast?.type === 'IFF' ? 'A biconditional statement (P <=> Q).' : 
               'A standard boolean logic expression.'}
            </p>
          </div>
        </div>
        
        {/* Classification Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Logical Classification</h3>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm text-slate-400">The expression is a:</span>
            <div className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-between">
              <span className="font-mono text-emerald-400 text-lg font-bold">
                {analysisResult.classification}
              </span>
              {analysisResult.classification === 'Tautology' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {analysisResult.classification === 'Contradiction' && <XCircle className="w-5 h-5 text-rose-500" />}
              {analysisResult.classification === 'Contingency' && <HelpCircle className="w-5 h-5 text-amber-500" />}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {analysisResult.classification === 'Tautology' && 'A tautology is true for all possible input combinations.'}
              {analysisResult.classification === 'Contradiction' && 'A contradiction is false for all possible input combinations.'}
              {analysisResult.classification === 'Contingency' && 'A contingency is true for some inputs and false for others.'}
            </p>
          </div>
        </div>

        {/* Contraposition Card */}
        {contrapositive && (
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Contraposition</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Original Implication:</span>
                <span className="font-mono text-sm text-slate-200">{formatNode(analysisResult.ast)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Contrapositive (Logically Equivalent):</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                  {contrapositive}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logical Equivalence Card */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Logical Equivalence Check</h3>
        </div>
        
        <p className="text-sm text-slate-400">
          Compare another expression against <span className="font-mono text-indigo-300">{analysisResult.expression}</span> to see if they are logically equivalent.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <input
            type="text"
            value={compareExpr}
            onChange={(e) => setCompareExpr(e.target.value)}
            placeholder="e.g. !A | B"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleCompare}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            Compare
          </button>
        </div>

        {compareResult === 'equivalent' && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-emerald-400 font-bold">Logically Equivalent</h4>
              <p className="text-emerald-300/80 text-sm mt-1">Both expressions produce the exact same outputs for all input combinations.</p>
            </div>
          </div>
        )}

        {compareResult === 'not-equivalent' && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-rose-400 font-bold">Not Equivalent</h4>
              <p className="text-rose-300/80 text-sm mt-1">The expressions produce different outputs for at least one input combination.</p>
            </div>
          </div>
        )}

        {compareResult === 'invalid' && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-400 font-bold">Syntax Error</h4>
              <p className="text-amber-300/80 text-sm mt-1">{compareError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
