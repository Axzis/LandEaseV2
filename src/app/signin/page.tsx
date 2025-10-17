'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();

  const handleSignIn = async (values: { email: any; password: any; }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Signed In",
        description: "You have successfully signed in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signin" onSubmit={handleSignIn} />
        </CardContent>
        <div className="mt-4 p-6 pt-0 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline text-primary">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
