import { create } from 'zustand';
import { BooleanAnalysisResult } from '@/lib/types/boolean';
import { analyzeBooleanExpression } from '@/lib/engine/boolean-engine';

interface BooleanStudioState {
  expression: string;
  activeInputValues: Record<string, boolean>;
  analysisResult: BooleanAnalysisResult | null;
  activeTab: 'truth-table' | 'circuit' | 'kmap' | 'simplification';
  isEvaluating: boolean;

  setExpression: (expr: string) => void;
  setActiveInputValues: (inputs: Record<string, boolean>) => void;
  toggleInputValue: (varName: string) => void;
  setActiveTab: (tab: 'truth-table' | 'circuit' | 'kmap' | 'simplification') => void;
  generateAnalysis: (exprToAnalyze?: string) => void;
}

export const useBooleanStudio = create<BooleanStudioState>((set, get) => ({
  expression: '(A & B) | (!C)',
  activeInputValues: { A: true, B: true, C: false },
  analysisResult: null,
  activeTab: 'truth-table',
  isEvaluating: false,

  setExpression: (expr) => set({ expression: expr }),
  setActiveInputValues: (inputs) => set({ activeInputValues: inputs }),
  toggleInputValue: (varName) => {
    const current = get().activeInputValues;
    const updated = { ...current, [varName]: !current[varName] };
    set({ activeInputValues: updated });
    
    // Also update circuit node values if result exists
    const currentResult = get().analysisResult;
    if (currentResult && currentResult.valid && currentResult.ast) {
      // Re-evaluate circuit logic with new inputs
      const newResult = analyzeBooleanExpression(get().expression, updated);
      set({ analysisResult: newResult });
    }
  },
  setActiveTab: (tab) => set({ activeTab: tab }),

  generateAnalysis: (exprToAnalyze) => {
    const expr = exprToAnalyze !== undefined ? exprToAnalyze : get().expression;
    set({ isEvaluating: true });
    
    try {
      const result = analyzeBooleanExpression(expr, get().activeInputValues);
      
      // Update default input values if new variables detected
      const newInputs: Record<string, boolean> = { ...get().activeInputValues };
      result.variables.forEach((v) => {
        if (newInputs[v] === undefined) {
          newInputs[v] = true;
        }
      });
      
      set({
        expression: expr,
        analysisResult: result,
        activeInputValues: newInputs,
        isEvaluating: false,
      });
    } catch (err) {
      set({
        analysisResult: {
          expression: expr,
          valid: false,
          error: err instanceof Error ? err.message : 'An unknown syntax error occurred.',
          variables: [],
        },
        isEvaluating: false,
      });
    }
  },
}));
