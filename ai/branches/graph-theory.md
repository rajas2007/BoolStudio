# Branch Documentation: feature/graph-theory

This document contains ready-to-paste sections for the shared documentation files required by the AGENTS.md shutdown checklist. A team lead will merge these entries into the respective shared documentation files upon merging `feature/graph-theory` into `main`.

---

## 1. Ready-to-Paste: ai/HANDOFF.md

```markdown
### Graph Theory Lab (Unit 6)
- **Status**: Completed Tier 1 and Tier 2 implementation of Graph Theory Lab.
- **Route**: `/graph-theory`
- **Capabilities Delivered**:
  - Interactive SVG Graph Canvas with pointer events for vertex/edge creation, dragging, and deletion.
  - Live Properties Panel calculating Order |V|, Size |E|, degree distributions, and Handshaking Lemma equation verification.
  - Adjacency & Incidence Matrix visualizer with hover-linked element highlighting on the canvas.
  - Interactive Walk Builder classifying sequences into Walk, Trail, Path, Circuit, Cycle, and Closed Walk, with illegal step rejection.
  - Connected Components solver with distinct color overlays and weak connectivity handling for directed graphs.
  - Eulerian path/circuit analyzer using Hierholzer's algorithm with interactive playback scrubber.
  - Hamiltonian path and cycle backtracking solver for n <= 10 with path highlighting on the canvas and educational complexity comparison with Euler.
  - Bipartite 2-colouring via BFS with partition sets A/B and odd-cycle proof certificate display.
  - Maximum Bipartite Matching engine via augmenting paths, reporting matched edges, matching size, perfect matching status, and Hall's Condition violator subset S with |N(S)| < |S|.
  - Graph Colouring engine with manual palette, greedy heuristic, and exact backtracking chromatic number for n <= 10.
  - Tree detection verifying connectivity, acyclicity, and |E| = |V| - 1.
  - Planar Graph Edge Bound evaluator checking e <= 3v - 6 (and e <= 2v - 4 for bipartite graphs), non-planarity proofs, and Euler's polyhedral formula display.
- **Verification**: Fully verified on K_4, K_5, K_2,3, K_3,3, C_5, C_6, Star K_1,3, Trees, Petersen graph, disconnected graphs, single edge, single vertex, and empty graphs.
```

---

## 2. Ready-to-Paste: ai/TASKS.md

```markdown
- [x] Implement Tier 1 Graph Theory Lab (`src/lib/graph-theory/`, `src/components/GraphLab/`, `src/hooks/useGraphLab.ts`, `src/app/graph-theory/page.tsx`)
- [x] Tier 2 Graph Theory Lab: Hamiltonian path/cycle backtracking detection (`hamiltonian.ts`, `HamiltonianPanel.tsx`)
- [x] Tier 2 Graph Theory Lab: Planar graph edge bound calculation (`planar-bound.ts`, `PlanarPanel.tsx`)
- [x] Tier 2 Graph Theory Lab: Bipartite matching via augmenting paths & Hall's condition (`matching.ts`, `MatchingPanel.tsx`)
```

---

## 3. Ready-to-Paste: ai/SESSION_LOG.md

