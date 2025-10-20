'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { FilePlus2, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, DocumentData, deleteDoc, doc } from 'firebase/firestore';
import { CreatePageDialog } from '@/components/dashboard/create-page-dialog';

interface Page extends DocumentData {
  id: string;
  name: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

function PageCard({ page, onDelete }: { page: Page; onDelete: (pageId: string) => void }) {
  const formattedDate = page.createdAt 
    ? new Date(page.createdAt.seconds * 1000).toLocaleDateString()
    : 'Baru saja';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{page.name}</CardTitle>
        <CardDescription>Dibuat pada {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/editor/${page.id}`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={() => onDelete(page.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pagesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'pages'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: pages, isLoading: pagesLoading } = useCollection<Page>(pagesQuery);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleDeletePage = async (pageId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await deleteDoc(doc(firestore, 'pages', pageId));
      } catch (error) {
        console.error("Error deleting page: ", error);
        // Optionally show a toast message here
      }
    }
  };

  if (loading || pagesLoading) {
    return (
      <div className="flex flex-1 w-full flex-col items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  return (
    <>
      <CreatePageDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-1 w-full flex-col items-center bg-background">
        <main className="flex-1 flex w-full max-w-5xl flex-col items-start justify-start gap-8 p-4 md:p-8">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Page
            </Button>
          </div>
          
          {pages && pages.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <PageCard key={page.id} page={page} onDelete={handleDeletePage} />
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Welcome to LandEase</CardTitle>
                <CardDescription>
                  Manage your landing pages, view analytics, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <FilePlus2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don&apos;t have any pages yet. Create one to get started!
                </p>
                <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Page
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}
