import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 w-full flex-col items-center bg-background">
      <main className="flex-1 flex w-full max-w-5xl flex-col items-start justify-start gap-8 p-4 md:p-8">
        <div className="flex w-full justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <Button asChild>
                <Link href="/editor/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Page
                </Link>
            </Button>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome to LandEase</CardTitle>
            <CardDescription>Manage your landing pages, view analytics, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You don't have any pages yet. Create one to get started!</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
