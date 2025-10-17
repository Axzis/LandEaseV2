'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();

  const handleSignUp = async (values: { email: any; password: any; }) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Account Created",
        description: "Your account has been successfully created.",
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
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Create an account to start building your landing pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" onSubmit={handleSignUp} />
        </CardContent>
        <div className="mt-4 p-6 pt-0 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline text-primary">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
