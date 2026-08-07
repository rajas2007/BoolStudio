# Database & Data Persistence

This document details persistent data structures, including local browser storage schemas, database structures, and serialization schemas.

---

## 💾 Local Browser Storage
For client-side sandbox usage, states are serialized and saved inside `localStorage`.

### Key: `boolstudio_saved_circuits`
* **Type**: JSON Array of serialized circuits.
* **Schema**:
```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "createdAt": "ISO-8601 string",
    "updatedAt": "ISO-8601 string",
    "nodes": [
      {
        "id": "string",
        "type": "AND | OR | NOT | INPUT | OUTPUT",
        "position": { "x": "number", "y": "number" },
        "state": "boolean"
      }
    ],
    "connections": [
      {
        "from": "nodeId",
        "to": "nodeId",
        "port": "number"
      }
    ]
  }
]
```

---

## 🗄️ Relational Database (Future Expansion)
*To be defined if a cloud backend is introduced.*
