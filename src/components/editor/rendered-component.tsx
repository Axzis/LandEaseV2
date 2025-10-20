'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Component } from './editor-components';
import { useEditor } from './editor-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';

interface RenderedComponentProps {
  component: Component;
}

const componentMap: Record<Component['type'], React.FC<any>> = {
  Heading: ({ text }) => <h1 className="text-4xl font-bold">{text}</h1>,
  Teks: ({ text }) => <p>{text}</p>,
  Tombol: ({ text }) => <Button>{text}</Button>,
  Gambar: ({ src, alt }) => <div className="relative w-full aspect-video"><Image src={src} alt={alt} layout="fill" objectFit="cover" /></div>,
  Kolom: ({ count }) => <div className={`grid grid-cols-${count} gap-4`}>{[...Array(count)].map((_, i) => <div key={i} className="border p-4 min-h-[100px]"></div>)}</div>,
  Formulir: ({ fields, submitText }) => (
    <form className="space-y-4">
      {fields.map((field: string) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700">{field}</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
      ))}
      <Button>{submitText}</Button>
    </form>
  ),
};

export const RenderedComponent = ({ component }: RenderedComponentProps) => {
  const ComponentToRender = componentMap[component.type];
  if (!ComponentToRender) return <div>Komponen tidak dikenal</div>;
  return <ComponentToRender {...component.properties} />;
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
          "p-4 border-2 border-transparent hover:border-primary/50 w-full cursor-grab",
          isSelected && "border-primary ring-2 ring-primary"
        )}
      >
        <RenderedComponent component={component} />
      </div>
    );
}
