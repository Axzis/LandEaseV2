'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ComponentPalette } from '@/components/editor/component-palette';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { InspectorPanel } from '@/components/editor/inspector-panel';
import { EditorProvider, useEditor } from '@/components/editor/editor-provider';
import { DndContext } from '@dnd-kit/core';
import { EditorHeader } from '@/components/editor/editor-header';

type EditorPageProps = {
  params: {
    pageId: string;
  };
};

function Editor() {
  const { handleDragEnd } = useEditor();

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-1 w-full flex-col overflow-hidden">
        <EditorHeader />
        <div className="flex flex-1 w-full overflow-hidden">
          <ComponentPalette />
          <main className="flex-1 overflow-y-auto">
            <EditorCanvas />
          </main>
          <InspectorPanel />
        </div>
      </div>
    </DndContext>
  );
}

export default function EditorPage({ params }: EditorPageProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <EditorProvider pageId={params.pageId}>
      <Editor />
    </EditorProvider>
  );
}
