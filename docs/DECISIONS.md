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
