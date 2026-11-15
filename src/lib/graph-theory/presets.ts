import { Graph, Vertex, Edge } from '../types/graph';

const CX = 350;
const CY = 220;

export function generatePreset(name: string, paramN = 4, paramM = 3): Graph {
  switch (name) {
    case 'empty':
      return { vertices: [], edges: [], isDirected: false };

    case 'single':
      return {
        vertices: [{ id: 'v1', label: 'A', x: CX, y: CY }],
        edges: [],
        isDirected: false,
      };

    case 'path': {
      // 5-vertex path P_5
      const labels = ['A', 'B', 'C', 'D', 'E'];
      const vertices: Vertex[] = labels.map((label, idx) => ({
        id: `v${idx + 1}`,
        label,
        x: 120 + idx * 110,
        y: CY + (idx % 2 === 0 ? -25 : 25),
      }));
      const edges: Edge[] = [];
      for (let i = 0; i < vertices.length - 1; i++) {
        edges.push({
          id: `e_${vertices[i].id}_${vertices[i + 1].id}`,
          source: vertices[i].id,
          target: vertices[i + 1].id,
        });
      }
      return { vertices, edges, isDirected: false };
    }

    case 'cycle': {
      // 5-vertex cycle C_5 (odd cycle)
      const n = 5;
      const radius = 150;
      const labels = ['A', 'B', 'C', 'D', 'E'];
      const vertices: Vertex[] = [];
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        vertices.push({
          id: `v${i + 1}`,
          label: labels[i],
          x: Math.round(CX + radius * Math.cos(angle)),
          y: Math.round(CY + radius * Math.sin(angle)),
        });
      }
      const edges: Edge[] = [];
      for (let i = 0; i < n; i++) {
        edges.push({
          id: `e_${vertices[i].id}_${vertices[(i + 1) % n].id}`,
          source: vertices[i].id,
          target: vertices[(i + 1) % n].id,
        });
      }
      return { vertices, edges, isDirected: false };
    }

    case 'k_n': {
      // Complete graph K_n (n = 1..7)
      const n = Math.max(1, Math.min(7, paramN));
      const radius = 150;
      const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const vertices: Vertex[] = [];

      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        vertices.push({
          id: `v${i + 1}`,
          label: labels[i],
          x: n === 1 ? CX : Math.round(CX + radius * Math.cos(angle)),
          y: n === 1 ? CY : Math.round(CY + radius * Math.sin(angle)),
        });
      }

      const edges: Edge[] = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          edges.push({
            id: `e_${vertices[i].id}_${vertices[j].id}`,
            source: vertices[i].id,
            target: vertices[j].id,
          });
        }
      }
      return { vertices, edges, isDirected: false };
    }

    case 'k_mn': {
      // Complete bipartite graph K_{m,n} (e.g. K_{3,3})
      const m = Math.max(1, Math.min(4, paramN));
      const n = Math.max(1, Math.min(4, paramM));
      const leftLabels = ['A', 'B', 'C', 'D'];
      const rightLabels = ['X', 'Y', 'Z', 'W'];

      const vertices: Vertex[] = [];
      const leftYStep = 320 / (m + 1);
      for (let i = 0; i < m; i++) {
        vertices.push({
          id: `u${i + 1}`,
          label: leftLabels[i],
          x: CX - 160,
          y: Math.round(60 + (i + 1) * leftYStep),
        });
      }

      const rightYStep = 320 / (n + 1);
      for (let j = 0; j < n; j++) {
        vertices.push({
          id: `w${j + 1}`,
          label: rightLabels[j],
          x: CX + 160,
          y: Math.round(60 + (j + 1) * rightYStep),
        });
      }

      const edges: Edge[] = [];
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          edges.push({
            id: `e_${vertices[i].id}_${vertices[m + j].id}`,
            source: vertices[i].id,
            target: vertices[m + j].id,
          });
        }
      }
      return { vertices, edges, isDirected: false };
    }

    case 'tree': {
      // 7-vertex binary tree
      const vertices: Vertex[] = [
        { id: 'v1', label: 'Root', x: CX, y: 70 },
        { id: 'v2', label: 'B', x: CX - 140, y: 170 },
        { id: 'v3', label: 'C', x: CX + 140, y: 170 },
        { id: 'v4', label: 'D', x: CX - 210, y: 280 },
        { id: 'v5', label: 'E', x: CX - 70, y: 280 },
        { id: 'v6', label: 'F', x: CX + 70, y: 280 },
        { id: 'v7', label: 'G', x: CX + 210, y: 280 },
      ];

      const edges: Edge[] = [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v1', target: 'v3' },
        { id: 'e3', source: 'v2', target: 'v4' },
        { id: 'e4', source: 'v2', target: 'v5' },
        { id: 'e5', source: 'v3', target: 'v6' },
        { id: 'e6', source: 'v3', target: 'v7' },
      ];

      return { vertices, edges, isDirected: false };
    }

    case 'petersen': {
      // The 10-vertex Petersen Graph
      const outerRadius = 160;
      const innerRadius = 80;
      const vertices: Vertex[] = [];

      // Outer 5 vertices
      const outerLabels = ['v0', 'v1', 'v2', 'v3', 'v4'];
      for (let i = 0; i < 5; i++) {
        const angle = (2 * Math.PI * i) / 5 - Math.PI / 2;
        vertices.push({
          id: `vo${i}`,
          label: outerLabels[i],
          x: Math.round(CX + outerRadius * Math.cos(angle)),
          y: Math.round(CY + outerRadius * Math.sin(angle)),
        });
      }

      // Inner 5 vertices
      const innerLabels = ['u0', 'u1', 'u2', 'u3', 'u4'];
      for (let i = 0; i < 5; i++) {
        const angle = (2 * Math.PI * i) / 5 - Math.PI / 2;
        vertices.push({
          id: `vi${i}`,
          label: innerLabels[i],
          x: Math.round(CX + innerRadius * Math.cos(angle)),
          y: Math.round(CY + innerRadius * Math.sin(angle)),
        });
      }

      const edges: Edge[] = [];
      // Outer cycle
      for (let i = 0; i < 5; i++) {
        edges.push({ id: `eo_${i}`, source: `vo${i}`, target: `vo${(i + 1) % 5}` });
      }
      // Inner star (connect i to (i+2)%5)
      for (let i = 0; i < 5; i++) {
        edges.push({ id: `ei_${i}`, source: `vi${i}`, target: `vi${(i + 2) % 5}` });
      }
      // Rungs connecting outer to inner
      for (let i = 0; i < 5; i++) {
        edges.push({ id: `er_${i}`, source: `vo${i}`, target: `vi${i}` });
      }

      return { vertices, edges, isDirected: false };
    }

    case 'disconnected': {
      // Component 1: Triangle on the left
      // Component 2: 3-path on the right
      const vertices: Vertex[] = [
        { id: 'v1', label: 'A', x: CX - 180, y: CY - 80 },
        { id: 'v2', label: 'B', x: CX - 260, y: CY + 70 },
        { id: 'v3', label: 'C', x: CX - 100, y: CY + 70 },
        { id: 'v4', label: 'X', x: CX + 110, y: CY - 60 },
        { id: 'v5', label: 'Y', x: CX + 190, y: CY + 20 },
        { id: 'v6', label: 'Z', x: CX + 270, y: CY + 90 },
      ];

      const edges: Edge[] = [
        // Triangle
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v1' },
        // Path
        { id: 'e4', source: 'v4', target: 'v5' },
        { id: 'e5', source: 'v5', target: 'v6' },
      ];

      return { vertices, edges, isDirected: false };
    }

    default:
      return generatePreset('k_n', 4);
  }
}
