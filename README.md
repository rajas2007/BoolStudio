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
