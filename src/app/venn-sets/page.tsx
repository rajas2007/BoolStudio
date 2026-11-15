import React from 'react';
import { VennSetsLab } from '@/features/venn-sets';

export const metadata = {
  title: 'Venn & Sets Lab | BoolStudio',
  description:
    'Interactive Venn diagrams and set theory visualizer. Explore set operations, verify algebraic identities, and solve Principle of Inclusion-Exclusion problems.',
};

export default function VennSetsPage() {
  return <VennSetsLab />;
}
