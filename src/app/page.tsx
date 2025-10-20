'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BarChart, Edit, TabletSmartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-landing');

  return (
    <div className="flex flex-col flex-1">
      <section className="container pt-16 md:pt-24 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-headline">
              Bangun Landing Page Impian Anda dengan Mudah
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              LandEase adalah platform intuitif yang memungkinkan Anda membuat landing page profesional dan responsif tanpa perlu coding.
            </p>
            <div className="flex gap-4 mt-4">
              <Button size="lg" asChild>
                <Link href="/signup">Mulai Gratis</Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          {heroImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl">
              <Image 
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>
      <section id="features" className="container py-16 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-headline">Fitur Unggulan</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  Semua yang Anda butuhkan untuk membuat landing page yang menarik dan efektif.
              </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                  <CardHeader>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                          <Edit className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="font-headline">Drag & Drop Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <CardDescription>
                          Buat dan sesuaikan halaman Anda dengan editor seret dan lepas kami yang mudah digunakan.
                      </CardDescription>
                  </CardContent>
              </Card>
              <Card className="text-center">
                  <CardHeader>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                          <TabletSmartphone className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="font-headline">Desain Responsif</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <CardDescription>
                          Halaman Anda akan terlihat sempurna di semua perangkat, baik desktop, tablet, maupun seluler.
                      </CardDescription>
                  </CardContent>
              </Card>
              <Card className="text-center">
                  <CardHeader>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                          <BarChart className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="font-headline">Analitik Terintegrasi</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <CardDescription>
                          Lacak kinerja halaman Anda dan dapatkan wawasan berharga tentang pengunjung Anda.
                      </CardDescription>
                  </CardContent>
              </Card>
          </div>
      </section>
      <footer className="border-t mt-auto">
        <div className="container py-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} LandEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
