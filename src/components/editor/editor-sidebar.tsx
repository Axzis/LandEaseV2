'use client';

import { ComponentPalette } from './component-palette';
import { InspectorPanel } from './inspector-panel';
import { Separator } from '../ui/separator';

export function EditorSidebar() {
  return (
    <aside className="w-[300px] h-full bg-muted/40 flex flex-col overflow-y-auto @container">
      <ComponentPalette />
      <Separator />
      <div className="flex-1 overflow-y-auto">
        <InspectorPanel />
      </div>
    </aside>
  );
}
