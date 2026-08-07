import { TruthTableData, KMapData, KMapCell, KMapGroup } from '../types/boolean';

// Gray code sequences
const GRAY_CODES_1 = ['0', '1'];
const GRAY_CODES_2 = ['00', '01', '11', '10'];

const GROUP_COLORS = [
  'rgba(16, 185, 129, 0.4)', // Emerald
  'rgba(99, 102, 241, 0.4)', // Indigo
  'rgba(245, 158, 11, 0.4)', // Amber
  'rgba(236, 72, 153, 0.4)', // Pink
  'rgba(14, 165, 233, 0.4)', // Sky
  'rgba(168, 85, 247, 0.4)', // Purple
];

export function generateKMap(truthTable: TruthTableData): KMapData {
  const vars = truthTable.variables;
  const numVars = vars.length;

  if (numVars > 4) {
    return {
      numVariables: numVars,
      rowVars: [],
      colVars: [],
      rowHeaders: [],
      colHeaders: [],
      grid: [],
      groups: [],
      simplifiedExpression: '',
      exceedsLimit: true,
      message:
        'Karnaugh Maps support a maximum of 4 variables. This expression contains more than four variables, so K-Map generation is unavailable.',
    };
  }

  let rowVars: string[] = [];
  let colVars: string[] = [];
  let rowHeaders: string[] = [];
  let colHeaders: string[] = [];

  if (numVars === 0) {
    return {
      numVariables: 0,
      rowVars: [],
      colVars: [],
      rowHeaders: ['0'],
      colHeaders: ['0'],
      grid: [
        [
          {
            rowCode: '0',
            colCode: '0',
            rowLabel: '0',
            colLabel: '0',
            minterm: 0,
            value: truthTable.rows[0]?.output ?? false,
            groupIndices: [],
          },
        ],
      ],
      groups: [],
      simplifiedExpression: truthTable.rows[0]?.output ? '1' : '0',
      exceedsLimit: false,
    };
  } else if (numVars === 1) {
    rowVars = [vars[0]];
    colVars = [];
    rowHeaders = GRAY_CODES_1;
    colHeaders = [''];
  } else if (numVars === 2) {
    rowVars = [vars[0]];
    colVars = [vars[1]];
    rowHeaders = GRAY_CODES_1;
    colHeaders = GRAY_CODES_1;
  } else if (numVars === 3) {
    rowVars = [vars[0]];
    colVars = [vars[1], vars[2]];
    rowHeaders = GRAY_CODES_1;
    colHeaders = GRAY_CODES_2;
  } else if (numVars === 4) {
    rowVars = [vars[0], vars[1]];
    colVars = [vars[2], vars[3]];
    rowHeaders = GRAY_CODES_2;
    colHeaders = GRAY_CODES_2;
  }

  // Create lookup from variable assignments to output value
  const valueMap = new Map<string, { minterm: number; output: boolean }>();
  truthTable.rows.forEach((row) => {
    const key = vars.map((v) => (row.inputs[v] ? '1' : '0')).join('');
    valueMap.set(key, { minterm: row.id, output: row.output });
  });

  const grid: KMapCell[][] = [];
  const mintermLocations = new Map<number, { r: number; c: number }>();

  for (let r = 0; r < rowHeaders.length; r++) {
    const rowRow: KMapCell[] = [];
    const rowCode = rowHeaders[r];

    for (let c = 0; c < colHeaders.length; c++) {
      const colCode = colHeaders[c];
      const fullCode = rowCode + colCode;
      const data = valueMap.get(fullCode) || { minterm: 0, output: false };

      mintermLocations.set(data.minterm, { r, c });

      rowRow.push({
        rowCode,
        colCode,
        rowLabel: rowCode,
        colLabel: colCode,
        minterm: data.minterm,
        value: data.output,
        groupIndices: [],
      });
    }
    grid.push(rowRow);
  }

  // Calculate groups & minimal expression
  const { groups, simplifiedExpression } = solveKMapGroups(grid, numVars, vars, rowVars, colVars);

  // Assign group indices to grid cells for visual highlighting
  groups.forEach((group, groupIdx) => {
    group.minterms.forEach((m) => {
      const loc = mintermLocations.get(m);
      if (loc) {
        grid[loc.r][loc.c].groupIndices.push(groupIdx);
      }
    });
  });

  return {
    numVariables: numVars,
    rowVars,
    colVars,
    rowHeaders,
    colHeaders,
    grid,
    groups,
    simplifiedExpression,
    exceedsLimit: false,
  };
}

