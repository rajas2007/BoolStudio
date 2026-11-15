# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-11-15

### Added
- **Unit 6: Graph Theory Laboratory (`/graph-theory`)**: Complete discrete mathematics laboratory module with single shared Zustand state (`src/hooks/useGraphLab.ts`).
- **Pure Algorithmic Layer (`src/lib/graph-theory/`)**: Zero-UI, zero-DOM TypeScript functions adhering to the `AlgorithmOutput<T>` contract (`{ result, explanation, highlight, steps }`):
  - Adjacency and Incidence Matrix builders, Handshaking lemma verifier, matrix power $(A)^k$ walk counter.
  - Degree calculations, connected components, Tarjan/Kosaraju strongly connected components, BFS shortest path, and cycle detection.
  - Interactive Walk vs Trail vs Path vs Circuit vs Cycle validator.
  - Hierholzer's Eulerian circuit/trail solver with step playback frames.
  - Hamiltonian path and cycle solver with backtracking ($n \le 12$) and Dirac/Ore sufficient theorem checks.
  - Tree triad validator ({Connected, Acyclic, $|E| = |V| - 1$}), leaf detector, degree sequence, and BFS spanning tree generator.
  - BFS 2-colouring bipartite detector and Kőnig odd cycle witness extractor.
  - Bipartite maximum matching solver with augmenting path steps and constructive Hall's Marriage Theorem failure witness subset $S$.
  - Planar graph edge bound analyzer ($E \le 3V - 6$, $E \le 2V - 4$), Euler polyhedral formula ($V - E + F = 2$), and non-planarity proofs for $K_5$ and $K_{3,3}$.
  - Vertex coloring engine with Welsh-Powell greedy coloring, exact chromatic number $\chi(G)$ via backtracking ($n \le 10$), clique/degree bounds, and manual coloring conflict detector.
- **Interactive SVG Canvas**: Hardware-accelerated native SVG canvas with HTML5 pointer capture, smooth vertex dragging without jumps, dynamic ghost edge cursor guide, arrowheads for directed mode, and active highlight synchronization.
- **Top Toolbar**: Ergonomic toolbar with Select/Move, Add Vertex, Add Edge, Delete, Directed/Undirected conversion toggle, Presets dropdown, Undo history, Clear, and $V = X \mid E = Y$ count badge.
- **Comprehensive Test Suite (`src/lib/graph-theory/graph-algorithms.test.ts`)**: 11 automated unit tests covering all 9 topics on canonical graphs ($K_4, K_5, K_{3,3}, C_5, C_6$, Petersen, $P_5, K_{1,4}$, Disconnected, self-loops, multi-edges, walks).
- **Navigation & Architectural Documentation**: Added Graph Lab entry to Navbar and comprehensive architecture guide in `README.md`.
- **Windows Desktop Release Verification**: Validated Tauri 2.0 release compilation (`npm run tauri:build`) bundling the complete Graph Theory Lab into `src-tauri/target/release/boolstudio.exe` and `BoolStudio_0.1.0_x64-setup.exe` (2.14 MB), with live multi-process WebView2 runtime verification on Windows.

### Fixed
- Replaced previous cluttered and broken graph-theory prototype with clean 2-column desktop split layout (Left ~60% Canvas + Toolbar, Right ~40% Active Topic Panel) and 9 ordered syllabus tabs.
- Replaced stacked non-discrete Venn regions with exact SVG mask cutouts in Venn & Sets Lab.

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
