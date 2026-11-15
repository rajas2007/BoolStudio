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
- **Venn & Sets Lab** (`/venn-sets`): Interactive educational laboratory for set theory and the Principle of Inclusion-Exclusion (Units 1 & 3).
  - 2-Set and 3-Set SVG Venn diagram visualization with clickable, keyboard-focusable disjoint region paths and Universal set boundary $U$.
  - Manual region shading mode computing canonical sum-of-minterms / sum-of-regions set expressions in real-time.
  - Set expression shading with input parser accepting set symbols ($\cup, \cap, ', \setminus, \triangle$) and ASCII equivalents ($|, \&, !, \backslash, \text{\textasciicircum}$), adapting expressions to Boolean ASTs.
  - Identity checker evaluating two set expressions across all minterm masks, with automated equivalence reason, counterexamples, and presets (De Morgan, Distributive, Absorption, Difference, Symmetric Difference).
  - Principle of Inclusion-Exclusion (PIE) calculator with step-by-step formula substitutions, exact disjoint region decomposition, and consistency violation checks.
  - Interactive classroom word problems with hidden answers and derivations.
  - Bidirectional "Venn ↔ Truth table" minterm linkage highlighting corresponding regions on hover.
- **Navigation & Architectural Documentation**: Added Graph Lab and Venn & Sets entries to Navbar and comprehensive architecture guide in `README.md`.
- **Windows Desktop Release Verification**: Validated Tauri 2.0 release compilation (`npm run tauri:build`) bundling the complete application into `src-tauri/target/release/boolstudio.exe` and `BoolStudio_0.1.0_x64-setup.exe` (2.14 MB), with live multi-process WebView2 runtime verification on Windows.

### Changed
- **Zero-Scroll Studio Viewports for All Labs**: Extended the zero-scroll studio viewport design across all three major platforms:
  - Boolean Logic Workspace (`/workspace`): Replaced page-scrolling input with a compact top toolbar (~44px), operators ribbon (~34px), and fixed 560px scroll-contained visualization canvas.
  - Venn & Sets Lab (`/venn-sets`): Replaced page-scrolling headers with a compact toolbar (~44px), mode tabs, and matched 2-column 560px grid (left: centered SVG diagram, right: scroll-contained controls/truth table).
  - All pages fit standard desktop resolutions (1280x820) with zero window-level scrolling while preserving 100% of computational logic and state.
- **Zero-Scroll Viewport Studio Layout**: Refactored Graph Theory Lab into a high-density, zero-scroll studio viewport where the toolbar, topic tabs, canvas, and active results panel fit within standard desktop resolutions without requiring page-level scrolling.
- **Venn & Sets Lab UI Redesign**:
  - Implemented 2-column desktop layout (large $\ge 480$px Venn diagram on left, expression input and controls on right).
  - Streamlined Universal Set $U$ container to a single rounded rectangle with top-left italic "U" badge (removed nested inner box and redundant "Outside" label).
  - Converted Truth Table into a collapsible accordion section (collapsed by default).
  - Reduced default quick-example chips to 3 primary chips with a clean "More examples" toggle.
  - Set labels ($A, B, C$) moved outside circles in bold font; internal region text removed by default (available via hover tooltip or "Show labels" toggle).
  - Shaded regions use high-contrast bright indigo fill (`rgba(99, 102, 241, 0.75)` / `0.9` hover) with semi-transparent circle outlines and legend "Shaded = in result".
  - Enlarged expression input (18px+) with grouped symbol keypads (Sets, Operators, Brackets), natural English explanation, and non-intrusive inline status indicators.

### Fixed
- **Codebase ESLint & TypeScript Diagnostics**: Resolved all compiler and linter diagnostics across `src/components/GraphLab/Toolbar.tsx`, `src/lib/` (`kmap`, `logic`, `parser`, `simplifier`, `types`), and `src/components/` (`ExpressionInput`, `LogicCircuit`, `Simplification`). All checks now pass with 0 errors and 0 warnings.
- **Windows Desktop WebView2 Multi-Instance Crash (`0x800700AA`)**: Implemented a Win32 named Mutex (`Local\BoolStudio_SingleInstance_Mutex`) in `src-tauri/src/main.rs`. Launching a second instance now brings the existing window to the foreground and exits cleanly with code 0 instead of panicking on WebView2 user data directory file lock collision.
- **Panic & Crash Diagnostics**: Added runtime panic hooks and logging in `src-tauri/src/main.rs` and `lib.rs` capturing fatal errors to `%LOCALAPPDATA%\com.boolstudio.desktop\`.
- **One-Click Launcher (`run-app.bat`)**: Added root batch launcher and `npm run app` script ensuring seamless launch from Explorer or terminal.
- Replaced previous cluttered and broken graph-theory prototype with clean 2-column desktop split layout (Left ~60% Canvas + Toolbar, Right ~40% Active Topic Panel) and 9 ordered syllabus tabs.
- Replaced stacked non-discrete Venn regions with exact SVG mask cutouts in Venn & Sets Lab.
- Fixed false-positive error on "A U B" by contextually disambiguating "U" (union vs universal set).
- Corrected minterm indexing to standard MSB-first ($A$ is MSB, $C$ is LSB; $m_1 = A'B'C$, $m_4 = AB'C'$), eliminating inverted region shading in the diagram and truth table.
- Replaced flawed manual SVG arc paths with exact SVG `<clipPath>` (for bit 1) and `<mask fill="white"><circle fill="black"/></mask>` (for bit 0) boolean composition for all 8 regions (and 4 regions for 2 sets), ensuring pixel-perfect mutually disjoint region fills with circle outlines on top.

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
- Core Boolean AST parser supporting arbitrary expressions.
- Logic circuit canvas rendering live interactive SVG circuits.
- Gray-code Karnaugh Map visualization with automatic grouping overlays.
- Step-by-step Boolean algebraic simplifier displaying applied equivalence laws.
- Truth table generator with active input highlights.
- Shareable URLs encoding expression state in query parameters.
