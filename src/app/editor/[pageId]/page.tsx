'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type EditorPageProps = {
  params: {
    pageId: string;
  };
};

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
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <h1 className="text-4xl font-bold font-headline text-center">
        Landing Page Editor
      </h1>
      <p className="text-muted-foreground mt-4">
        Editing page:{' '}
        <span className="font-mono p-1 bg-muted rounded">
          {params.pageId}
        </span>
      </p>
    </div>
  );
}