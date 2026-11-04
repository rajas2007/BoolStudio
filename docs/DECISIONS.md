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
