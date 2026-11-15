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
      labelPos: { x: 180, y: 80 },
    },
    {
      id: 'B',
      name: 'Set B',
      cx: 360,
      cy: 210,
      r: 120,
      color: '#10b981', // Emerald
      labelPos: { x: 420, y: 80 },
    },
  ];

  // Circle A: cx=240, cy=210, r=120
  // Circle B: cx=360, cy=210, r=120
  // Distance = 120. Midpoint = 300.
  // Intersections at x = 300:
  // y = 210 ± sqrt(120^2 - 60^2) = 210 ± sqrt(14400 - 3600) = 210 ± 103.92
  // Top: (300, 106.08), Bottom: (300, 313.92)
  const pTop = '300 106.08';
  const pBottom = '300 313.92';

  const regions: VennRegionPath[] = [
    // Mask 0: Outside both sets (Universal Rect minus both circles)
    {
      mask: 0,
      // Full rectangle with circle A and circle B cut out using SVG path subpaths with reverse winding
      pathD: `M 25 25 H 575 V 395 H 25 Z M 240 90 A 120 120 0 1 0 240 330 A 120 120 0 1 0 240 90 Z M 360 90 A 120 120 0 1 0 360 330 A 120 120 0 1 0 360 90 Z`,
      labelPosition: { x: 75, y: 65 },
      defaultName: 'Outside',
    },
    // Mask 1: A only (A \ B)
    {
      mask: 1,
      pathD: `M ${pTop} A 120 120 0 1 0 ${pBottom} A 120 120 0 0 0 ${pTop} Z`,
      labelPosition: { x: 210, y: 210 },
      defaultName: 'A only',
    },
    // Mask 2: B only (B \ A)
    {
      mask: 2,
      pathD: `M ${pTop} A 120 120 0 0 1 ${pBottom} A 120 120 0 1 1 ${pTop} Z`,
      labelPosition: { x: 390, y: 210 },
      defaultName: 'B only',
    },
    // Mask 3: A ∩ B
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
 * Returns exact SVG geometry for 3-Set Venn diagrams (viewBox: 0 0 600 450)
 */
export function getThreeSetGeometry(): {
  regions: VennRegionPath[];
  circles: SetCircleInfo[];
  universalRect: string;
} {
  const universalRect = 'M 25 25 H 575 V 425 H 25 Z';

  // Centers of A, B, C:
  const circles: SetCircleInfo[] = [
    {
      id: 'A',
      name: 'Set A',
      cx: 240,
      cy: 195,
      r: 115,
      color: '#6366f1', // Indigo
      labelPos: { x: 175, y: 75 },
    },
    {
      id: 'B',
      name: 'Set B',
      cx: 360,
      cy: 195,
      r: 115,
      color: '#10b981', // Emerald
      labelPos: { x: 425, y: 75 },
    },
    {
      id: 'C',
      name: 'Set C',
      cx: 300,
      cy: 295,
      r: 115,
      color: '#f59e0b', // Amber
      labelPos: { x: 300, y: 435 },
    },
  ];

  // Intersections of circles (r = 115):
  // 1. A & B: Centers (240, 195) and (360, 195). Midpoint x=300.
  //    y = 195 ± sqrt(115^2 - 60^2) = 195 ± 98.11 -> Top: (300, 96.89), Inner-center: (300, 293.11)
  const pAB_top = '300 96.89';
  const pAB_center = '300 293.11';

  // 2. A & C: Centers (240, 195) and (300, 295).
  //    Vector = (60, 100), dist = 116.62. Midpoint = (270, 245).
  //    Offset = sqrt(115^2 - (116.62/2)^2) = 99.11.
  //    Normal = (-100/116.62, 60/116.62) = (-0.8575, 0.5145).
  //    pAC_outer = (270 - 84.99, 245 + 50.99) = (185.01, 295.99)
  //    pAC_inner = (270 + 84.99, 245 - 50.99) = (354.99, 194.01)
  const pAC_outer = '185.01 295.99';
  const pAC_inner = '354.99 194.01';

  // 3. B & C: symmetric around x=300
  //    pBC_outer = (414.99, 295.99)
  //    pBC_inner = (245.01, 194.01)
  const pBC_outer = '414.99 295.99';
  const pBC_inner = '245.01 194.01';

  const regions: VennRegionPath[] = [
    // Mask 0: Outside all 3 sets
    {
      mask: 0,
      pathD: `M 25 25 H 575 V 425 H 25 Z M 240 80 A 115 115 0 1 0 240 310 A 115 115 0 1 0 240 80 Z M 360 80 A 115 115 0 1 0 360 310 A 115 115 0 1 0 360 80 Z M 300 180 A 115 115 0 1 0 300 410 A 115 115 0 1 0 300 180 Z`,
      labelPosition: { x: 70, y: 65 },
      defaultName: 'Outside',
    },
    // Mask 1: A only (A \ (B ∪ C))
    {
      mask: 1,
      pathD: `M ${pAB_top} A 115 115 0 0 0 ${pAC_outer} A 115 115 0 0 1 ${pBC_inner} A 115 115 0 0 1 ${pAB_top} Z`,
      labelPosition: { x: 200, y: 175 },
      defaultName: 'A only',
    },
    // Mask 2: B only (B \ (A ∪ C))
    {
      mask: 2,
      pathD: `M ${pAB_top} A 115 115 0 0 0 ${pAC_inner} A 115 115 0 0 1 ${pBC_outer} A 115 115 0 0 0 ${pAB_top} Z`,
      labelPosition: { x: 400, y: 175 },
      defaultName: 'B only',
    },
    // Mask 4: C only (C \ (A ∪ B))
    {
      mask: 4,
      pathD: `M ${pAC_outer} A 115 115 0 0 0 ${pBC_outer} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 1 ${pAC_outer} Z`,
      labelPosition: { x: 300, y: 355 },
      defaultName: 'C only',
    },
    // Mask 3: A ∩ B only (no C)
    {
      mask: 3,
      pathD: `M ${pAB_top} A 115 115 0 0 1 ${pAC_inner} A 115 115 0 0 0 ${pBC_inner} A 115 115 0 0 1 ${pAB_top} Z`,
      labelPosition: { x: 300, y: 155 },
      defaultName: 'A ∩ B only',
    },
    // Mask 5: A ∩ C only (no B)
    {
      mask: 5,
      pathD: `M ${pBC_inner} A 115 115 0 0 0 ${pAC_outer} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 0 ${pBC_inner} Z`,
      labelPosition: { x: 235, y: 265 },
      defaultName: 'A ∩ C only',
    },
    // Mask 6: B ∩ C only (no A)
    {
      mask: 6,
      pathD: `M ${pAC_inner} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 0 ${pBC_outer} A 115 115 0 0 0 ${pAC_inner} Z`,
      labelPosition: { x: 365, y: 265 },
      defaultName: 'B ∩ C only',
    },
    // Mask 7: A ∩ B ∩ C (Central overlap of all three)
    {
      mask: 7,
      pathD: `M ${pBC_inner} A 115 115 0 0 1 ${pAC_inner} A 115 115 0 0 1 ${pAB_center} A 115 115 0 0 1 ${pBC_inner} Z`,
      labelPosition: { x: 300, y: 235 },
      defaultName: 'A ∩ B ∩ C',
    },
  ];

  return { regions, circles, universalRect };
}

/**
 * Helper to fetch geometry corresponding to variable count
 */
export function getVennGeometry(varCount: SetVarCount) {
  return varCount === 2 ? getTwoSetGeometry() : getThreeSetGeometry();
}
