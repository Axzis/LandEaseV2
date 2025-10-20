'use client';

import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import { Layers3, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user } = useUser();
  const auth = getAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: 'An error occurred while signing out.',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Layers3 className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">LandEase</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6 flex-1">
          {user && (
             <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center justify-end space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hi, {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
