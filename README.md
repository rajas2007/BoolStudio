# BoolStudio ⚡

> Professional, high-performance Boolean Algebra and Digital Logic Visualizer — available as both a web application and an ultra-lightweight Windows desktop application.

---

## 🏛 Overview

BoolStudio is an interactive educational and engineering software application for Boolean algebra, truth tables, Karnaugh maps, and logic circuit design. It evaluates expressions, computes $2^N$ truth table states, formats Gray-code Karnaugh maps, solves prime implicants, and simulates live logic gates with interactive input switches.

---

## 🚀 Technology Stack

### Desktop Application
* **Framework**: Tauri 2.0 (Rust)
* **Webview Runtime**: Microsoft Edge WebView2 (zero bundled browser bloat)
* **Frontend**: Next.js 16 (Static Export), React 19, TypeScript 5
* **Styling**: Tailwind CSS 4, Glassmorphism design tokens, Lucide Icons
* **State Management**: Zustand
* **Installer**: Windows NSIS setup package (`.exe`)

### Web Platform
* **Runtime**: Node.js / Modern Web Browsers
* **Hosting**: Compatible with Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host

---

## ⚡ Performance Benchmarks

| Metric | BoolStudio Desktop (Tauri 2) | Typical Electron App |
|---|---|---|
| **Installer Size** | **~2.07 MB** | ~100–150 MB |
| **Startup Time** | **< 600 ms** | 2–5 seconds |
| **RAM at Idle** | **~46 MB** | ~200–350 MB |
| **CPU Usage** | **< 0.2%** | 2–8% |
| **Server Requirement** | **None (Pure static client-side)** | Local Node process |

---

## 🛠 Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [Rust](https://www.rust-lang.org/) (for desktop development: `winget install Rustlang.Rustup`)
* Microsoft Visual Studio C++ Build Tools (MSVC)
* Windows 10/11 with WebView2 (pre-installed on modern Windows)

### Installation
```bash
git clone https://github.com/shravan/BoolStudio.git
cd BoolStudio
npm install
```

---

## 💻 Commands

### Web Development
```bash
# Run web development server with hot-reload
npm run dev

# Build static production export (out/ directory)
npm run build

# Preview static export
npm run start
```

### Desktop Application (Tauri 2.0)
```bash
# Launch desktop app in development mode with live reload
npm run tauri:dev

# Compile release desktop binary and Windows installer
npm run tauri:build
```

---

## 📦 Windows Installer Location

After running `npm run tauri:build`, the final production artifacts are generated at:

* **Windows NSIS Installer**:
  ```text
  src-tauri/target/release/bundle/nsis/BoolStudio_0.1.0_x64-setup.exe
  ```
  *(Size: ~2.07 MB — provides Start Menu shortcut, Desktop shortcut, and clean uninstaller)*

* **Standalone Portable Executable**:
  ```text
  src-tauri/target/release/boolstudio.exe
  ```

---

## 🌐 Unit 6: Graph Theory Laboratory

BoolStudio includes an interactive Graph Theory educational laboratory located at `/graph-theory`.

### Architectural Principles
1. **Single Source of Truth**: The active graph state `{ vertices, edges, isDirected }` resides in a centralized Zustand store (`src/hooks/useGraphLab.ts`). The canvas, all 9 topic tabs, and result panels operate on this single shared representation.
2. **Pure Algorithmic Decoupling**: All algorithms (`src/lib/graph-theory/`) are 100% pure TypeScript functions with **zero** UI or DOM dependencies. Each algorithm adheres to the standard contract:
   ```ts
   export interface AlgorithmOutput<T> {
     result: T;
     explanation: string;
     highlight: HighlightState; // Vertices/edges to highlight on canvas
     steps?: StepInfo[];        // Optional step-by-step playback frames
   }
   ```
3. **Hardware-Accelerated Native SVG**: Graph rendering uses standard vector SVG and HTML5 pointer capture events for smooth vertex manipulation and edge creation without external heavy D3, MathJax, or canvas runtimes, strictly adhering to Tauri's strict offline CSP.
4. **Desktop 2-Column Split Layout**: Left column (~60%) hosts the interactive canvas and editor toolbar; right column (~40%) hosts the active topic's controls, theorems, matrices, and step players without vertical jumping.

