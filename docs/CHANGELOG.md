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
