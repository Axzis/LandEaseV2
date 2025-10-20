'use client';

import { useEditor } from './editor-provider';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EditorComponent } from './rendered-component';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

export function EditorCanvas() {
  const { components, selectComponent, pageSettings } = useEditor();
  const { setNodeRef: setCanvasRef, isOver: isOverCanvas } = useDroppable({
    id: 'canvas-droppable',
  });
  const componentIds = components.map((c) => c.id);

  return (
    <div 
      className="flex-1 bg-muted/30 p-8 h-full overflow-y-auto"
      onClick={() => selectComponent(null)}
    >
      <div
        ref={setCanvasRef}
        style={{ backgroundColor: pageSettings.pageBgColor || '#FFFFFF' }}
        className={cn(
          "w-full max-w-4xl mx-auto min-h-full bg-white dark:bg-muted/20 rounded-md shadow-lg flex flex-col items-center p-4 gap-4 transition-all duration-300",
          isOverCanvas && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
          {components.length > 0 ? (
            components.map((component) => (
              <EditorComponent key={component.id} component={component} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full w-full min-h-[300px] border-2 border-dashed rounded-md">
              <GripVertical className="h-10 w-10 text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-semibold">Kanvas Kosong</h2>
              <p>Seret komponen dari panel kiri untuk mulai membangun halaman Anda.</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
