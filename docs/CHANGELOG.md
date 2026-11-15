# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Venn & Sets Lab** (`/venn-sets`): Interactive educational laboratory for set theory and the Principle of Inclusion-Exclusion (Units 1 & 3).
  - 2-Set and 3-Set SVG Venn diagram visualization with clickable, keyboard-focusable disjoint region paths and Universal set boundary $U$.
  - Manual region shading mode computing canonical sum-of-minterms / sum-of-regions set expressions in real-time.
  - Set expression shading with input parser accepting set symbols ($\cup, \cap, ', \setminus, \triangle$) and ASCII equivalents ($|, \&, !, \backslash, \text{\textasciicircum}$), adapting expressions to Boolean ASTs.
  - Identity checker evaluating two set expressions across all minterm masks, with automated equivalence reason, counterexamples, and presets (De Morgan, Distributive, Absorption, Difference, Symmetric Difference).
  - Principle of Inclusion-Exclusion (PIE) calculator with step-by-step formula substitutions, exact disjoint region decomposition, and consistency violation checks.
  - Interactive classroom word problems with hidden answers and derivations.
  - Bidirectional "Venn ↔ Truth table" minterm linkage highlighting corresponding regions on hover.
- Navigation entry for "Venn & Sets" in `src/components/layout/Navbar.tsx`.
- Third-party attribution documentation in `docs/third-party/venn-sets.md`.

### Changed
- **Venn & Sets Lab UI Redesign**:
  - Implemented 2-column desktop layout (large $\ge 480$px Venn diagram on left, expression input and controls on right).
  - Streamlined Universal Set $U$ container to a single rounded rectangle with top-left italic "U" badge (removed nested inner box and redundant "Outside" label).
  - Converted Truth Table into a collapsible accordion section (collapsed by default).
  - Reduced default quick-example chips to 3 primary chips with a clean "More examples" toggle.
  - Set labels ($A, B, C$) moved outside circles in bold font; internal region text removed by default (available via hover tooltip or "Show labels" toggle).
  - Shaded regions use high-contrast bright indigo fill (`rgba(99, 102, 241, 0.75)` / `0.9` hover) with semi-transparent circle outlines and legend "Shaded = in result".
  - Enlarged expression input (18px+) with grouped symbol keypads (Sets, Operators, Brackets), natural English explanation, and non-intrusive inline status indicators.

### Fixed
- **Single Source of Truth Evaluator & Parser Rewrite**:
  - Rewrote expression tokenizer and recursive descent parser with strict precedence ($' > \cap > \cup = \triangle = \setminus$) and left-associativity.
  - Unified input normalization supporting symbols ($\cup, \cap, ', \setminus, \triangle$) and text/ASCII aliases (`"union"`, `"and"`, `|`, `&`, `!`, `~`, `\`, `-`, `^^`).
  - Fixed false-positive error on "A U B" by contextually disambiguating "U" (union vs universal set).
  - Precise syntax error diagnosis with exact index mapping in the original input string.
  - Corrected minterm indexing to standard MSB-first ($A$ is MSB, $C$ is LSB; $m_1 = A'B'C$, $m_4 = AB'C'$), eliminating inverted region shading in the diagram and truth table.
  - Replaced flawed manual SVG arc paths with exact SVG `<clipPath>` (for bit 1) and `<mask fill="white"><circle fill="black"/></mask>` (for bit 0) boolean composition for all 8 regions (and 4 regions for 2 sets), ensuring pixel-perfect mutually disjoint region fills with circle outlines on top.
  - Added full test suite with 27 unit tests validating parser cases, hand-computed expected minterm sets, and quick-test invariants.

---

## [1.1.0] - 2026-11-05

### Added
- Native Windows Desktop application target using **Tauri 2.0 (Rust)** and Microsoft Edge WebView2.
- Production Windows NSIS setup package (`BoolStudio_0.1.0_x64-setup.exe`, 2.07 MB) and standalone executable (`boolstudio.exe`).
- Multi-resolution native application icons and branding across all desktop contexts.
- Desktop scripts: `npm run tauri:dev` and `npm run tauri:build`.
- Dynamic code splitting using `next/dynamic` for workspace tabs (`TruthTable`, `LogicCircuit`, `KMap`, `Simplification`, `LogicAnalysis`) to reduce initial load times.
- Package import optimizations for `lucide-react` and `framer-motion` in `next.config.ts`.
- Restrictive Content Security Policy (CSP) and zero-open-port offline architecture.

### Changed
- Configured Next.js static export (`output: 'export'`, `trailingSlash: true`, unoptimized images) allowing offline loading without a local Node.js server.
- Updated `README.md`, `ARCHITECTURE.md`, and technical decisions documentation.

---

## [1.0.0] - 2026-08-08

### Added
- Complete Next.js 15 (App Router) client-side application structure for **BoolStudio**.
- AST Tokenizer and Recursive Descent Parser supporting standard logic gates (`&`, `|`, `!`, `^`) and advanced gates (`NAND`, `NOR`, `XNOR`), along with Implication (`->`, `=>`) and Biconditional / IFF (`<=>`, `<->`).
- Truth Table Generator computing $2^N$ input combinations with active row highlights.
- SVG Logic Circuit Visualizer with clickable input switches, live signal pulse animations, and gate layout renderer supporting all standard gates and simulation of implication and biconditional using basic gates.
- Karnaugh Map Engine supporting 2, 3, and 4 variables with Gray-code ordering, color-coded minterm group overlays, and a 4-variable limit guard.
- Step-by-Step Boolean Simplifier displaying applied Boolean laws with gate normalization for advanced gates and propositional operators.
- **Logic Analysis Tab** for evaluating Tautologies, Contradictions, Contingencies, displaying Contraposition, and checking expressions for Logical Equivalence.
- **Revamped Expression Builder UI** with operator categorizations (Logic Gates, Propositional Logic, Grouping) and quick insertion buttons.
- Educational UI layout pages (`/`, `/workspace`, `/about`) styled with Slate, Indigo, and Emerald design system.
