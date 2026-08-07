# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-08

### Added
- Complete Next.js 15 (App Router) client-side application structure for **BoolStudio**.
- AST Tokenizer and Recursive Descent Parser supporting `&` (AND), `|` (OR), `!` (NOT), `^` (XOR), and `()` (Parentheses).
- Truth Table Generator computing $2^N$ input combinations with active row highlights.
- SVG Logic Circuit Visualizer with clickable input switches, live signal pulse animations, and gate layout renderer (AND, OR, NOT, XOR).
- Karnaugh Map Engine supporting 2, 3, and 4 variables with Gray-code ordering, color-coded minterm group overlays, and a 4-variable limit guard.
- Step-by-Step Boolean Simplifier displaying applied Boolean laws (Identity, Complement, De Morgan, Absorption).
- Educational UI layout pages (`/`, `/workspace`, `/about`) styled with Slate, Indigo, and Emerald design system.
