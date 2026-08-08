# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-08

### Added
- Complete Next.js 15 (App Router) client-side application structure for **BoolStudio**.
- AST Tokenizer and Recursive Descent Parser supporting standard logic gates (`&`, `|`, `!`, `^`) and advanced gates (`NAND`, `NOR`, `XNOR`), along with Implication (`->`, `=>`) and Biconditional / IFF (`<=>`, `<->`).
- Truth Table Generator computing $2^N$ input combinations with active row highlights.
- SVG Logic Circuit Visualizer with clickable input switches, live signal pulse animations, and gate layout renderer supporting all standard gates and simulation of implication and biconditional using basic gates.
- Karnaugh Map Engine supporting 2, 3, and 4 variables with Gray-code ordering, color-coded minterm group overlays, and a 4-variable limit guard.
- Step-by-Step Boolean Simplifier displaying applied Boolean laws with gate normalization for advanced gates and propositional operators.
- **Logic Analysis Tab** for evaluating Tautologies, Contradictions, Contingencies, displaying Contraposition, and checking expressions for Logical Equivalence.
- **Revamped Expression Builder UI** with operator categorizations (Logic Gates, Propositional Logic, Grouping) and quick insertion buttons.
- Educational UI layout pages (`/`, `/workspace`, `/about`) styled with Slate, Indigo, and Emerald design system.