### The 9 Syllabus Topics (Unit 6)
1. **Representations & Properties**: Adjacency list, Adjacency matrix $A$ (with symmetry and degree row/col sums), Incidence matrix $M$ (column sum theorem), Euler's Handshaking lemma, and $(A)^k$ matrix walk power counter.
2. **Degrees, Walks, Paths, Cycles & Components**: In/out/total degree tables with odd degree alerts, connected and strongly connected components (Kosaraju/Tarjan), BFS shortest path queries, and an interactive Walk vs Trail vs Path vs Circuit vs Cycle classifier.
3. **Euler Tours & Trails**: Undirected and directed Euler theorems, Hierholzer's algorithm, clear failure diagnostics, and step playback controls ([⏮] [◀] [▶/⏸] [▶] [⏭]).
4. **Hamiltonian Paths & Cycles**: Backtracking exact solver ($n \le 12$), Dirac's ($\delta \ge n/2$) and Ore's ($\deg(u)+\deg(v) \ge n$) sufficient conditions, and step-through highlights.
5. **Trees & Spanning Trees**: Triad verification ({Connected, Acyclic, $|E| = |V| - 1$}), cycle failure witness extraction, leaf identification, degree sequence, and BFS spanning tree generation.
6. **Bipartite Graphs & 2-Colourability**: BFS 2-colouring algorithm, Set A and Set B partition display with canvas vertex coloring, and Kőnig odd cycle witness identification.
7. **Matching in Bipartite Graphs**: Augmenting path maximum matching, perfect vs saturating status, and Hall's Marriage Theorem with constructive failure witness subset $S$ ($|N(S)| < |S|$).
8. **Planar Graphs & Edge Bounds**: General ($E \le 3V - 6$) and bipartite ($E \le 2V - 4$) bounds, Euler polyhedral formula ($V - E + F = 2$), non-planarity proofs for $K_5$ and $K_{3,3}$, and explicit inconclusive rule reminder.
9. **Graph Colouring**: Greedy coloring (Welsh-Powell degree-descending vs alphabetical), exact chromatic number $\chi(G)$ via backtracking ($n \le 10$), clique lower bound $\omega(G)$, degree upper bound $\Delta(G)+1$, and manual coloring conflict detector.

### How to Add a New Topic Tab
1. **Write the Pure Algorithm** in `src/lib/graph-theory/<topic>.ts`:
   Implement a pure function `computeTopic(graph: Graph, ...args): AlgorithmOutput<MyResult>` that calculates the result and returns `highlight` with vertex/edge IDs or colors to color on the canvas. Add unit tests in `src/lib/graph-theory/graph-algorithms.test.ts`.
2. **Register the Tab Identifier** in `src/lib/types/graph.ts`:
   Add the new topic identifier to the `TopicTab` union type.
3. **Add the Tab Button** in `src/components/GraphLab/TopicTabs.tsx`:
   Add the tab entry with its sequence number, display label, and Lucide icon.
4. **Create the UI Panel** in `src/components/GraphLab/<Topic>Panel.tsx`:
   Read `graph` from `useGraphLab()`, call your pure algorithm, use `setActiveHighlight` to synchronize highlights with the canvas, and provide a "Try Example" preset button.
5. **Mount the Panel** in `src/components/GraphLab/GraphLabView.tsx`:
   Dynamically import the panel using `next/dynamic` and render it when `activeTopic === '<topic>'`.

---

## 🔒 Security

* **Content Security Policy (CSP)**: Strict policy enforced in `tauri.conf.json` preventing external script injection.
* **Minimal Capabilities**: Only core windowing permissions enabled (`core:default`).
* **Zero Open Ports**: In production desktop mode, assets are served directly from the embedded package without listening on local TCP ports.

---

## 🔧 Troubleshooting

### Rust / Cargo Not Found
Ensure `$HOME\.cargo\bin` is added to your environment `PATH`:
```powershell
$env:Path = "$HOME\.cargo\bin;" + $env:Path
```

### Missing C++ Build Tools
Install the Visual Studio Build Tools C++ workload:
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```

---

## 📄 License
MIT License.
