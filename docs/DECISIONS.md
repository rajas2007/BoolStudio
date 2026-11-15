# Architectural Decision Records (ADRs)

Use this document to log significant engineering and architectural choices.

---

## [ADR-001] Client-Side AST Tokenization and Parsing
* **Date**: 2026-08-08
* **Status**: Approved
* **Decision**: Implement Boolean expression parsing client-side via custom recursive descent parser outputting an Abstract Syntax Tree (AST).
* **Reason**: Low latency interactive evaluation; zero network roundtrips required for evaluating logic states.
* **Consequences**: Complex parsing logic resides in frontend bundle, managed by TypeScript and test suites.

---

## [ADR-002] Multi-Resolution K-Map Rendering
* **Date**: 2026-08-08
* **Status**: Approved
* **Decision**: Cap automatic Gray-code Karnaugh Maps to 4 input variables ($2 \times 2$ to $4 \times 4$ cells).
* **Reason**: $\ge 5$ variables require multi-dimensional projection, which degrades educational clarity in 2D UI views.
* **Consequences**: Expressions with $> 4$ variables disable the K-Map tab with an informative status badge.

---

## [ADR-003] Desktop Application Architecture via Tauri 2.0
* **Date**: 2026-11-05
* **Status**: Approved
* **Decision**: Convert the Next.js application into a native desktop application using **Tauri 2.0 (Rust)** with Microsoft Edge WebView2, combined with Next.js static production export (`output: 'export'`).
* **Reason**:
  1. Achieves ~2.14 MB installer size compared to 120+ MB for an Electron alternative.
  2. Sub-second startup (< 600ms) and minimal memory footprint (~46 MB idle RAM).
  3. Eliminates the need to bundle a Node.js runtime process inside the desktop package.
  4. Preserves 100% of the existing React/Tailwind codebase, logic engine, and routing structure.
* **Alternatives Considered**: Electron (rejected due to 100MB+ bundle bloat and heavy memory footprint), pure web PWA (rejected due to lack of deep OS integration and native installer demand).
* **Consequences**: Build pipeline produces both static web assets (`out/`) and native Windows executables (`.exe` and NSIS installer). Server-only features (e.g. Node API routes) are avoided in favor of pure client-side processing.

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

---

## [ADR-006] Unit 6 Graph Theory Laboratory Architecture
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Structure the Graph Theory Laboratory (`/graph-theory`) into two strictly decoupled layers:
  1. A pure TypeScript algorithmic core (`src/lib/graph-theory/`) with zero UI/DOM dependencies where every algorithm adheres to the `AlgorithmOutput<T>` contract: `{ result: T, explanation: string, highlight: HighlightState, steps?: StepInfo[] }`.
  2. A reactive UI layer (`src/components/GraphLab/`) powered by a single centralized Zustand store (`src/hooks/useGraphLab.ts`) containing the active graph `{ vertices, edges, isDirected }`, undo stack, presets, and active highlights.
  3. Native SVG canvas rendering with HTML5 pointer capture for smooth vertex dragging without jumps and dynamic cursor ghost lines when connecting edges in `add-edge` mode.
  4. Desktop 2-column split layout (Left ~58% Canvas + Toolbar, Right ~42% Active Topic Panel) with 9 ordered syllabus tabs matching discrete mathematics Unit 6 curricula.
* **Reason**: 
  1. The previous implementation suffered from fragmented state across tabs, duplicate algorithm code in the canvas, and vertical layout jumping that forced excessive scrolling.
  2. Decoupling pure algorithmic logic allows comprehensive headless unit testing (verified via an 11-test automated suite).
  3. Zero new dependencies were required, maintaining full static export compatibility (`output: 'export'`) and strict Tauri offline CSP security.
* **Alternatives Considered**: Bundling external graph libraries (e.g., Cytoscape.js, vis.js, D3 force simulations) — rejected due to heavy bundle overhead, non-compliance with Tauri offline CSP, and poor fit with educational discrete mathematics algorithms.
* **Consequences**: High rendering performance, zero external runtime bloat, and easily extensible syllabus topics following a standardized registration process.

---

## [ADR-007] Zero-Scroll Viewport Studio Layout & Compact Toolbar for Desktop Labs
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Refactor educational labs into high-density, zero-scroll studio viewports where the entire work area (toolbar, topic tabs, interactive canvas, and active results panel) fits completely within standard desktop resolutions without requiring page-level scrolling:
  1. Integrate lab title, unit badges, and mode tools into a single sleek studio bar (`Toolbar.tsx`), eliminating tall redundant page headers.
  2. Format topic navigation tabs as compact, horizontal tiles with concise labels that span the workspace without horizontal truncation.
  3. Lock the interactive canvas and active topic panel into matched viewport heights with internal smooth scrollbars for dense algorithmic breakdowns.
* **Reason**: User testing and desktop screenshots revealed excessive vertical scrolling where the canvas, toolbar, and algorithm step players were pushed out of the viewport.
* **Consequences**: Dramatically improved educational UX and usability across both native Windows desktop and web viewports.

---

## [ADR-008] Windows Desktop Single-Instance Mutex & WebView2 Multi-Instance Crash Prevention
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Implement a native Windows named Mutex (`Local\BoolStudio_SingleInstance_Mutex`) and window activation handler inside `src-tauri/src/main.rs`. When a second instance of BoolStudio is launched, it detects the existing running instance, brings the existing window to the foreground (`ShowWindow(hwnd, SW_RESTORE)` and `SetForegroundWindow`), and exits with code 0.
* **Reason**: Microsoft Edge WebView2 locks its user data directory (`%LOCALAPPDATA%\com.boolstudio.desktop\EBWebView`). If a user double-clicks the desktop shortcut while an existing instance or orphaned child process is running, the second instance threw a fatal `0x800700AA` ("The requested resource is in use") panic on startup.
* **Consequences**: Complete elimination of multi-instance startup crashes. Instant window focus restoration when opening the app repeatedly. Zero external crate bloat via lightweight Win32 API FFI.
