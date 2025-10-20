'use client';

import { useEditor } from './editor-provider';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EditorComponent, RenderedComponent } from './rendered-component';
import { cn } from '@/lib/utils';

export function EditorCanvas() {
  const { components, selectComponent } = useEditor();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const componentIds = components.map((c) => c.id);

  return (
    <div 
      className="flex-1 bg-background p-8 h-full overflow-y-auto"
      onClick={() => selectComponent(null)}
    >
      <div
        ref={setNodeRef}
        className={cn(
          "w-full h-full bg-white dark:bg-muted/20 rounded-md shadow-inner flex flex-col items-center p-4 gap-4",
          isOver && "outline-dashed outline-2 outline-primary"
        )}
      >
        <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
          {components.length > 0 ? (
            components.map((component) => (
              <EditorComponent key={component.id} component={component} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
              <h2 className="text-2xl font-semibold">Kanvas</h2>
              <p>Seret komponen dari panel kiri untuk mulai membangun halaman Anda.</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
