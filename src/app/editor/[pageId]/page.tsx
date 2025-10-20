'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { EditorProvider, useEditor } from '@/components/editor/editor-provider';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { EditorHeader } from '@/components/editor/editor-header';
import { EditorSidebar } from '@/components/editor/editor-sidebar';

function EditorLayout() {
  const { handleDragEnd } = useEditor();

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <EditorHeader />
        <div className="flex flex-1 w-full overflow-hidden">
          <EditorSidebar />
          <main className="flex-1 overflow-y-auto">
            <EditorCanvas />
          </main>
        </div>
      </div>
    </DndContext>
  );
}

export default function EditorPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const pageId = params.pageId as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading || !user || !pageId) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <EditorProvider pageId={pageId}>
      <EditorLayout />
    </EditorProvider>
  );
}
