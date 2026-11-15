# Session History

## [2026-11-15] - Resolve All Codebase Diagnostics across src & Fix WebView2 Single-Instance Crash
- **Summary**: Identified and cleanly resolved all ESLint and TypeScript diagnostics across `src/` including `Toolbar.tsx`, `src/lib/` (`kmap`, `logic`, `parser`, `simplifier`, `types`), and `src/components/` (`ExpressionInput`, `LogicCircuit`, `Simplification`). All diagnostics now pass with 0 errors and 0 warnings. Full static Next.js production build (`npx next build`) and 38 unit tests pass without error. In addition, resolved the Windows desktop WebView2 crash (`0x800700AA`) with a Win32 single-instance Mutex (`Local\BoolStudio_SingleInstance_Mutex`) in `src-tauri/src/main.rs`.
- **Root Cause & Fixes**:
  - `src/components/GraphLab/Toolbar.tsx`: Unused imports and state setters cleaned; presets array verified and aligned with `PresetName`.
  - `src/lib/kmap/kmap-generator.ts`: Removed unused parameters `_rowVars` and `_colVars`.
  - `src/lib/logic/circuit-builder.ts`: Properly typed `CircuitNode.depth?: number` and eliminated unsafe `any` casts.
  - `src/lib/parser/tokenizer.ts`: Fixed `let startPos` to `const startPos` per `prefer-const`.
  - `src/lib/simplifier/boolean-simplifier.ts`: Replaced unsafe `any` casts with discriminated AST unions.
  - `src/lib/types/boolean.ts`: Added missing `StepExplanation` interface.
  - `src/components/ExpressionInput/ExpressionInput.tsx`: Resolved React Hook `exhaustive-deps` and `set-state-in-effect`.
  - `src/components/LogicCircuit/LogicCircuit.tsx`: Cleaned unused imports and variables.
  - `src/components/Simplification/Simplification.tsx`: Removed unused `GitCommit` import.
- **Verification**:
  - `npx eslint src` 👉 0 errors, 0 warnings.
  - `npx tsc --noEmit` 👉 0 errors.
  - `npx next build` 👉 All routes prerendered successfully.
  - `cargo check --manifest-path src-tauri/Cargo.toml` 👉 0 errors.
  - Unit tests: 38/38 passing (11 Graph Theory + 27 Venn & Sets).

---

## [2026-11-15] - Unit 6: Graph Theory Laboratory Clean Rebuild & Windows Desktop Integration (`feature/graph-theory`)
- **Summary**: Rebuilt the Graph Theory Laboratory (`/graph-theory`) into a robust, decoupled, and cleanly designed discrete mathematics studio. Decoupled all 9 syllabus topics into pure TypeScript algorithmic functions (`src/lib/graph-theory/`) with zero UI/DOM dependencies returning a standardized `AlgorithmOutput<T>` contract (`{ result, explanation, highlight, steps }`). Designed a single centralized Zustand state store (`src/hooks/useGraphLab.ts`) managing vertices, edges, directed status, undo stack, active highlights, and step-through animation timers. Implemented a hardware-accelerated native SVG canvas with HTML5 pointer capture, smooth vertex dragging without jumps, ghost edge tracking, and synchronized highlighting. Built a comprehensive 11-test headless unit test suite (`src/lib/graph-theory/graph-algorithms.test.ts`) covering all 9 topics on canonical graphs. Compiled and verified the full Tauri 2.0 desktop executable and NSIS setup package.
- **Studio UI & Zero-Scroll Optimization**:
  - Compact Studio Header & Toolbar (`src/components/GraphLab/Toolbar.tsx`) consolidating branding, Unit 6 badge, mode buttons, $V/E$ counters, conversion toggle, presets dropdown, undo, clear, and inline status toasts into a single ~44px row.
  - Horizontal segmented topic tabs (`src/components/GraphLab/TopicTabs.tsx`) tiled across the workspace with concise labels and tooltips, eliminating horizontal truncation.
  - Matched viewport layout (`src/components/GraphLab/GraphLabView.tsx` & `GraphCanvas.tsx`) locking canvas (~58%) and topic panel (~42%) to standard desktop heights (`h-[560px]`) without page scrolling.
  - Compact panel components with responsive metric ribbons and streamlined step playback controls.
- **Files Changed / Created**:
  - `src/lib/types/graph.ts`: Unified TypeScript contracts for Vertex, Edge, Graph, HighlightState, StepInfo, and all 9 syllabus topic result models.
  - `src/lib/graph-theory/`: Pure algorithmic functions for all 9 topics:
    - `graph-model.ts`, `matrix-builders.ts`, `connectivity.ts`, `walks-cycles.ts`, `euler.ts`, `hamiltonian.ts`, `tree.ts`, `bipartite.ts`, `matching.ts`, `planar-bound.ts`, `coloring.ts`, `presets.ts`.
  - `src/lib/graph-theory/graph-algorithms.test.ts`: Automated test suite covering all 9 topics on canonical graphs ($K_4, K_5, K_{3,3}, C_5, C_6$, Petersen, $P_5, K_{1,4}$, Disconnected, self-loops/multi-edges, walks). All 11 tests pass in ~13ms.
  - `src/hooks/useGraphLab.ts`: Centralized Zustand store with undo history stack, active canvas highlights, cursor coordinates for ghost edge drawing, and step-through playback timers.
  - `src/components/GraphLab/`: `Toolbar.tsx`, `GraphCanvas.tsx`, `TopicTabs.tsx`, `GraphLabView.tsx`, and 9 topic panels.
  - `README.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/CHANGELOG.md`, `ai/HANDOFF.md`, `ai/TASKS.md`.
