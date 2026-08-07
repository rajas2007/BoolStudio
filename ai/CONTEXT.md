# Long-Term Context & Domain Knowledge

Use this file to store long-term knowledge about business logic, complex mathematical algorithms, conventions, and configuration assumptions.

---

## 💡 Naming Conventions
- **Node IDs**: Unique string format: `node_xxxx` (where xxxx is generated randomly).
- **Port Naming**: Input ports are numbered `in0`, `in1`, etc. Output ports are numbered `out0`, `out1`, etc.

## 📐 Circuit Evaluation Flow
- Signals propagate using a breadth-first search (BFS) queue.
- Loops are detected using graph cycle algorithms to prevent infinite evaluation runs.
- Empty connections evaluate to high impedance (`Z`) or undefined state.
