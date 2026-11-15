import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generatePreset } from './presets';
import { computeRepresentations } from './matrix-builders';
import { computeDegreesAndConnectivity } from './connectivity';
import { analyzeWalk, validateStep } from './walks-cycles';
import { findEulerianPathOrCircuit } from './euler';
import { findHamiltonianPathsAndCycles } from './hamiltonian';
import { analyzeTreeProperties } from './tree';
import { checkBipartite } from './bipartite';
import { computeBipartiteMatching } from './matching';
import { evaluatePlanarBound } from './planar-bound';
import { analyzeColoring } from './coloring';
import { canAddEdge } from './graph-model';

describe('Graph Theory Lab - Unit 6 Pure Algorithm Test Suite', () => {
  // 1. K_4 (Complete Graph on 4 vertices)
  it('1. Verifies K_4 properties, planarity, and chromatic number', () => {
    const k4 = generatePreset('k_n', 4);
    assert.strictEqual(k4.vertices.length, 4);
    assert.strictEqual(k4.edges.length, 6);

    // Representations
    const reps = computeRepresentations(k4);
    assert.strictEqual(reps.result.adjacencyMatrix.isSymmetric, true);
    assert.deepStrictEqual(reps.result.adjacencyMatrix.rowSums, [3, 3, 3, 3]);
    assert.strictEqual(reps.result.handshake.isValid, true);
    assert.strictEqual(reps.result.handshake.sumOfDegrees, 12);

    // Planarity: E = 6 <= 3(4) - 6 = 6 (satisfies bound)
    const planar = evaluatePlanarBound(k4);
    assert.strictEqual(planar.result.status, 'INCONCLUSIVE');
    assert.strictEqual(planar.result.generalBound, 6);

    // Euler: all vertices have degree 3 (4 odd vertices -> neither circuit nor trail)
    const euler = findEulerianPathOrCircuit(k4);
    assert.strictEqual(euler.result.hasCircuit, false);
    assert.strictEqual(euler.result.hasTrail, false);

    // Hamiltonian: complete graph is Hamiltonian
    const ham = findHamiltonianPathsAndCycles(k4);
    assert.strictEqual(ham.result.hasCycle, true);
    assert.strictEqual(ham.result.diracCondition.holds, true); // min degree 3 >= 4/2 = 2
    assert.strictEqual(ham.result.oreCondition.holds, true);

    // Colouring: chi(K_4) = 4
    const col = analyzeColoring(k4);
    assert.strictEqual(col.result.chromaticNumber, 4);
  });

  // 2. K_5 (Canonical Non-Planar Graph)
  it('2. Verifies K_5 non-planarity proof via edge bound and Euler circuit', () => {
    const k5 = generatePreset('k_n', 5);
    assert.strictEqual(k5.vertices.length, 5);
    assert.strictEqual(k5.edges.length, 10);

    // Planar bound: 10 > 3(5) - 6 = 9 -> DEFINITELY NON-PLANAR!
    const planar = evaluatePlanarBound(k5);
    assert.strictEqual(planar.result.status, 'DEFINITELY_NON_PLANAR');
    assert.strictEqual(planar.result.violatesGeneral, true);
    assert.ok(planar.explanation.includes('Definitely NOT Planar'));

    // Euler: all vertices have degree 4 (even) -> Euler circuit exists
    const euler = findEulerianPathOrCircuit(k5);
    assert.strictEqual(euler.result.hasCircuit, true);
    assert.strictEqual(euler.result.circuitOrTrailEdges.length, 10);

    // Chromatic number: chi(K_5) = 5
    const col = analyzeColoring(k5);
    assert.strictEqual(col.result.chromaticNumber, 5);
  });

  // 3. K_3,3 (Complete Bipartite & Non-Planar)
  it('3. Verifies K_3,3 bipartiteness, non-planarity, and maximum matching', () => {
    const k33 = generatePreset('k_mn', 3, 3);
    assert.strictEqual(k33.vertices.length, 6);
    assert.strictEqual(k33.edges.length, 9);

    // Bipartite: true, 2-colourable
    const bip = checkBipartite(k33);
    assert.strictEqual(bip.result.isBipartite, true);
    assert.strictEqual(bip.result.partitionA.length, 3);
    assert.strictEqual(bip.result.partitionB.length, 3);

    // Planar bound for bipartite: E = 9 > 2(6) - 4 = 8 -> DEFINITELY NON-PLANAR!
    const planar = evaluatePlanarBound(k33);
    assert.strictEqual(planar.result.status, 'DEFINITELY_NON_PLANAR');
    assert.strictEqual(planar.result.violatesBipartite, true);

    // Matching: perfect matching of size 3
    const match = computeBipartiteMatching(k33);
    assert.strictEqual(match.result.isBipartite, true);
    assert.strictEqual(match.result.matchingSize, 3);
    assert.strictEqual(match.result.isPerfect, true);
    assert.strictEqual(match.result.hallCondition.holds, true);

    // Colouring: chi(K_3,3) = 2
    const col = analyzeColoring(k33);
    assert.strictEqual(col.result.chromaticNumber, 2);
  });

  // 4. C_5 (Odd Cycle)
  it('4. Verifies C_5 odd cycle non-bipartite proof and Euler/Hamiltonian cycles', () => {
    const c5 = generatePreset('cycle', 5);
    assert.strictEqual(c5.vertices.length, 5);
    assert.strictEqual(c5.edges.length, 5);

    // Bipartite: false, must report odd cycle witness
    const bip = checkBipartite(c5);
    assert.strictEqual(bip.result.isBipartite, false);
    assert.ok(bip.result.oddCycle && bip.result.oddCycle.length === 6); // 5 edges + return to start

    // Euler: degrees all 2 -> Euler circuit exists
    const euler = findEulerianPathOrCircuit(c5);
    assert.strictEqual(euler.result.hasCircuit, true);

    // Hamiltonian: cycle exists
    const ham = findHamiltonianPathsAndCycles(c5);
    assert.strictEqual(ham.result.hasCycle, true);

    // Chromatic number: odd cycle requires 3 colors
    const col = analyzeColoring(c5);
    assert.strictEqual(col.result.chromaticNumber, 3);
  });

  // 5. C_6 (Even Cycle)
  it('5. Verifies C_6 even cycle bipartiteness and 2-colourability', () => {
    const c6 = generatePreset('cycle', 6);
    assert.strictEqual(c6.vertices.length, 6);
    assert.strictEqual(c6.edges.length, 6);

    const bip = checkBipartite(c6);
    assert.strictEqual(bip.result.isBipartite, true);
    assert.strictEqual(bip.result.partitionA.length, 3);
    assert.strictEqual(bip.result.partitionB.length, 3);

    const col = analyzeColoring(c6);
    assert.strictEqual(col.result.chromaticNumber, 2);
  });

  // 6. Petersen Graph (10 vertices, 15 edges)
  it('6. Verifies Petersen graph properties, lack of Hamiltonian cycle, and chromatic number 3', () => {
    const pet = generatePreset('petersen');
    assert.strictEqual(pet.vertices.length, 10);
    assert.strictEqual(pet.edges.length, 15);

    // 3-regular: all degrees 3
    const conn = computeDegreesAndConnectivity(pet);
    assert.strictEqual(conn.result.components.count, 1);
    assert.strictEqual(conn.result.oddDegreeVertices.length, 10);

    // Non-bipartite (contains 5-cycles)
    const bip = checkBipartite(pet);
    assert.strictEqual(bip.result.isBipartite, false);

    // Euler: 10 odd vertices -> no tour
    const euler = findEulerianPathOrCircuit(pet);
    assert.strictEqual(euler.result.hasCircuit, false);

    // Hamiltonian: has Hamiltonian path, but NO Hamiltonian cycle!
    const ham = findHamiltonianPathsAndCycles(pet);
    assert.strictEqual(ham.result.hasCycle, false);
    assert.strictEqual(ham.result.hasPath, true);

    // Chromatic number of Petersen is exactly 3
    const col = analyzeColoring(pet);
    assert.strictEqual(col.result.chromaticNumber, 3);
  });

  // 7. Path Graph P_5
  it('7. Verifies Path P_5 tree properties and Euler trail', () => {
    const p5 = generatePreset('path', 5);
    assert.strictEqual(p5.vertices.length, 5);
    assert.strictEqual(p5.edges.length, 4);

    // Tree: connected, acyclic, E = V - 1
    const tree = analyzeTreeProperties(p5);
    assert.strictEqual(tree.result.isTree, true);
    assert.strictEqual(tree.result.leaves.length, 2);

    // Euler: 2 odd degree vertices (the 2 ends) -> Euler trail exists
    const euler = findEulerianPathOrCircuit(p5);
    assert.strictEqual(euler.result.hasCircuit, false);
    assert.strictEqual(euler.result.hasTrail, true);
    assert.strictEqual(euler.result.circuitOrTrailEdges.length, 4);
  });

  // 8. Star Graph K_1,4 (Hall's Condition Violation Example)
  it('8. Verifies Star graph tree properties and Hall condition violation', () => {
    const star = generatePreset('star');
    assert.strictEqual(star.vertices.length, 5);
    assert.strictEqual(star.edges.length, 4);

    const tree = analyzeTreeProperties(star);
    assert.strictEqual(tree.result.isTree, true);
    assert.strictEqual(tree.result.leaves.length, 4); // 4 leaves surrounding center

    // Bipartite matching: size 1. Saturates center, but leaves subset violates Hall!
    const match = computeBipartiteMatching(star);
    assert.strictEqual(match.result.isBipartite, true);
    assert.strictEqual(match.result.matchingSize, 1);
    assert.strictEqual(match.result.isPerfect, false);
    assert.strictEqual(match.result.hallCondition.holds, false);
    assert.ok(match.result.hallCondition.violatingSubsetS !== undefined);
  });

  // 9. Disconnected Graph
  it('9. Verifies disconnected graph component counting and non-tree / non-Euler rejection', () => {
    const disc = generatePreset('disconnected');
    assert.strictEqual(disc.vertices.length, 7);

    const conn = computeDegreesAndConnectivity(disc);
    assert.strictEqual(conn.result.components.count, 3);

    // Tree fails connectivity
    const tree = analyzeTreeProperties(disc);
    assert.strictEqual(tree.result.isTree, false);
    assert.strictEqual(tree.result.isConnected, false);

    // Euler fails disconnected
    const euler = findEulerianPathOrCircuit(disc);
    assert.strictEqual(euler.result.hasCircuit, false);
    assert.strictEqual(euler.result.isDisconnected, true);
  });

  // 10. Self-loops and Multi-edges rule enforcement
  it('10. Blocks self-loops and parallel multi-edges in simple graph mode', () => {
    const graph = generatePreset('empty');
    graph.vertices = [
      { id: 'v1', label: 'A', x: 100, y: 100 },
      { id: 'v2', label: 'B', x: 200, y: 200 },
    ];

    // Self-loop: v1 to v1
    const loopCheck = canAddEdge(graph, 'v1', 'v1');
    assert.strictEqual(loopCheck.valid, false);
    assert.ok(loopCheck.reason?.includes('Self-loops are not permitted'));

    // Valid first edge
    const edgeCheck1 = canAddEdge(graph, 'v1', 'v2');
    assert.strictEqual(edgeCheck1.valid, true);

    // Add first edge
    graph.edges.push({ id: 'e1', source: 'v1', target: 'v2' });

    // Multi-edge: v1 to v2 again
    const multiCheck = canAddEdge(graph, 'v1', 'v2');
    assert.strictEqual(multiCheck.valid, false);
    assert.ok(multiCheck.reason?.includes('Parallel edges already exist'));

    // Multi-edge in reverse for undirected graph: v2 to v1
    const multiCheckRev = canAddEdge(graph, 'v2', 'v1');
    assert.strictEqual(multiCheckRev.valid, false);
  });

  // 11. Walk Analysis: Walk, Trail, Path, Circuit, Cycle classification
  it('11. Accurately classifies Walk, Trail, Path, Circuit, Cycle', () => {
    const c4 = generatePreset('cycle', 4); // v1-v2-v3-v4-v1

    // Simple Path: v1 -> v2 -> v3
    const pathAnalysis = analyzeWalk(c4, ['v1', 'v2', 'v3']);
    assert.strictEqual(pathAnalysis.result.classification, 'Path');
    assert.strictEqual(pathAnalysis.result.isPath, true);

    // Cycle: v1 -> v2 -> v3 -> v4 -> v1
    const cycleAnalysis = analyzeWalk(c4, ['v1', 'v2', 'v3', 'v4', 'v1']);
    assert.strictEqual(cycleAnalysis.result.classification, 'Cycle');
    assert.strictEqual(cycleAnalysis.result.isCycle, true);

    // Step validation check: non-adjacent step
    const invalidStep = validateStep(c4, 'v1', 'v3');
    assert.strictEqual(invalidStep.isValid, false);
  });
});
