'use client';

import { 
  Heading1, 
  Type, 
  Square, 
  Image as ImageIcon, 
  Columns, 
  FormInput 
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from './editor-components';

interface PaletteItemProps {
  type: ComponentType;
  children: React.ReactNode;
}

function PaletteItem({ type, children }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: type,
      isPaletteItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center p-4 cursor-grab bg-card rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {children}
    </div>
  );
}

const components = [
  { name: 'Heading', icon: <Heading1 />, type: ComponentType.Heading },
  { name: 'Teks', icon: <Type />, type: ComponentType.Text },
  { name: 'Tombol', icon: <Square />, type: ComponentType.Button },
  { name: 'Gambar', icon: <ImageIcon />, type: ComponentType.Image },
  { name: 'Kolom', icon: <Columns />, type: ComponentType.Columns },
  { name: 'Formulir', icon: <FormInput />, type: ComponentType.Form },
];

export function ComponentPalette() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Komponen</h2>
      <div className="grid grid-cols-1 @[180px]:grid-cols-2 gap-4 max-w-sm mx-auto">
        {components.map((component) => (
          <PaletteItem key={component.name} type={component.type}>
            <div className="mb-2">{component.icon}</div>
            <p className="text-sm text-center">{component.name}</p>
          </PaletteItem>
        ))}
      </div>
    </div>
  );
}
