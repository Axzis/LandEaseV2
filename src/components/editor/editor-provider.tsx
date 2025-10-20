'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, setDoc } from 'firebase/firestore';
import { Component, ComponentType, createNewComponent, getDefaultProperties } from './editor-components';
import { v4 as uuid } from 'uuid';

interface EditorContextType {
  components: Component[];
  selectedComponent: Component | null;
  pageId: string;
  addComponent: (type: ComponentType, targetIndex?: number) => void;
  selectComponent: (id: string | null) => void;
  updateComponent: (id: string, newProperties: any) => void;
  moveComponent: (activeId: string, overId: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  savePage: () => Promise<void>;
  isLoading: boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children, pageId }: { children: React.ReactNode; pageId: string }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const firestore = useFirestore();
  const pageDocRef = doc(firestore, 'pages', pageId);
  const { data: pageData, isLoading: isPageLoading } = useDoc(pageDocRef);

  useEffect(() => {
    if (pageData && pageData.content) {
      try {
        const parsedContent = JSON.parse(pageData.content);
        if (Array.isArray(parsedContent)) {
          setComponents(parsedContent);
        }
      } catch (e) {
        console.error("Failed to parse page content:", e);
        setComponents([]);
      }
    }
  }, [pageData]);

  const addComponent = (type: ComponentType, targetIndex = components.length) => {
    const newComponent = createNewComponent(type);
    const newComponents = [...components];
    newComponents.splice(targetIndex, 0, newComponent);
    setComponents(newComponents);
    setSelectedComponentId(newComponent.id);
  };

  const selectComponent = (id: string | null) => {
    setSelectedComponentId(id);
  };

  const updateComponent = (id: string, newProperties: any) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, properties: newProperties } : c))
    );
  };

  const moveComponent = (activeId: string, overId: string) => {
    setComponents((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeId);
      const overIndex = prev.findIndex((c) => c.id === overId);
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Drag from palette to canvas
    if (active.data.current?.isPaletteItem) {
      const type = active.data.current.type as ComponentType;
      // Find the index to insert at
      const overIndex = components.findIndex(c => c.id === over.id);
      const targetIndex = overIndex !== -1 ? overIndex : components.length;
      addComponent(type, targetIndex);
      return;
    }

    // Reorder components in canvas
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    if (activeId !== overId) {
      moveComponent(activeId, overId);
    }
  }, [components]);

  const savePage = async () => {
    setIsSaving(true);
    try {
      await setDoc(pageDocRef, { content: JSON.stringify(components) }, { merge: true });
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const selectedComponent = components.find((c) => c.id === selectedComponentId) || null;

  const isLoading = isPageLoading || isSaving;

  return (
    <EditorContext.Provider
      value={{
        components,
        selectedComponent,
        pageId,
        addComponent,
        selectComponent,
        updateComponent,
        moveComponent,
        handleDragEnd,
        savePage,
        isLoading,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
};
