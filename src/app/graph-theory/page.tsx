import React from 'react';
import { GraphLabView } from '@/components/GraphLab/GraphLabView';

export const metadata = {
  title: 'Graph Theory Lab | BoolStudio Educational Platform',
  description: 'Interactive Graph Theory laboratory: adjacency & incidence matrices, walks, cycles, Euler tours, bipartite 2-colouring, trees, and chromatic numbers.',
};

export default function GraphTheoryPage() {
  return <GraphLabView />;
}
