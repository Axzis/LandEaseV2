import { DndContext } from '@dnd-kit/core';
import React from 'react';
import { EditorProvider, useEditor } from '@/components/editor/editor-provider';

// A client component to access the dnd handler from the context
function DndHandler({ children }: { children: React.ReactNode }) {
  const { handleDragEnd } = useEditor();
  return <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>;
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DndHandler>{children}</DndHandler>;
}
