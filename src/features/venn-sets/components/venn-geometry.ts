import { RegionMask, SetVarCount } from '../types';

export interface VennRegionPath {
  mask: RegionMask;
  pathD: string;
  labelPosition: { x: number; y: number };
  defaultName: string;
}

export interface SetCircleInfo {
  id: 'A' | 'B' | 'C';
  name: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  labelPos: { x: number; y: number };
}

/**
 * Returns exact SVG geometry for 2-Set Venn diagrams (viewBox: 0 0 600 420)
 * Minterm ordering (A=bit 1, B=bit 0):
 * - m0 = 00: Outside
 * - m1 = 01: B only
 * - m2 = 10: A only
 * - m3 = 11: A ∩ B
 */
export function getTwoSetGeometry(): {
  regions: VennRegionPath[];
  circles: SetCircleInfo[];
  universalRect: string;
} {
  const universalRect = 'M 25 25 H 575 V 395 H 25 Z';

  const circles: SetCircleInfo[] = [
    {
      id: 'A',
      name: 'Set A',
      cx: 240,
      cy: 210,
      r: 120,
      color: '#6366f1', // Indigo
      labelPos: { x: 170, y: 70 },
    },
    {
      id: 'B',
      name: 'Set B',
      cx: 360,
      cy: 210,
      r: 120,
      color: '#10b981', // Emerald
      labelPos: { x: 430, y: 70 },
    },
  ];

  // Circle A: cx=240, cy=210, r=120
  // Circle B: cx=360, cy=210, r=120
  // Midpoint x=300. Intersections at (300, 106.08) and (300, 313.92)
  const pTop = '300 106.08';
  const pBottom = '300 313.92';

  const regions: VennRegionPath[] = [
    // m0: Outside both sets
    {
      mask: 0,
      pathD: `M 25 25 H 575 V 395 H 25 Z M 240 90 A 120 120 0 1 0 240 330 A 120 120 0 1 0 240 90 Z M 360 90 A 120 120 0 1 0 360 330 A 120 120 0 1 0 360 90 Z`,
      labelPosition: { x: 75, y: 65 },
      defaultName: 'Outside',
    },
    // m2: A only (AB' in binary 10)
    {
      mask: 2,
      pathD: `M ${pTop} A 120 120 0 1 0 ${pBottom} A 120 120 0 0 0 ${pTop} Z`,
      labelPosition: { x: 205, y: 210 },
      defaultName: 'A only',
    },
    // m1: B only (A'B in binary 01)
    {
      mask: 1,
      pathD: `M ${pTop} A 120 120 0 0 1 ${pBottom} A 120 120 0 1 1 ${pTop} Z`,
      labelPosition: { x: 395, y: 210 },
      defaultName: 'B only',
    },
    // m3: A ∩ B (AB in binary 11)
    {
      mask: 3,
      pathD: `M ${pTop} A 120 120 0 0 1 ${pBottom} A 120 120 0 0 1 ${pTop} Z`,
      labelPosition: { x: 300, y: 210 },
      defaultName: 'A ∩ B',
    },
  ];

  return { regions, circles, universalRect };
}

/**
 * Returns exact SVG geometry for 3-Set Venn diagrams (viewBox: 0 0 600 460)
 * Minterm ordering (A=bit 2, B=bit 1, C=bit 0):
 * - m0 = 000: Outside
 * - m1 = 001: C only
 * - m2 = 010: B only
 * - m3 = 011: B ∩ C only
 * - m4 = 100: A only
 * - m5 = 101: A ∩ C only
 * - m6 = 110: A ∩ B only
 * - m7 = 111: A ∩ B ∩ C
 */
