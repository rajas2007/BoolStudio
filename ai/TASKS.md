# Task Board

## 📋 Completed
- [x] Fix Venn & Sets Lab logic and redesign UI (`feature/venn-sets`):
  - Single source of truth Set AST parser and evaluator with exact operator precedence and token normalization.
  - Fix bogus error on "A U B" through contextual token lookback.
  - Standard MSB-first minterm indexing ($m_1 = A'B'C, m_4 = AB'C'$) matching SVG paths and truth table rows.
  - 2-column desktop layout (large $\ge 480$px diagram, clean single Universe $U$ box).
  - Collapsible minterm truth table (collapsed by default).
  - 3 primary quick-example chips with "More examples" toggle.
  - External bold set labels, hover tooltips, and grouped 18px+ symbol keypads.
  - 22 unit tests passing (`src/features/venn-sets/lib/evaluator.test.ts`).
- [x] Implement Venn & Sets Lab feature (`feature/venn-sets`):
  - Types committed first in `src/features/venn-sets/types.ts`.
  - Pure domain modules in `src/features/venn-sets/lib/` (`set-adapter.ts`, `regions.ts`, `shading.ts`, `identities.ts`, `inclusion-exclusion.ts`, `word-problems.ts`).
  - Isolated Zustand store in `src/features/venn-sets/store/useVennLabStore.ts`.
  - Accessible SVG Venn diagrams (2-set and 3-set) with custom paths, keyboard navigation, and region tooltips.
  - Interactive tabs: Expression Shading, Manual Shading, Identity Checker, Inclusion-Exclusion Calculator, and Word Problems.
  - Linked read-only Truth Table with bidirectional minterm highlighting.
  - Route `/venn-sets` with navigation link in `src/components/layout/Navbar.tsx`.
- [x] Create project documentation structure (`docs/` and `ai/` directories)
- [x] Configure rules and startup/shutdown checklists in [AGENTS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/AGENTS.md)
- [x] Initialize Next.js 15 (App Router) project with Tailwind CSS, Zustand, and TypeScript
- [x] Implement Boolean AST tokenizer, recursive descent parser, and evaluator (`src/lib/parser/`) supporting all standard logic gates, implication, and biconditional.
- [x] Build Truth Table Generator (`src/lib/truth-table/`) with active row highlights
- [x] Build interactive SVG Logic Circuit Visualizer (`src/components/LogicCircuit/`) with signal flow pulse animations and clickable input switches
- [x] Build Gray-code Karnaugh Map engine (`src/lib/kmap/`) with group coloring and max 4 variable rule guard
- [x] Build step-by-step Boolean Simplifier (`src/lib/simplifier/`) with law explanations and gate normalization
- [x] Build Logic Analysis Tab (`src/components/LogicAnalysis/`) for Tautology/Contradiction classification and Equivalence checks
- [x] Build UI views: Home (`/`), Workspace (`/workspace`), and About (`/about`)
- [x] Add Shareable URL Links (`?expr=...`) with copy-to-clipboard button and URL parameter auto-sync
- [x] Convert web application to native Windows desktop application using **Tauri 2.0 (Rust)** + WebView2
- [x] Implement dynamic chunk loading (`next/dynamic`) for workspace visualization tabs
- [x] Configure static Next.js production export (`out/` directory)
- [x] Package release installer using NSIS (`BoolStudio_0.1.0_x64-setup.exe`, ~2.07 MB)
- [x] Validate launch speed (< 600ms) and low memory footprint (~46 MB)

## 🏃 In Progress
- *None*

## 📌 Todo
- [ ] Export circuit diagrams as SVG or PNG images

## 📦 Backlog
- [ ] Add preset circuit templates for half/full adders and multiplexers

## 🛑 Blocked
- *None*
