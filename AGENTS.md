<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

> [!IMPORTANT]
> **CRITICAL READ ME FIRST**: Every AI agent or developer MUST read this file in its entirety before writing any code or modifying the repository.

This project is designed to be highly self-documenting and maintainable across shifts in development agents/engineers. Documentation is treated as a first-class citizen—equivalent to source code.

---

## 🛠 AI Startup Checklist

Every coding session should begin by reading:
1. [README.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/README.md)
2. [AGENTS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/AGENTS.md)
3. [ai/HANDOFF.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/HANDOFF.md)
4. [ai/TASKS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/TASKS.md)
5. [docs/ARCHITECTURE.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/ARCHITECTURE.md)
6. [docs/DECISIONS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/DECISIONS.md)

*Only after fully understanding the current state should implementation begin.*

---

## 🛑 AI Shutdown Checklist

Before concluding every session, ensure you complete the following updates:
- [ ] Update [ai/HANDOFF.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/HANDOFF.md) (Current status, modifications, next recommendations)
- [ ] Update [ai/TASKS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/TASKS.md) (Move tasks to completed/in-progress, update backlog)
- [ ] Update [ai/SESSION_LOG.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/SESSION_LOG.md) (Log the date, summary, files changed, features/bugs resolved)
- [ ] Update [docs/CHANGELOG.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/CHANGELOG.md) (Add items under Added, Changed, Fixed, Removed with semantic version tags)
- [ ] Update [docs/DECISIONS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/DECISIONS.md) (If any technical decisions or trade-offs were made)
- [ ] Update [docs/ARCHITECTURE.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/ARCHITECTURE.md) (If the system architecture, component relations, or module designs changed)
- [ ] Update [docs/DATABASE.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/DATABASE.md) (If schema or persistent models changed)
- [ ] Update [docs/API.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/API.md) (If endpoints, message formats, or interfaces changed)

> [!WARNING]
> Never leave stale documentation. If code and documentation disagree, update documentation immediately. Failure to update documentation counts as an incomplete task.

---

## 📋 Coding Standards

* **Architecture**: Follow the architecture patterns outlined in [docs/ARCHITECTURE.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/ARCHITECTURE.md).
* **Module Design**: Keep modules small, decoupled, and focused on a single responsibility.
* **DRY Principle**: Avoid duplicating logic. Abstract reusable helpers under clean utility modules.
* **Naming**: Use meaningful, domain-specific names. Prefer clarity over brevity.
* **Self-Documenting Code**: Code structure, variable naming, and type declarations should clearly convey intent. Add inline comments only to explain "why" something is done (complex logic, performance choices, workarounds), not "what" is done.
* **Type Safety**: Strictly adhere to type declarations, compiler flags, and interface structures.

---

## 📁 Folder Conventions

All code and assets must reside in their designated directories:
* `/src`: Source code files.
* `/docs`: Permanent project documentation (Project info, Architecture, APIs, Schema, Decisions, Changelog).
* `/ai`: Continuous coordination and task-state documentation for agent sessions.
* `/tests`: Unit, integration, and end-to-end tests.

---

## 📝 Git & Commit Message Conventions

* **Branching**: Follow standard feature branching. Always work in a designated branch matching the task ID or feature name.
* **Commits**: Make small, frequent, and atomic commits.
* **Commit Message Format**:
  Use standard Conventional Commits:
  ```text
  <type>(<scope>): <short summary>

  [optional body containing reasons/context]

  [optional footer referencing task ID]
  ```
  *Allowed types*: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

---

## 📣 Session Rules

1. **Continuous Documentation Updates**: Do not wait until the shutdown phase to update docs. Update relevant documentation immediately after making a significant architectural or logical change.
2. **Record Decisions**: Any major technical decision must be logged in [docs/DECISIONS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/docs/DECISIONS.md) immediately.
3. **Handling TODOs**: If temporary code modifications or placeholders are required, add `TODO(agent): explanation` and ensure it is tracked in [ai/KNOWN_ISSUES.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/KNOWN_ISSUES.md) or [ai/TASKS.md](file:///C:/Users/shravan/Documents/GitHub/BoolStudio/ai/TASKS.md). Do not leave silent TODOs.