export function getThreeSetGeometry(): {
  regions: VennRegionPath[];
  circles: SetCircleInfo[];
  universalRect: string;
} {
  const universalRect = 'M 25 25 H 575 V 435 H 25 Z';

  // Centers of A, B, C:
  const circles: SetCircleInfo[] = [
    {
      id: 'A',
      name: 'Set A',
      cx: 240,
      cy: 195,
      r: 115,
      color: '#6366f1', // Indigo
      labelPos: { x: 165, y: 75 },
    },
    {
      id: 'B',
      name: 'Set B',
      cx: 360,
      cy: 195,
      r: 115,
      color: '#10b981', // Emerald
      labelPos: { x: 435, y: 75 },
    },
    {
      id: 'C',
      name: 'Set C',
      cx: 300,
      cy: 295,
      r: 115,
      color: '#f59e0b', // Amber
      labelPos: { x: 300, y: 440 },
    },
  ];

  // Key intersection points:
  const pAB_top = '300 96.89';
  const pAB_center = '300 293.11';
  const pAC_outer = '185.01 295.99';
  const pAC_inner = '354.99 194.01';
  const pBC_outer = '414.99 295.99';
  const pBC_inner = '245.01 194.01';

  const regions: VennRegionPath[] = [
    // m0: Outside all 3 sets (000)
    {
      mask: 0,
      pathD: `M 25 25 H 575 V 435 H 25 Z M 240 80 A 115 115 0 1 0 240 310 A 115 115 0 1 0 240 80 Z M 360 80 A 115 115 0 1 0 360 310 A 115 115 0 1 0 360 80 Z M 300 180 A 115 115 0 1 0 300 410 A 115 115 0 1 0 300 180 Z`,
      labelPosition: { x: 70, y: 65 },
      defaultName: 'Outside',
    },
    // m4: A only (AB'C' in binary 100)
    {
      mask: 4,
      pathD: `M ${pAB_top} A 115 115 0 0 0 ${pAC_outer} A 115 115 0 0 1 ${pBC_inner} A 115 115 0 0 1 ${pAB_top} Z`,
      labelPosition: { x: 195, y: 175 },
      defaultName: 'A only',
    },
    // m2: B only (A'BC' in binary 010)
    {
      mask: 2,
      pathD: `M ${pAB_top} A 115 115 0 0 0 ${pAC_inner} A 115 115 0 0 1 ${pBC_outer} A 115 115 0 0 0 ${pAB_top} Z`,
      labelPosition: { x: 405, y: 175 },
      defaultName: 'B only',
    },
    // m1: C only (A'B'C in binary 001)
    {
      mask: 1,
      pathD: `M ${pAC_outer} A 115 115 0 0 0 ${pBC_outer} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 1 ${pAC_outer} Z`,
      labelPosition: { x: 300, y: 360 },
      defaultName: 'C only',
    },
    // m6: A ∩ B only (ABC' in binary 110)
    {
      mask: 6,
      pathD: `M ${pAB_top} A 115 115 0 0 1 ${pAC_inner} A 115 115 0 0 0 ${pBC_inner} A 115 115 0 0 1 ${pAB_top} Z`,
      labelPosition: { x: 300, y: 150 },
      defaultName: 'A ∩ B only',
    },
    // m5: A ∩ C only (AB'C in binary 101)
    {
      mask: 5,
      pathD: `M ${pBC_inner} A 115 115 0 0 0 ${pAC_outer} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 0 ${pBC_inner} Z`,
      labelPosition: { x: 235, y: 260 },
      defaultName: 'A ∩ C only',
    },
    // m3: B ∩ C only (A'BC in binary 011)
    {
      mask: 3,
      pathD: `M ${pAC_inner} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 0 ${pBC_outer} A 115 115 0 0 0 ${pAC_inner} Z`,
      labelPosition: { x: 365, y: 260 },
      defaultName: 'B ∩ C only',
    },
    // m7: A ∩ B ∩ C (ABC in binary 111)
    {
      mask: 7,
      pathD: `M ${pBC_inner} A 115 115 0 0 1 ${pAC_inner} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 1 ${pBC_inner} Z`,
      labelPosition: { x: 300, y: 230 },
      defaultName: 'A ∩ B ∩ C',
    },
  ];

  return { regions, circles, universalRect };
}

export function getVennGeometry(varCount: SetVarCount) {
  return varCount === 2 ? getTwoSetGeometry() : getThreeSetGeometry();
}
