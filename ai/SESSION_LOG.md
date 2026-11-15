# Session History

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
  - Target expressions verified:
    - `"A U B"` $\to$ `[2, 3, 4, 5, 6, 7]` (6 regions: everything except $C$ only [$m_1$] and Outside [$m_0$]).
    - `"A'"` $\to$ `[0, 1, 2, 3]` (4 regions).
    - `"(A ∪ B ∪ C)'"` $\to$ `[0]` (1 region: Outside universe only).
    - `"A Δ B"` $\to$ `[2, 3, 4, 5]` (4 regions: $A \cap B \cap C$ is not one of them).
    - 2 Sets (`A ∪ B`, `A \ B`) evaluated across all 4 regions [00, 01, 10, 11].

---

## [2026-11-15] - Venn & Sets Lab Feature Implementation (`feature/venn-sets`)
- **Summary**: Implemented the "Venn & Sets Lab" educational feature (`/venn-sets`) covering basic set theory (Unit 1) and Principle of Inclusion-Exclusion (Unit 3). Engineered using a clean, decoupled architecture: pure TypeScript domain adapters in `src/features/venn-sets/lib/`, dedicated Zustand store in `src/features/venn-sets/store/`, accessible interactive SVG diagrams with custom region paths, and a dedicated route page. Only touched a single existing source file (`Navbar.tsx` to register the navigation link).
- **Files Created**:
  - `src/features/venn-sets/types.ts`: Core type contracts (`SetVarCount`, `RegionMask`, `RegionShading`, `ParsedSetExpr`, `IdentityResult`, `InclusionExclusionInput/Result`, `WordProblem`).
  - `src/features/venn-sets/lib/set-adapter.ts`: Adapter translating set notation ($\cup, \cap, ', \setminus, \triangle$) and ASCII keys to BoolStudio's Boolean AST grammar.
  - `src/features/venn-sets/lib/regions.ts`: Region bitmask decomposition and canonical sum-of-regions formatting.
  - `src/features/venn-sets/lib/shading.ts`: Shading bitmask manipulation helpers.
  - `src/features/venn-sets/lib/identities.ts`: Set identity equivalence engine and curated presets library.
  - `src/features/venn-sets/lib/inclusion-exclusion.ts`: Deterministic cardinality solver, consistency validator, and step-by-step formula generator.
  - `src/features/venn-sets/lib/word-problems.ts`: 4 real-world syllabus word problems.
  - `src/features/venn-sets/store/useVennLabStore.ts`: Dedicated Zustand store.
  - `src/features/venn-sets/components/venn-geometry.ts`: Exact SVG arc paths and coordinate geometry for 2-set and 3-set diagrams.
  - `src/features/venn-sets/components/RegionShape.tsx`: Accessible interactive SVG `<path>` region component.
  - `src/features/venn-sets/components/VennDiagram.tsx`: SVG Venn diagram with Universal set $U$, circle outlines, and region shapes.
  - `src/features/venn-sets/components/ExpressionShadingPanel.tsx`: Expression input with virtual keypad and live syntax diagnostics.
  - `src/features/venn-sets/components/IdentityCheckerPanel.tsx`: Dual-expression evaluator with side-by-side diagrams and equivalence verdicts.
  - `src/features/venn-sets/components/InclusionExclusionPanel.tsx`: Cardinality input form, validation alerts, and step-by-step derivation equations.
  - `src/features/venn-sets/components/WordProblemPanel.tsx`: Exercise cards with hidden answer reveals.
  - `src/features/venn-sets/components/TruthLinkPanel.tsx`: Read-only truth table with bidirectional hover linkage to Venn regions.
  - `src/features/venn-sets/components/VennSetsLab.tsx`: Top-level multi-tab lab view.
  - `src/features/venn-sets/index.ts`: Feature exports.
  - `src/app/venn-sets/page.tsx`: Static page route.
  - `docs/third-party/venn-sets.md`: Attribution documentation.
- **Files Modified**:
  - `src/components/layout/Navbar.tsx`: Added 1 navigation entry for `/venn-sets`.
  - `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` (ADR-004), `docs/CHANGELOG.md`, `ai/HANDOFF.md`, `ai/TASKS.md`.
- **Validation**:
  - `npx tsc --noEmit`: 0 errors.
  - `npx eslint`: 0 errors, 0 warnings.
  - `npm run build`: Static export succeeded (7 static routes generated).
  - Scratch validation test: verified 7 basic expressions, 2 algebraic identities, 2 valid PIE cases, and 1 invalid PIE rejection.

---

## [2026-11-05] - Desktop Application Conversion (Tauri 2.0 & Next.js Static Export)
- **Summary**: Successfully converted the BoolStudio website into an ultra-fast, lightweight Windows desktop application using Tauri 2.0 (Rust) and Microsoft Edge WebView2, preserving 100% of existing functionality, styling, and navigation.
- **Files Changed / Created**:
  - `next.config.ts` (configured static export: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`, package import optimizations)
  - `package.json` (added `@tauri-apps/api`, `@tauri-apps/cli`, and scripts: `tauri`, `tauri:dev`, `tauri:build`)
  - `src/components/Workspace/WorkspaceView.tsx` (dynamic tab chunk splitting with `next/dynamic` for on-demand bundle loading)
  - `src-tauri/` (complete Tauri 2.0 Rust project: `Cargo.toml`, `tauri.conf.json`, `src/lib.rs`, `src/main.rs`, `capabilities/default.json`, icons)
  - `README.md` (comprehensive documentation for web & desktop development, installation, and build)
  - `docs/ARCHITECTURE.md` (updated dual-target desktop & web architecture)
  - `docs/DECISIONS.md` (recorded ADR-003: Desktop Application Architecture via Tauri 2.0)
  - `docs/CHANGELOG.md` (logged v1.1.0 release notes)
  - `ai/HANDOFF.md`, `ai/TASKS.md`, `ai/SESSION_LOG.md`
- **Features Completed**:
  - Zero-server static export pipeline eliminating bundled Node.js processes.
  - Native Windows desktop window (1280x820, resizable, min 800x600, centered) with custom multi-resolution icons.
  - Windows NSIS installer package (`BoolStudio_0.1.0_x64-setup.exe`) generated at only **2.07 MiB**.
  - Standalone portable binary (`boolstudio.exe`).
  - Production verification: cold startup < 600ms, idle RAM ~46 MB, CPU < 0.2%.
- **Known Issues**: None.
- **Testing Status**: Validated through static build (`npm run build`), desktop release compilation (`npm run tauri:build`), process benchmark execution, and clean shutdown verification.

---

## [2026-08-08] - Expanded Logic Gates & Logic Analysis
- **Summary**: Implemented support for advanced logic gates (NAND, NOR, XNOR) and propositional operators (`->`, `=>`, `<=>`, `<->`). Added logical classification, equivalence checking, and revamped the Expression Builder UI.
- **Files Changed**:
  - `src/lib/types/boolean.ts`
  - `src/hooks/useBooleanStudio.ts`
  - `src/lib/parser/tokenizer.ts`
  - `src/lib/parser/parser.ts`
  - `src/lib/logic/evaluator.ts`
  - `src/lib/logic/circuit-builder.ts`
  - `src/lib/simplifier/boolean-simplifier.ts`
  - `src/lib/engine/boolean-engine.ts`
  - `src/components/LogicCircuit/LogicCircuit.tsx`
  - `src/components/LogicAnalysis/LogicAnalysis.tsx`
  - `src/components/Workspace/WorkspaceView.tsx`
  - `src/components/ExpressionInput/ExpressionInput.tsx`
- **Features Completed**:
  - Full support for `NAND`, `NOR`, `XNOR`, Implication (`->`/`=>`), and Biconditional (`<=>`/`<->`) in the Parser and AST.
  - Strict operator precedence adjustments and gate normalization for step-by-step simplifier.
  - Interactive SVG visual rendering of the new gates with inversion bubbles. Implication and Biconditional are properly simulated as hardware logic.
  - Added new **Logic Analysis** tab for evaluating Tautologies, Contradictions, Contingencies, showing Contraposition, and comparing expressions for Logical Equivalence.
  - Revamped **Expression Builder UI** to categorize operator insertion buttons into Logic Gates, Propositional Logic, and Grouping.
- **Known Issues**: None.
- **Testing Status**: Validated through successful TypeScript production build (`npm run build`).

---

## [2026-08-08] - Shareable URL Links & Code Cleanup
- **Summary**: Added URL query parameter syncing (`/workspace?expr=...`), Share Link copy button, and cleaned default template assets (`public/*.svg`, `CLAUDE.md`).
- **Files Changed**:
  - [src/components/ExpressionInput/ExpressionInput.tsx](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/src/components/ExpressionInput/ExpressionInput.tsx)
  - [src/components/Workspace/WorkspaceView.tsx](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/src/components/Workspace/WorkspaceView.tsx)
  - Removed `CLAUDE.md` and unused starter SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
- **Features Completed**:
  - URL parameter auto-syncing (`?expr=...`).
  - One-click share link clipboard copying.
  - Workspace directory cleanup.
