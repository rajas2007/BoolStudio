import React from 'react';
import { WorkspaceView } from '@/components/Workspace/WorkspaceView';

export const metadata = {
  title: 'Workspace | BoolStudio Logic Visualizer',
  description: 'Interactive Boolean Logic Workspace. Generate truth tables, logic gate circuits, K-Maps, and Boolean simplification.',
};

export default function WorkspacePage() {
  return <WorkspaceView />;
}
