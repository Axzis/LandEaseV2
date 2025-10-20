'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { EditorProvider, useEditor } from '@/components/editor/editor-provider';
import { DndContext } from '@dnd-kit/core';
import { EditorHeader } from '@/components/editor/editor-header';
import { EditorSidebar } from '@/components/editor/editor-sidebar';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

type EditorPageProps = {
  // params is no longer a prop, it will be accessed via useParams hook
};

function Editor() {
  const { handleDragEnd } = useEditor();

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-1 w-full flex-col overflow-hidden">
        <EditorHeader />
        <div className="flex flex-1 w-full overflow-hidden">
           <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={15} className="min-w-[280px]">
              <EditorSidebar />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors data-[resize-handle-state=drag]:bg-primary" />
            <Panel>
              <main className="flex-1 overflow-y-auto">
                <EditorCanvas />
              </main>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </DndContext>
  );
}

export default function EditorPage({}: EditorPageProps) {
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
      <Editor />
    </EditorProvider>
  );
}
