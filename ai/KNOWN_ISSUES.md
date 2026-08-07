# Known Issues & Tech Debt

Use this file to record technical debt, known application limitations, and security or performance concerns.

---

## 🐛 Open Bugs
- *None currently logged.*

## 🧹 Technical Debt
- **Sandbox Environment**: Standard development setup is completely manual. Needs automation templates.

## ⚠️ Performance / Scaling Considerations
- **Graph Size**: BFS simulation evaluation might face performance limits when handling large numbers of gates (e.g., >1000 interconnected gates). Optimization (e.g. topological sorting updates, Web Workers) might be needed in the future.
