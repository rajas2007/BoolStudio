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

## [ADR-004] Venn & Sets Lab Architecture
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Implement the "Venn & Sets Lab" feature in a self-contained feature directory (`src/features/venn-sets/`) using a dedicated Zustand store (`useVennLabStore`), an SVG-based region renderer, and a thin adapter that maps set-theoretic expressions to BoolStudio's existing Boolean AST parser and evaluator.
* **Reason**:
  1. Adheres to the principle that a region in an $n$-set Venn diagram corresponds directly to a Boolean minterm/truth-table row.
  2. Preserves existing codebase integrity by reusing BoolStudio's tokenizer, parser, and evaluator without any modifications to core parser code.
  3. Complies with Tauri strict CSP and Next.js static export (`output: 'export'`) by generating SVG paths natively without third-party chart dependencies (e.g. Chart.js, D3).
* **Alternatives Considered**: Using Chart.js / `chartjs-chart-venn` (rejected due to external dependency constraint and strict CSP rules), writing a separate set parser from scratch (rejected to prevent duplicate parsing logic).
* **Consequences**: Adding set operators is handled in the adapter. The feature is 100% client-side, offline-capable, and decoupled from the main Boolean Studio store.

---

## [ADR-005] Venn & Sets Lab Single-Source Evaluator & Exact ClipPath/Mask Region Geometry
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: 
  1. Implement a unified, standalone Set AST evaluator (`src/features/venn-sets/lib/parser.ts` and `src/features/venn-sets/lib/evaluator.ts`) that serves as the single source of truth across Venn diagram shading, minterm truth tables, example presets, and identity verification. Establish standard MSB-first minterm indexing: in 3 sets, bit 2 is A, bit 1 is B, bit 0 is C ($m_0=A'B'C', m_1=A'B'C, \dots, m_7=ABC$).
  2. Implement SVG region rendering using exact recursive `<clipPath>` (for bit=1, inside circle) and inverted `<mask fill="white"><circle fill="black"/></mask>` (for bit=0, outside circle) composition applied to a bounding rectangle for each region, replacing fragile manual SVG arc paths. Circle outlines are drawn on top.
* **Reason**:
  1. Hand-crafted SVG arc paths (`M... A... Z`) were geometrically flawed, resulting in partial slivers and distorted shapes rather than full overlapping circular regions.
  2. Applying boolean clipping and masking per bitvector $[a, b, c]$ guarantees that all 8 regions (and 4 regions for 2 sets) are 100% mutually disjoint and mathematically exact without geometric bleeding or approximations.
  3. Disambiguating the letter "U" (union operator vs universal set) requires grammar-level lookback rather than naive string replacement.
  4. Having a single evaluator guarantees mathematical consistency: the exact boolean result on each minterm bit vector dictates both the Venn region fill and the truth table row.
* **Alternatives Considered**: Modifying global Boolean parser in `src/lib/parser/` (rejected to maintain zero edits on existing code), manual bezier arc path approximation (rejected due to clipping artifacts).
* **Consequences**: Exact pixel-perfect rendering across all 8 disjoint Venn regions, full compatibility with SVG hover/click interactions, and zero discrepancies between diagram and truth table.
