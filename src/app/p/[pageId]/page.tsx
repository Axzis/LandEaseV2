'use client';

import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Component } from '@/components/editor/editor-components';
import { RenderedComponent } from '@/components/editor/rendered-component';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FilePlus2 } from 'lucide-react';

type PublishedPageProps = {
  params: {
    pageId: string;
  };
};

export default function PublishedPage({ params }: PublishedPageProps) {
  const firestore = useFirestore();
  const pageDocRef = useMemo(() => {
    if (!firestore || !params.pageId) return null;
    return doc(firestore, 'pages', params.pageId);
  }, [firestore, params.pageId]);

  const { data: pageData, isLoading } = useDoc(pageDocRef);

  const components: Component[] = useMemo(() => {
    if (!pageData?.content) return [];
    try {
      const parsedContent = JSON.parse(pageData.content);
      return Array.isArray(parsedContent) ? parsedContent : [];
    } catch (e) {
      console.error("Failed to parse page content:", e);
      return [];
    }
  }, [pageData?.content]);

  if (isLoading) {
    return (
      <div className="flex flex-1 w-full flex-col items-center justify-center bg-background p-8">
        <p>Loading page...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex flex-1 w-full flex-col items-center justify-center bg-background p-8">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle>404 - Halaman Tidak Ditemukan</CardTitle>
                <CardDescription>
                    Halaman yang Anda cari tidak ada atau belum dipublikasikan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FilePlus2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Pastikan URL sudah benar atau coba lagi nanti.
                </p>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!pageData.published) {
    return (
        <div className="flex flex-1 w-full flex-col items-center justify-center bg-background p-8">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle>Halaman Tidak Dipublikasikan</CardTitle>
                    <CardDescription>
                        Halaman ini saat ini tidak tersedia untuk umum.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FilePlus2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Pemilik halaman perlu mempublikasikannya agar dapat dilihat.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center p-0">
        <div className="w-full bg-white dark:bg-black" style={{ backgroundColor: pageData.pageBgColor || '#FFFFFF' }}>
            <div className="container mx-auto p-4 flex flex-col gap-4">
                {components.map(component => (
                    <RenderedComponent key={component.id} component={component} />
                ))}
            </div>
        </div>
    </div>
  );
}
