import { RegionMask, SetVarCount } from '../types';

export interface SetCircleInfo {
  id: 'A' | 'B' | 'C';
  name: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  strokeColor: string;
  labelPos: { x: number; y: number };
}

export interface VennRegionMetadata {
  mask: RegionMask;
  bits: number[]; // [A, B, C] or [A, B] of 0/1
  labelPosition: { x: number; y: number };
  defaultName: string;
}

export interface VennDiagramSpec {
  width: number;
  height: number;
  viewBox: string;
  circles: SetCircleInfo[];
  regions: VennRegionMetadata[];
  setNames: Array<'A' | 'B' | 'C'>;
}

/**
 * Returns exact SVG geometry specification for 2-Set Venn diagrams (viewBox: 0 0 440 320)
 * Bitvector ordering: [A, B] (A is MSB, B is LSB)
 * - m0 = 00: Outside
 * - m1 = 01: B only
 * - m2 = 10: A only
 * - m3 = 11: A ∩ B
 */
export function getTwoSetGeometry(): VennDiagramSpec {
  const width = 440;
  const height = 320;
  const viewBox = `0 0 ${width} ${height}`;

  const circles: SetCircleInfo[] = [
    {
      id: 'A',
      name: 'Set A',
      cx: 170,
      cy: 160,
      r: 100,
      color: '#6366f1',
      strokeColor: '#818cf8',
      labelPos: { x: 95, y: 70 },
    },
    {
      id: 'B',
      name: 'Set B',
      cx: 270,
      cy: 160,
      r: 100,
      color: '#10b981',
      strokeColor: '#34d399',
      labelPos: { x: 345, y: 70 },
    },
  ];

  const regions: VennRegionMetadata[] = [
    {
      mask: 0,
      bits: [0, 0],
      labelPosition: { x: 45, y: 50 },
      defaultName: 'Outside',
    },
    {
      mask: 1,
      bits: [0, 1],
      labelPosition: { x: 325, y: 160 },
      defaultName: 'B only',
    },
    {
      mask: 2,
      bits: [1, 0],
      labelPosition: { x: 115, y: 160 },
      defaultName: 'A only',
    },
    {
      mask: 3,
      bits: [1, 1],
      labelPosition: { x: 220, y: 160 },
      defaultName: 'A ∩ B',
    },
  ];

  return {
    width,
    height,
    viewBox,
    circles,
    regions,
    setNames: ['A', 'B'],
  };
}

/**
 * Returns exact SVG geometry specification for 3-Set Venn diagrams (viewBox: 0 0 440 400)
 * Bitvector ordering: [A, B, C] (A is bit 2, B is bit 1, C is bit 0)
 * - m0 = 000: Outside
 * - m1 = 001: C only
 * - m2 = 010: B only
 * - m3 = 011: B ∩ C only
 * - m4 = 100: A only
 * - m5 = 101: A ∩ C only
 * - m6 = 110: A ∩ B only
 * - m7 = 111: A ∩ B ∩ C
 */
export function getThreeSetGeometry(): VennDiagramSpec {
  const width = 440;
  const height = 400;
  const viewBox = `0 0 ${width} ${height}`;

  const circles: SetCircleInfo[] = [
    {
      id: 'A',
      name: 'Set A',
      cx: 170,
      cy: 150,
      r: 100,
      color: '#6366f1',
      strokeColor: '#818cf8',
      labelPos: { x: 95, y: 65 },
    },
    {
      id: 'B',
      name: 'Set B',
      cx: 270,
      cy: 150,
      r: 100,
      color: '#10b981',
      strokeColor: '#34d399',
      labelPos: { x: 345, y: 65 },
    },
    {
      id: 'C',
      name: 'Set C',
      cx: 220,
      cy: 235,
      r: 100,
      color: '#f59e0b',
      strokeColor: '#fbbf24',
      labelPos: { x: 220, y: 365 },
    },
  ];

  const regions: VennRegionMetadata[] = [
    {
      mask: 0,
      bits: [0, 0, 0],
      labelPosition: { x: 45, y: 55 },
      defaultName: 'Outside',
    },
    {
      mask: 1,
      bits: [0, 0, 1],
      labelPosition: { x: 220, y: 290 },
      defaultName: 'C only',
    },
    {
      mask: 2,
      bits: [0, 1, 0],
      labelPosition: { x: 325, y: 145 },
      defaultName: 'B only',
    },
    {
      mask: 3,
      bits: [0, 1, 1],
      labelPosition: { x: 275, y: 210 },
      defaultName: 'B ∩ C only',
    },
    {
      mask: 4,
      bits: [1, 0, 0],
      labelPosition: { x: 115, y: 145 },
      defaultName: 'A only',
    },
    {
      mask: 5,
      bits: [1, 0, 1],
      labelPosition: { x: 165, y: 210 },
      defaultName: 'A ∩ C only',
    },
    {
      mask: 6,
      bits: [1, 1, 0],
      labelPosition: { x: 220, y: 115 },
      defaultName: 'A ∩ B only',
    },
    {
      mask: 7,
      bits: [1, 1, 1],
      labelPosition: { x: 220, y: 175 },
      defaultName: 'A ∩ B ∩ C',
    },
  ];

  return {
    width,
    height,
    viewBox,
    circles,
    regions,
    setNames: ['A', 'B', 'C'],
  };
}

export function getVennGeometry(varCount: SetVarCount): VennDiagramSpec {
  return varCount === 2 ? getTwoSetGeometry() : getThreeSetGeometry();
}
