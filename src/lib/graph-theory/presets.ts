import { Graph, Vertex, Edge, PresetName } from '../types/graph';

const CX = 350;
const CY = 220;

export function generatePreset(name: PresetName, paramN = 4, paramM = 3): Graph {
  switch (name) {
    case 'empty':
      return { vertices: [], edges: [], isDirected: false };

    case 'path': {
      const n = Math.max(2, Math.min(8, paramN || 5));
      const alphabet = 'ABCDEFGH';
      const vertices: Vertex[] = [];
      const xStart = CX - ((n - 1) * 70) / 2;

      for (let i = 0; i < n; i++) {
        vertices.push({
          id: `v${i + 1}`,
          label: alphabet[i] || `V${i + 1}`,
          x: Math.round(xStart + i * 70),
          y: Math.round(CY + (i % 2 === 0 ? -20 : 20)),
        });
      }

      const edges: Edge[] = [];
      for (let i = 0; i < n - 1; i++) {
        edges.push({
          id: `e_${vertices[i].id}_${vertices[i + 1].id}`,
          source: vertices[i].id,
          target: vertices[i + 1].id,
        });
      }

      return { vertices, edges, isDirected: false };
    }

    case 'cycle': {
      const n = Math.max(3, Math.min(8, paramN || 5));
      const alphabet = 'ABCDEFGH';
      const radius = 140;
      const vertices: Vertex[] = [];

      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        vertices.push({
          id: `v${i + 1}`,
          label: alphabet[i] || `V${i + 1}`,
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
      const n = Math.max(1, Math.min(7, paramN || 4));
      const alphabet = 'ABCDEFG';
      const radius = 140;
      const vertices: Vertex[] = [];

      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        vertices.push({
          id: `v${i + 1}`,
          label: alphabet[i] || `V${i + 1}`,
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
      const m = Math.max(1, Math.min(4, paramN || 3));
      const n = Math.max(1, Math.min(4, paramM || 3));
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

    case 'star': {
      const leaves = 4;
      const radius = 140;
      const alphabet = ['A', 'B', 'C', 'D', 'E']; // Center is A
      const vertices: Vertex[] = [{ id: 'v1', label: alphabet[0], x: CX, y: CY }];

      for (let i = 0; i < leaves; i++) {
        const angle = (2 * Math.PI * i) / leaves - Math.PI / 4;
        vertices.push({
          id: `v${i + 2}`,
          label: alphabet[i + 1],
          x: Math.round(CX + radius * Math.cos(angle)),
          y: Math.round(CY + radius * Math.sin(angle)),
        });
      }

      const edges: Edge[] = [];
      for (let i = 1; i <= leaves; i++) {
        edges.push({
          id: `e_v1_${vertices[i].id}`,
          source: 'v1',
          target: vertices[i].id,
        });
      }

      return { vertices, edges, isDirected: false };
    }

    case 'tree': {
      const vertices: Vertex[] = [
        { id: 'v1', label: 'A', x: CX, y: 70 },
        { id: 'v2', label: 'B', x: CX - 140, y: 170 },
        { id: 'v3', label: 'C', x: CX + 140, y: 170 },
        { id: 'v4', label: 'D', x: CX - 210, y: 290 },
        { id: 'v5', label: 'E', x: CX - 70, y: 290 },
        { id: 'v6', label: 'F', x: CX + 70, y: 290 },
        { id: 'v7', label: 'G', x: CX + 210, y: 290 },
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
      const outerRadius = 150;
      const innerRadius = 75;
      const vertices: Vertex[] = [];

      // Outer 5 vertices: A..E
      const outerLabels = ['A', 'B', 'C', 'D', 'E'];
      for (let i = 0; i < 5; i++) {
        const angle = (2 * Math.PI * i) / 5 - Math.PI / 2;
        vertices.push({
          id: `vo${i}`,
          label: outerLabels[i],
          x: Math.round(CX + outerRadius * Math.cos(angle)),
          y: Math.round(CY + outerRadius * Math.sin(angle)),
        });
      }

      // Inner 5 vertices: F..J
      const innerLabels = ['F', 'G', 'H', 'I', 'J'];
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
      // Inner star
      for (let i = 0; i < 5; i++) {
        edges.push({ id: `ei_${i}`, source: `vi${i}`, target: `vi${(i + 2) % 5}` });
      }
      // Rungs
      for (let i = 0; i < 5; i++) {
        edges.push({ id: `er_${i}`, source: `vo${i}`, target: `vi${i}` });
      }

      return { vertices, edges, isDirected: false };
    }

    case 'planar': {
      // Wheel Graph W_4 (Planar) - 4-cycle with central hub
      const radius = 130;
      const vertices: Vertex[] = [
        { id: 'v0', label: 'Hub', x: CX, y: CY },
        { id: 'v1', label: 'A', x: CX - radius, y: CY - radius * 0.7 },
        { id: 'v2', label: 'B', x: CX + radius, y: CY - radius * 0.7 },
        { id: 'v3', label: 'C', x: CX + radius, y: CY + radius * 0.7 },
        { id: 'v4', label: 'D', x: CX - radius, y: CY + radius * 0.7 },
      ];

      const edges: Edge[] = [
        // Outer cycle
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v4' },
        { id: 'e4', source: 'v4', target: 'v1' },
        // Spokes
        { id: 'e5', source: 'v0', target: 'v1' },
        { id: 'e6', source: 'v0', target: 'v2' },
        { id: 'e7', source: 'v0', target: 'v3' },
        { id: 'e8', source: 'v0', target: 'v4' },
      ];

      return { vertices, edges, isDirected: false };
    }

    case 'non_planar': {
      // Complete bipartite K_{3,3} (canonical non-planar graph)
      return generatePreset('k_mn', 3, 3);
    }

    case 'disconnected': {
      const vertices: Vertex[] = [
        // Component 1: Triangle
        { id: 'v1', label: 'A', x: CX - 180, y: CY - 80 },
        { id: 'v2', label: 'B', x: CX - 260, y: CY + 60 },
        { id: 'v3', label: 'C', x: CX - 100, y: CY + 60 },
        // Component 2: 3-path
        { id: 'v4', label: 'X', x: CX + 100, y: CY - 60 },
        { id: 'v5', label: 'Y', x: CX + 180, y: CY + 10 },
        { id: 'v6', label: 'Z', x: CX + 260, y: CY + 80 },
        // Component 3: Isolated vertex
        { id: 'v7', label: 'W', x: CX, y: CY + 130 },
      ];

      const edges: Edge[] = [
        { id: 'e1', source: 'v1', target: 'v2' },
        { id: 'e2', source: 'v2', target: 'v3' },
        { id: 'e3', source: 'v3', target: 'v1' },
        { id: 'e4', source: 'v4', target: 'v5' },
        { id: 'e5', source: 'v5', target: 'v6' },
      ];

      return { vertices, edges, isDirected: false };
    }

    default:
      return generatePreset('k_n', 4);
  }
}