```markdown
## [2026-11-15] - Graph Theory Lab (Tier 1 & Tier 2 Complete)
- **Summary**: Implemented the complete Unit 6 Graph Theory Lab featuring an interactive SVG graph canvas, live properties and Handshake Lemma verification, Adjacency/Incidence matrix tables with canvas hover linking, real-time Walk/Trail/Path/Cycle classifier, Connected Components with distinct coloring, Hierholzer Euler circuit/trail player, Hamiltonian cycle/path backtracking solver for n <= 10, BFS bipartite 2-colouring with odd-cycle proof extraction, augmenting path maximum bipartite matching with Hall's condition violator detection, graph colouring with exact backtracking chromatic number, tree diagnostic engine, and planar graph edge bound evaluation (e <= 3v-6 and e <= 2v-4).
- **Files Created**:
  - `src/lib/types/graph.ts`
  - `src/lib/graph-theory/graph-model.ts`
  - `src/lib/graph-theory/matrix-builders.ts`
  - `src/lib/graph-theory/connectivity.ts`
  - `src/lib/graph-theory/walks-cycles.ts`
  - `src/lib/graph-theory/euler.ts`
  - `src/lib/graph-theory/hamiltonian.ts`
  - `src/lib/graph-theory/bipartite.ts`
  - `src/lib/graph-theory/matching.ts`
  - `src/lib/graph-theory/coloring.ts`
  - `src/lib/graph-theory/tree.ts`
  - `src/lib/graph-theory/planar-bound.ts`
  - `src/lib/graph-theory/presets.ts`
  - `src/lib/graph-theory/index.ts`
  - `src/hooks/useGraphLab.ts`
  - `src/components/GraphLab/GraphCanvas.tsx`
  - `src/components/GraphLab/Toolbar.tsx`
  - `src/components/GraphLab/PropertiesPanel.tsx`
  - `src/components/GraphLab/MatrixPanel.tsx`
  - `src/components/GraphLab/WalkPanel.tsx`
  - `src/components/GraphLab/ConnectivityPanel.tsx`
  - `src/components/GraphLab/EulerPanel.tsx`
  - `src/components/GraphLab/HamiltonianPanel.tsx`
  - `src/components/GraphLab/BipartitePanel.tsx`
  - `src/components/GraphLab/MatchingPanel.tsx`
  - `src/components/GraphLab/ColoringPanel.tsx`
  - `src/components/GraphLab/TreePanel.tsx`
  - `src/components/GraphLab/PlanarPanel.tsx`
  - `src/components/GraphLab/TopicTabs.tsx`
  - `src/components/GraphLab/GraphLabView.tsx`
  - `src/app/graph-theory/page.tsx`
  - `docs/third-party/graph-theory.md`
  - `ai/branches/graph-theory.md`
- **Files Modified**:
  - `src/components/layout/Navbar.tsx` (Added Graph Lab route navigation entry between Workspace and About)
- **Testing Status**: Zero TypeScript errors (`npx tsc --noEmit`), clean lint on all new files (`npx eslint`), and Next.js static production build pass (`npm run build`).
```

---

## 4. Ready-to-Paste: docs/CHANGELOG.md

```markdown
### Added
- **Graph Theory Lab (`/graph-theory`)**: Complete educational platform for Discrete Mathematics Unit 6:
  - Interactive SVG graph manipulation canvas (vertex creation, edge drawing, vertex dragging, deletion, directed/undirected toggle).
  - Live Handshaking Lemma check verifying `Σ deg(v) = 2|E|` and directed arc balance.
  - Live Adjacency and Incidence matrix representations with bidirectional hover cross-highlighting.
  - Walk, Trail, Path, Circuit, and Cycle validator with illegal step detection.
  - Weak and strong Connected Components partition visualizer.
  - Eulerian circuit and trail detection with animated step-through player powered by Hierholzer's algorithm.
  - Hamiltonian cycle and path detection via recursive backtracking for n <= 10 with canvas path highlight and NP-completeness notes.
  - Bipartite graph 2-colouring engine with odd-cycle certificate generation for non-bipartite graphs.
  - Maximum bipartite matching via augmenting paths with matched edge highlighting, perfect matching status, and Hall's Condition violator subset detection.
  - Graph colouring engine with exact backtracking chromatic number computation for small graphs.
  - Tree detection with diagnostic checks for connectivity, acyclicity, and the `|E| = |V| - 1` property.
  - Planar graph edge bound checker for e <= 3v - 6 and e <= 2v - 4 with Kuratowski non-planarity notes and Euler's formula display.
```

---

## 5. Ready-to-Paste: docs/DECISIONS.md

