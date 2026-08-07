# API Reference

This document catalogs interfaces, event listeners, and API endpoints (if any) used within BoolStudio.

---

## 🔌 Frontend Events & Communication Interfaces

### 1. Engine Simulation Actions
Interfaces exposed by the simulation engine to hook into the render loop.

#### `evaluateCircuit(circuitState)`
Evaluates all current gates and propagates signals.
* **Arguments**:
  * `circuitState` (Object): Map of node IDs to their current state details.
* **Returns**:
  * `Promise<EvaluationResult>`: Object indicating updated state outputs and validation status.

---

## 🌐 External API Endpoints (Future / Cloud Integration)
*To be populated once cloud persistence or authentication functions are introduced.*
