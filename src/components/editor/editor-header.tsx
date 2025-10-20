'use client';

import { Button } from '@/components/ui/button';
import { useEditor } from './editor-provider';
import { Save, Eye } from 'lucide-react';
import Link from 'next/link';

export function EditorHeader() {
  const { savePage, isLoading, pageId } = useEditor();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
      <div className="flex-1">
        <h1 className="font-semibold text-lg">Editor</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
            <Link href={`/p/${pageId}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Pratinjau
            </Link>
        </Button>
        <Button onClick={savePage} disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : <><Save className="mr-2 h-4 w-4" /> Simpan</>}
        </Button>
      </div>
    </header>
  );
}