- **Validation**:
  - Unit tests: 11/11 passed (0 failed).
  - TypeScript: 0 errors (`npx tsc --noEmit`).
  - ESLint: 0 errors, 0 warnings (`npx eslint`).
  - Production build: `npm run build` static export succeeded (prerendered all routes).
  - Desktop release build: `npm run tauri:build` succeeded with NSIS bundle generation (2.14 MB).

---

## [2026-11-15] - Venn & Sets Lab: Exact ClipPath/Mask Geometry & Single-Source Evaluator (`feature/venn-sets`)
- **Summary**: Resolved Venn diagram expression mismatch, partial circle shading, and UI clutter issues. Built exact boolean SVG region geometry using recursive `<clipPath>` (for bit 1, inside circle) and inverted `<mask fill="white"><circle fill="black"/></mask>` (for bit 0, outside circle) composition applied to a bounding rectangle for each region, replacing fragile manual SVG arc paths. Circle outlines are drawn on top. Built a single source of truth Set AST parser and evaluator with standard operator precedence and contextual token disambiguation (allowing "A U B" without error). Corrected minterm indexing to standard MSB-first ($A$ as MSB, $C$ as LSB), aligning SVG regions ($m_1 = A'B'C, m_4 = AB'C'$), truth table rows, and PIE decompositions. Redesigned the UI into a clean 2-column desktop layout with $\ge 480$px Venn diagram, streamlined Universe $U$ box, 3 primary quick-example chips with "More examples" toggle, collapsible truth table, external bold set labels, hover tooltips, and grouped 18px+ symbol keypads.
- **Root Causes Fixed**:
  1. *Geometric Arc Path Deformation*: The previous implementation used fragile manual SVG arc paths (`M... A... Z`) that failed to represent true circle intersections, causing expressions like "A U B" to shade distorted slivers rather than full circular regions. Fixed by using exact SVG `clipPath` and inverted `mask` composition per bitvector $[a, b, c]$.
  2. *Minterm Inversion*: Previous indexing used LSB-first ($A=2^0$), causing $m_1$ ($001_2$) to represent $A$ in diagram geometry but $C$ in the truth table. Corrected to MSB-first ($A=2^2$, $B=2^1$, $C=2^0$).
  3. *Token Ambiguity for "U"*: The letter "U" was rejected when entered between sets. Added contextual lookback to recognize "U" as union when following an operand and as universal set when standalone.
  4. *Dual Evaluators*: Diagram previously used boolean-string conversion while truth table used direct masks. Unified all subsystems on `evaluateSetAST` and `mintermToBindings`.
- **Files Created**:
  - `src/features/venn-sets/lib/parser.ts`: Recursive descent parser with exact index tracking and token normalization.
  - `src/features/venn-sets/lib/evaluator.ts`: Single source of truth evaluator and natural English translator.
  - `src/features/venn-sets/lib/evaluator.test.ts`: 27 unit tests for parser syntax, errors, hand-computed expected regions, and quick-test invariants.
- **Files Modified**:
  - `src/features/venn-sets/types.ts`: Added AST nodes, error index, and natural language fields.
  - `src/features/venn-sets/lib/regions.ts`: Updated to MSB-first minterm indexing.
  - `src/features/venn-sets/components/venn-geometry.ts`: Exact circle parameters, centroids, and bitvector specs for 2 and 3 sets.
  - `src/features/venn-sets/components/RegionShape.tsx`: Exact SVG clipPath / mask composition per region.
  - `src/features/venn-sets/components/VennDiagram.tsx`: SVG defs with clipPaths and inverted masks, circle outlines on top, external set names, and centroids text chips.
  - `src/features/venn-sets/lib/inclusion-exclusion.ts`: Updated region calculation equations to match standard masks.
  - `src/features/venn-sets/lib/word-problems.ts`: Updated target masks for all 4 scenarios.
  - `src/features/venn-sets/store/useVennLabStore.ts`: Integrated unified evaluator and `showLabels` toggle.
  - `src/features/venn-sets/components/TruthLinkPanel.tsx`: Collapsible accordion with bidirectional minterm highlighting.
  - `src/features/venn-sets/components/ExpressionShadingPanel.tsx`: Grouped 18px+ input, inline error/valid diagnostics, 3 primary chips + "More examples".
  - `src/features/venn-sets/components/VennSetsLab.tsx`: Two-column layout (left: diagram, right: controls), guaranteed single-source shading.
  - `docs/DECISIONS.md`: Logged ADR-005.
  - `docs/CHANGELOG.md`: Documented changes and bug fixes in Unreleased section.
- **Validation**:
  - `npx tsx --test src/features/venn-sets/lib/evaluator.test.ts`: 27/27 tests passed.
  - `npx tsc --noEmit`: 0 errors.
  - `npx eslint`: 0 errors, 0 warnings.
  - `npm run build`: Static export succeeded (7 static routes generated).