function solveKMapGroups(
  grid: KMapCell[][],
  numVars: number,
  allVars: string[],
  rowVars: string[],
  colVars: string[]
): { groups: KMapGroup[]; simplifiedExpression: string } {
  const minterms: number[] = [];
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value) {
        minterms.push(cell.minterm);
      }
    });
  });

  if (minterms.length === 0) {
    return { groups: [], simplifiedExpression: '0' };
  }

  const totalCells = Math.pow(2, numVars);
  if (minterms.length === totalCells) {
    return {
      groups: [
        {
          id: 1,
          term: '1',
          minterms,
          color: GROUP_COLORS[0],
        },
      ],
      simplifiedExpression: '1',
    };
  }

  // Find prime implicants via Quine-McCluskey / K-Map rectangle grouping
  const primeImplicants = findPrimeImplicants(minterms, numVars, allVars);
  
  const groups: KMapGroup[] = primeImplicants.map((pi, idx) => ({
    id: idx + 1,
    term: pi.term,
    minterms: pi.minterms,
    color: GROUP_COLORS[idx % GROUP_COLORS.length],
  }));

  const simplifiedExpression = groups.map((g) => g.term).join(' | ') || '0';

  return { groups, simplifiedExpression };
}

interface PrimeImplicant {
  mask: string; // e.g., "1-0-"
  term: string; // e.g., "A & !C"
  minterms: number[];
}

function findPrimeImplicants(minterms: number[], numVars: number, vars: string[]): PrimeImplicant[] {
  // Convert minterms to binary strings
  let groups: Map<string, number[]> = new Map();
  
  minterms.forEach((m) => {
    const bin = m.toString(2).padStart(numVars, '0');
    groups.set(bin, [m]);
  });

  const primeImplicants: { mask: string; minterms: number[] }[] = [];

  while (groups.size > 0) {
    const nextGroups: Map<string, number[]> = new Map();
    const used = new Set<string>();

    const keys = Array.from(groups.keys());
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const k1 = keys[i];
        const k2 = keys[j];

        const diffIndex = getSingleBitDifference(k1, k2);
        if (diffIndex !== -1) {
          used.add(k1);
          used.add(k2);

          const mergedMask = k1.substring(0, diffIndex) + '-' + k1.substring(diffIndex + 1);
          const combinedMinterms = Array.from(new Set([...(groups.get(k1) || []), ...(groups.get(k2) || [])])).sort((a, b) => a - b);
          
          nextGroups.set(mergedMask, combinedMinterms);
        }
      }
    }

    // Unused masks are prime implicants
    keys.forEach((k) => {
      if (!used.has(k)) {
        primeImplicants.push({ mask: k, minterms: groups.get(k) || [] });
      }
    });

    groups = nextGroups;
  }

  // Deduplicate prime implicants
  const uniquePIs: PrimeImplicant[] = [];
  const seenMasks = new Set<string>();

  primeImplicants.forEach((pi) => {
    if (!seenMasks.has(pi.mask)) {
      seenMasks.add(pi.mask);
      uniquePIs.push({
        mask: pi.mask,
        term: maskToTerm(pi.mask, vars),
        minterms: pi.minterms,
      });
    }
  });

  return uniquePIs;
}

function getSingleBitDifference(s1: string, s2: string): number {
  let diffIdx = -1;
  let count = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      count++;
      diffIdx = i;
    }
  }
  return count === 1 ? diffIdx : -1;
}

function maskToTerm(mask: string, vars: string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    const varName = vars[i];
    if (char === '1') {
      parts.push(varName);
    } else if (char === '0') {
      parts.push(`!${varName}`);
    }
  }
  if (parts.length === 0) return '1';
  return parts.join(' & ');
}
