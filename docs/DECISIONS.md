# Architectural & Technical Decisions (ADR)

Use this document to log significant engineering and architectural decisions. Do not overwrite previous decisions; append new ones chronologically.

---

## [ADR-001] Documentation & Agent Coordination Setup
* **Date**: 2026-08-08
* **Status**: Approved
* **Decision**: Establish a structured markdown-based documentation system in `docs/` and `ai/` directories, alongside a developer rules guide in [AGENTS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/AGENTS.md).
* **Reason**: To support seamless handoffs, task management, and design memory preservation across asynchronous development agent sessions.
* **Alternatives Considered**: Keeping all task context in interactive prompts, or utilizing code-only docstrings.
* **Consequences**: Developers and agents must strictly follow startup/shutdown checklists to prevent documentation drift.

---

## [ADR-002] Client-Side Boolean Parsing & Simulation Architecture
* **Date**: 2026-08-08
* **Status**: Approved
* **Decision**: Build the Boolean parser, evaluator, truth table generator, K-map reduction solver, and SVG circuit generator strictly client-side using Next.js 15, TypeScript, and Zustand.
* **Reason**: Provides zero latency during live input toggling and interactive signal propagation without requiring server endpoints.
* **Alternatives Considered**: Server-side API routes for evaluation.
* **Consequences**: Entire evaluation loop runs in-browser with zero latency.

---

## [ADR-003] Desktop Application Architecture via Tauri 2.0 and Next.js Static Export
* **Date**: 2026-11-05
* **Status**: Approved
* **Decision**: Convert BoolStudio into an optimized native desktop application using Tauri 2.0 (Rust) with Next.js static export (`output: 'export'`) and Windows Microsoft Edge WebView2.
* **Reason**: 
  1. BoolStudio has no server API routes, middleware, or database requirements, making it 100% compatible with static export.
  2. Tauri 2.0 eliminates the overhead of bundling a Node.js runtime and Chromium browser, resulting in a ~2.07 MB installer, < 600ms cold startup, and ~46 MB RAM usage (vs ~150 MB installer and ~250 MB RAM in Electron).
  3. No local HTTP server ports are opened in production, improving security and eliminating firewall prompts.
* **Alternatives Considered**: Electron (too heavy, high RAM/installer bloat), PWA (lacks native window controls, desktop shortcuts, and NSIS installer packaging).
* **Consequences**: Building the desktop application requires the Rust toolchain and MSVC build tools. Both web (`npm run dev`) and desktop (`npm run tauri:dev` / `npm run tauri:build`) workflows remain cleanly supported.

---

## [ADR-004] Unit 6 Graph Theory Laboratory Architecture
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Structure the Graph Theory Laboratory (`/graph-theory`) into two strictly decoupled layers:
  1. A pure TypeScript algorithmic core (`src/lib/graph-theory/`) with zero UI/DOM dependencies where every algorithm adheres to the `AlgorithmOutput<T>` contract: `{ result: T, explanation: string, highlight: HighlightState, steps?: StepInfo[] }`.
  2. A reactive UI layer (`src/components/GraphLab/`) powered by a single centralized Zustand store (`src/hooks/useGraphLab.ts`) containing the active graph `{ vertices, edges, isDirected }`, undo stack, presets, and active highlights.
  3. Native SVG canvas rendering with HTML5 pointer capture for smooth vertex dragging without jumps and dynamic cursor ghost lines when connecting edges in `add-edge` mode.
  4. Desktop 2-column split layout (Left ~60% Canvas + Toolbar, Right ~40% Active Topic Panel) with 9 ordered syllabus tabs matching discrete mathematics Unit 6 curricula.
* **Reason**: 
  1. The previous implementation suffered from fragmented state across tabs, duplicate algorithm code in the canvas, and vertical layout jumping that forced excessive scrolling.
  2. Decoupling pure algorithmic logic allows comprehensive headless unit testing (verified via an 11-test automated suite).
  3. Zero new dependencies were required, maintaining full static export compatibility (`output: 'export'`) and strict Tauri offline CSP security.
* **Alternatives Considered**: Bundling external graph libraries (e.g., Cytoscape.js, vis.js, D3 force simulations) — rejected due to heavy bundle overhead, non-compliance with Tauri offline CSP, and poor fit with educational discrete mathematics algorithms (e.g., Hall's Marriage Theorem, Hierholzer's, Dirac/Ore bounds).
* **Consequences**: High rendering performance, zero external runtime bloat, and easily extensible syllabus topics following a standardized 5-step registration process.
