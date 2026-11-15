import { create } from 'zustand';
import {
  InclusionExclusionInput,
  InclusionExclusionResult,
  IdentityResult,
  ParsedSetExpr,
  RegionMask,
  RegionShading,
  SetVarCount,
  VennLabTab,
} from '../types';
import { clearShading, fillAllShading, invertShading, masksToShadingMap, toggleRegion } from '../lib/shading';
import { parseSetExpression } from '../lib/set-adapter';
import { compareSetExpressions, SET_IDENTITY_PRESETS } from '../lib/identities';
import { computeInclusionExclusion } from '../lib/inclusion-exclusion';
import { WORD_PROBLEMS } from '../lib/word-problems';

interface VennLabState {
  varCount: SetVarCount;
  activeTab: VennLabTab;
  hoveredMask: RegionMask | null;

  // Manual Shading Tab
  manualShading: RegionShading;

  // Expression Shading Tab
  expressionText: string;
  parsedExpr: ParsedSetExpr | null;

  // Identity Checker Tab
  leftExprText: string;
  rightExprText: string;
  identityResult: IdentityResult | null;
  selectedPresetName: string | null;

  // Inclusion-Exclusion Tab
  pieInput: InclusionExclusionInput;
  pieResult: InclusionExclusionResult;

  // Word Problems Tab
  selectedProblemId: string;
  isAnswerRevealed: boolean;

  // Actions
  setVarCount: (count: SetVarCount) => void;
  setActiveTab: (tab: VennLabTab) => void;
  setHoveredMask: (mask: RegionMask | null) => void;

  toggleManualRegion: (mask: RegionMask) => void;
  clearManualShading: () => void;
  fillAllManualShading: () => void;
  invertManualShading: () => void;
  setManualShading: (shading: RegionShading) => void;

  setExpressionText: (text: string) => void;
  insertSymbolIntoExpression: (symbol: string) => void;

  setIdentityExpressions: (left: string, right: string) => void;
  applyIdentityPreset: (presetName: string) => void;

  setPieInput: (partial: Partial<InclusionExclusionInput>) => void;

  selectWordProblem: (id: string) => void;
  toggleRevealAnswer: () => void;
}

const initialPieInput: InclusionExclusionInput = {
  varCount: 3,
  universal: 100,
  cardA: 45,
  cardB: 50,
  cardC: 40,
  cardA_B: 25,
  cardA_C: 20,
  cardB_C: 15,
  cardA_B_C: 10,
};

export const useVennLabStore = create<VennLabState>((set, get) => {
  const initialVarCount: SetVarCount = 3;
  const initialExpr = 'A ∩ (B ∪ C)';
  const initialParsed = parseSetExpression(initialExpr, initialVarCount);

  const initialLeft = "(A ∪ B)'";
  const initialRight = "A' ∩ B'";
  const initialIdentity = compareSetExpressions(initialLeft, initialRight, 2);

  const initialPieResult = computeInclusionExclusion(initialPieInput);

  return {
    varCount: initialVarCount,
    activeTab: 'expression',
    hoveredMask: null,

    // Manual Shading
    manualShading: masksToShadingMap([1, 3], initialVarCount),

    // Expression Shading
    expressionText: initialExpr,
    parsedExpr: initialParsed,

    // Identity Checker
    leftExprText: initialLeft,
    rightExprText: initialRight,
    identityResult: initialIdentity,
    selectedPresetName: "De Morgan's First Law (2 Sets)",

    // Inclusion-Exclusion
    pieInput: initialPieInput,
    pieResult: initialPieResult,

    // Word Problems
    selectedProblemId: WORD_PROBLEMS[0].id,
    isAnswerRevealed: false,

    setVarCount: (count) => {
      const state = get();
      // Re-parse expression with new var count
      const parsed = parseSetExpression(state.expressionText, count);
      // Re-calculate PIE with new var count
      const updatedPieInput: InclusionExclusionInput =
        count === 2
          ? {
              varCount: 2,
              universal: state.pieInput.universal ?? 100,
              cardA: state.pieInput.cardA || 50,
              cardB: state.pieInput.cardB || 40,
              cardA_B: Math.min(state.pieInput.cardA_B || 20, state.pieInput.cardA || 50, state.pieInput.cardB || 40),
            }
          : {
              varCount: 3,
              universal: state.pieInput.universal ?? 100,
              cardA: state.pieInput.cardA || 45,
              cardB: state.pieInput.cardB || 50,
              cardC: state.pieInput.cardC || 40,
              cardA_B: state.pieInput.cardA_B || 25,
              cardA_C: state.pieInput.cardA_C || 20,
              cardB_C: state.pieInput.cardB_C || 15,
              cardA_B_C: state.pieInput.cardA_B_C || 10,
            };

      set({
        varCount: count,
        manualShading: clearShading(count),
        parsedExpr: parsed,
        pieInput: updatedPieInput,
        pieResult: computeInclusionExclusion(updatedPieInput),
      });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),

    setHoveredMask: (mask) => set({ hoveredMask: mask }),

    toggleManualRegion: (mask) => {
      const current = get().manualShading;
      set({ manualShading: toggleRegion(current, mask) });
    },

    clearManualShading: () => {
      set({ manualShading: clearShading(get().varCount) });
    },

    fillAllManualShading: () => {
      set({ manualShading: fillAllShading(get().varCount) });
    },

    invertManualShading: () => {
      const { manualShading, varCount } = get();
      set({ manualShading: invertShading(manualShading, varCount) });
    },

    setManualShading: (shading) => set({ manualShading: shading }),

    setExpressionText: (text) => {
      const parsed = parseSetExpression(text, get().varCount);
      set({ expressionText: text, parsedExpr: parsed });
    },

    insertSymbolIntoExpression: (symbol) => {
      const current = get().expressionText;
      const updated = current + symbol;
      const parsed = parseSetExpression(updated, get().varCount);
      set({ expressionText: updated, parsedExpr: parsed });
    },

    setIdentityExpressions: (left, right) => {
      const varCount = get().varCount;
      const result = compareSetExpressions(left, right, varCount);
      set({
        leftExprText: left,
        rightExprText: right,
        identityResult: result,
        selectedPresetName: null,
      });
    },

    applyIdentityPreset: (presetName) => {
      const preset = SET_IDENTITY_PRESETS.find((p) => p.name === presetName);
      if (!preset) return;

      const result = compareSetExpressions(preset.leftExpr, preset.rightExpr, preset.varCount);
      set({
        varCount: preset.varCount,
        leftExprText: preset.leftExpr,
        rightExprText: preset.rightExpr,
        identityResult: result,
        selectedPresetName: preset.name,
      });
    },

    setPieInput: (partial) => {
      const updated: InclusionExclusionInput = {
        ...get().pieInput,
        ...partial,
      };
      set({
        pieInput: updated,
        pieResult: computeInclusionExclusion(updated),
      });
    },

    selectWordProblem: (id) => {
      const problem = WORD_PROBLEMS.find((p) => p.id === id);
      if (!problem) return;

      set({
        selectedProblemId: id,
        varCount: problem.varCount,
        pieInput: problem.inputs,
        pieResult: computeInclusionExclusion(problem.inputs),
        isAnswerRevealed: false,
      });
    },

    toggleRevealAnswer: () => {
      set((state) => ({ isAnswerRevealed: !state.isAnswerRevealed }));
    },
  };
});