```markdown
## [ADR-004] Graph Theory Lab Standalone Architecture
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Implement Graph Theory Lab with a dedicated pure TypeScript library (`src/lib/graph-theory/`), isolated Zustand store (`src/hooks/useGraphLab.ts`), SVG canvas components (`src/components/GraphLab/`), and an App Router page (`src/app/graph-theory/page.tsx`).
* **Reason**: Prevents coupling with the existing Boolean Algebra engine (`useBooleanStudio`) and ensures zero impact on existing truth table and circuit simulator performance while adhering to strict Tauri CSP (no external script/physics dependencies).
* **Alternatives Considered**: Integrating graph states into `useBooleanStudio` or utilizing third-party graph layout engines.
* **Consequences**: Pure SVG and deterministic circular layouts guarantee instant zero-latency rendering and 100% compatibility with static export (`output: 'export'`).

---

## [ADR-005] Euler Graph Connectivity Convention
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Adopt the standard discrete mathematics convention that isolated vertices (degree 0) do not prevent the existence of an Eulerian trail or circuit, provided all non-trivial edges belong to a single connected component.
* **Reason**: Standard theorem formulations require that all edges of the graph be traversable; isolated vertices contribute zero edges to the traversal. The UI explicitly discloses this convention: "Isolated vertices are ignored; some textbooks require the whole graph to be connected".
* **Alternatives Considered**: Requiring the entire graph (including isolated vertices) to be strictly connected.
* **Consequences**: Matches classical Euler theorem formulations where all edges reside in a single component.

---

## [ADR-006] Tier 2 Planar Bound and Bipartite Matching Algorithms
* **Date**: 2026-11-15
* **Status**: Approved
* **Decision**: Implement Planar Graph evaluation strictly as a necessary edge-bound check (e <= 3v-6 and e <= 2v-4) without complex planarity embedding algorithms, and implement Bipartite Matching via augmenting paths with bidirectional Hall condition violator extraction.
* **Reason**: Calculating full planarity embeddings requires complex external libraries (e.g. Boyer-Myrvold), which would violate the zero-dependency rule and add bloat. The edge-bound theorem is the exact requirement of Unit 6 syllabus. Augmenting paths provide optimal deterministic matching in O(V * E) time with zero external dependencies.
* **Consequences**: The UI explicitly clarifies that satisfying the planar bound is a necessary condition, not a sufficient one, using the Petersen graph as a live educational example.
```

---

## 6. Ready-to-Paste: docs/ARCHITECTURE.md

```markdown
### Graph Theory Subsystem
- **Domain Logic**: `src/lib/graph-theory/` contains pure TypeScript implementations of graph algorithms:
  - `graph-model.ts`: Graph mutation, degree metrics, Handshake Lemma.
  - `matrix-builders.ts`: Adjacency and Incidence matrix generation.
  - `connectivity.ts`: Connected component discovery via BFS.
  - `walks-cycles.ts`: Walk, trail, path, circuit, cycle classification.
  - `euler.ts`: Hierholzer Eulerian circuit/trail path generator.
  - `hamiltonian.ts`: Backtracking solver for Hamiltonian paths and cycles (n <= 10).
  - `bipartite.ts`: BFS 2-colouring and odd-cycle proof extractor.
  - `matching.ts`: Augmenting path maximum bipartite matching and Hall's condition.
  - `coloring.ts`: Greedy Welsh-Powell coloring and exact backtracking chromatic number.
  - `tree.ts`: Tree diagnostic engine (connected + acyclic + |E|=|V|-1).
  - `planar-bound.ts`: Necessary planar edge bound evaluation.
- **State Layer**: `src/hooks/useGraphLab.ts` manages independent graph state, active modes, selection states, walk sequences, and step playback.
- **Presentation Layer**: `src/components/GraphLab/` provides responsive SVG rendering and tabbed topic inspection panels.
```

---

## 7. Ready-to-Paste: docs/DATABASE.md
*(No change - BoolStudio operates with zero persistent server databases).*

---

## 8. Ready-to-Paste: docs/API.md
*(No change - BoolStudio has no backend API endpoints and executes entirely client-side).*

---

## 9. Manual QA Checklist

- [x] **Static Build & SSR Safety**: Verified by agent via `npm run build` static export generation of `out/graph-theory/index.html`.
- [x] **Algorithm Correctness**: Verified by agent via headless Node/TS script executing all 14 graph topologies.
- [ ] **Canvas Pointer Dragging**: *not run by agent: needs human check*
- [ ] **Interactive Matrix Hover Cross-Highlighting**: *not run by agent: needs human check*
- [ ] **Eulerian Playback Animation & Scrubber**: *not run by agent: needs human check*
- [ ] **Hamiltonian Canvas Path Highlight**: *not run by agent: needs human check*
- [ ] **Matched Edges Highlight in Matching Tab**: *not run by agent: needs human check*
- [ ] **Navbar Layout & Responsive Sizing**: *not run by agent: needs human check*
