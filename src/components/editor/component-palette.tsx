'use client';

import { 
  Heading1, 
  Type, 
  Square, 
  Image as ImageIcon, 
  Columns, 
  FormInput 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const components = [
  { name: 'Heading', icon: <Heading1 /> },
  { name: 'Teks', icon: <Type /> },
  { name: 'Tombol', icon: <Square /> },
  { name: 'Gambar', icon: <ImageIcon /> },
  { name: 'Kolom', icon: <Columns /> },
  { name: 'Formulir', icon: <FormInput /> },
];

export function ComponentPalette() {
  return (
    <aside className="w-64 h-full bg-muted/40 border-r p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Komponen</h2>
      <div className="grid grid-cols-2 gap-4">
        {components.map((component) => (
          <Card 
            key={component.name}
            className="flex flex-col items-center justify-center p-4 cursor-grab hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div className="mb-2">{component.icon}</div>
            <p className="text-sm text-center">{component.name}</p>
          </Card>
        ))}
      </div>
    </aside>
  );
}
