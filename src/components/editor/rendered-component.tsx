'use client';

import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Component } from './editor-components';
import { useEditor } from './editor-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface RenderedComponentProps {
  component: Component;
}

const componentMap: Record<Component['type'], React.FC<any>> = {
  Heading: ({ text, fontSize, color, textAlign }) => {
    const sizeClass = `text-${fontSize}`;
    const style: CSSProperties = {
      color,
      textAlign: textAlign as CSSProperties['textAlign'],
    };
    return <h1 className={cn("font-bold", sizeClass)} style={style}>{text}</h1>;
  },
  Teks: ({ text, fontSize, color, textAlign }) => {
    const sizeClass = `text-${fontSize}`;
    const style: CSSProperties = {
      color,
      textAlign: textAlign as CSSProperties['textAlign'],
    };
    return <p className={sizeClass} style={style}>{text}</p>;
  },
  Tombol: ({ text, href, variant, size }) => <Button asChild variant={variant} size={size}><a href={href}>{text}</a></Button>,
  Gambar: ({ src, alt, width, height }) => (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  ),
  Kolom: ({ count }) => {
    const gridColsClass = `grid-cols-${count}`;
    return (
        <div className={cn("grid gap-4 w-full", gridColsClass)}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="border-2 border-dashed border-muted-foreground/50 p-4 min-h-[100px] flex items-center justify-center">
                    <p className='text-muted-foreground text-sm'>Kolom {i+1}</p>
                </div>
            ))}
        </div>
    );
  },
  Formulir: ({ fields, submitText }) => {
    const fieldArray = fields.split(',').map((f: string) => f.trim()).filter(Boolean);
    return (
      <form className="space-y-4 w-full border p-4 rounded-md bg-card">
        {fieldArray.map((field: string) => (
          <div key={field} className="space-y-2">
            <Label>{field}</Label>
            <Input type="text" placeholder={`Masukkan ${field}...`} />
          </div>
        ))}
        <Button type="submit">{submitText}</Button>
      </form>
    );
  },
};

export const RenderedComponent = ({ component }: RenderedComponentProps) => {
  const ComponentToRender = componentMap[component.type];
  if (!ComponentToRender) return <div className='text-red-500'>Komponen tidak dikenal: {component.type}</div>;
  return <div className="w-full"><ComponentToRender {...component.properties} /></div>;
};


export function EditorComponent({ component }: RenderedComponentProps) {
    const { selectComponent, selectedComponent } = useEditor();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: component.id,
    });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };
  
    const isSelected = selectedComponent?.id === component.id;
  
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(component.id);
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        className={cn(
          "p-4 border-2 border-transparent hover:border-primary/50 w-full cursor-grab relative",
          isSelected && "border-primary ring-2 ring-primary"
        )}
      >
        <RenderedComponent component={component} />
      </div>
    );
}
