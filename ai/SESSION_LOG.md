# Session History

## [2026-08-08] - Initial Workspace & Core Engine Implementation
- **Summary**: Built the complete client-side **BoolStudio** web application using Next.js 15, Tailwind CSS, Zustand, Framer Motion, and Lucide React.
- **Files Changed**:
  - `src/lib/types/boolean.ts`
  - `src/hooks/useBooleanStudio.ts`
  - `src/lib/parser/*`
  - `src/lib/logic/*`
  - `src/lib/truth-table/*`
  - `src/lib/kmap/*`
  - `src/lib/simplifier/*`
  - `src/lib/engine/*`
  - `src/components/*`
  - `src/app/*`
- **Features Completed**:
  - Expression tokenizer and AST parser supporting `&`, `|`, `!`, `^`, `()`.
  - Responsive Truth Table generator with active input row highlighting.
  - Interactive SVG digital logic circuit diagram with live signal pulses and clickable input switches.
  - Karnaugh Map solver for 2, 3, and 4 variables with Gray-code grids and minterm group overlays.
  - Step-by-step Boolean algebraic simplifier tracking applied Boolean laws.
  - Home, Workspace, and About page routes with slate, indigo, and emerald styling.
- **Bugs Fixed**: Resolved Lucide icon import name mismatch (`Information` -> `Info`, unused `Github`).
- **Known Issues**: None.

## [2026-08-08] - Shareable URL Links & Code Cleanup
- **Summary**: Added URL query parameter syncing (`/workspace?expr=...`), Share Link copy button, and cleaned default template assets (`public/*.svg`, `CLAUDE.md`).
- **Files Changed**:
  - [src/components/ExpressionInput/ExpressionInput.tsx](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/src/components/ExpressionInput/ExpressionInput.tsx)
  - [src/components/Workspace/WorkspaceView.tsx](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/src/components/Workspace/WorkspaceView.tsx)
  - Removed `CLAUDE.md` and unused starter SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
- **Features Completed**:
  - URL parameter auto-syncing (`?expr=...`).
  - One-click share link clipboard copying.
  - Workspace directory cleanup.
