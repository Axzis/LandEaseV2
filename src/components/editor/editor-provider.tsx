'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, setDoc } from 'firebase/firestore';
import { Component, ComponentType, createNewComponent } from './editor-components';
import { useToast } from '@/hooks/use-toast';

interface PageSettings {
  pageBgColor?: string;
  // Add other page-level settings here
}

interface EditorContextType {
  components: Component[];
  selectedComponent: Component | null;
  pageId: string;
  pageSettings: PageSettings;
  addComponent: (type: ComponentType, targetIndex?: number) => void;
  selectComponent: (id: string | null) => void;
  updateComponent: (id: string, newProperties: any) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (activeId: string, overId: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  savePage: () => Promise<void>;
  isLoading: boolean;
  updatePageSettings: (settings: PageSettings) => void;
  publishPage: (published: boolean) => Promise<void>;
  isPublished: boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children, pageId }: { children: React.ReactNode; pageId: string }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>({ pageBgColor: '#ffffff' });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const firestore = useFirestore();
  const pageDocRef = doc(firestore, 'pages', pageId);
  const { data: pageData, isLoading: isPageLoading } = useDoc(pageDocRef);
  
  const isPublished = pageData?.published || false;

  useEffect(() => {
    if (pageData) {
      if (pageData.content) {
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
      // Load page settings
      setPageSettings({
        pageBgColor: pageData.pageBgColor || '#ffffff',
      });
    }
  }, [pageData]);

  const addComponent = (type: ComponentType, targetIndex = components.length) => {
    const newComponent = createNewComponent(type);
    const newComponents = [...components];
    newComponents.splice(targetIndex, 0, newComponent);
    setComponents(newComponents);
    selectComponent(newComponent.id);
  };

  const selectComponent = (id: string | null) => {
    setSelectedComponentId(id);
  };

  const updateComponent = (id: string, newProperties: any) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, properties: newProperties } : c))
    );
  };

  const deleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };
  
  const updatePageSettings = (settings: PageSettings) => {
    setPageSettings(settings);
  };

  const moveComponent = (activeId: string, overId: string) => {
    setComponents((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeId);
      const overIndex = prev.findIndex((c) => c.id === overId);
      if (activeIndex === -1 || overIndex === -1) return prev;
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // If dropped outside a valid droppable area, do nothing
    if (!over) {
      return;
    }

    const isDraggingPaletteItem = active.data.current?.isPaletteItem === true;
    const isDraggingCanvasComponent = active.data.current?.isCanvasComponent === true;

    // SCENARIO 1: Dragging a NEW component from the PALETTE
    if (isDraggingPaletteItem) {
      const componentType = active.data.current?.type as ComponentType;
      if (!componentType) return;

      // Determine where to drop it
      const isOverCanvas = over.id === 'canvas-droppable';
      const isOverAnotherComponent = over.data.current?.isCanvasComponent === true;

      if (isOverCanvas) {
        // Dropped on the empty canvas area, add to the end
        addComponent(componentType, components.length);
      } else if (isOverAnotherComponent) {
        // Dropped on top of another component, add it after that component
        const overIndex = components.findIndex((c) => c.id === over.id);
        if (overIndex !== -1) {
          addComponent(componentType, overIndex + 1);
        }
      }
      return;
    }

    // SCENARIO 2: REORDERING an EXISTING component on the canvas
    if (isDraggingCanvasComponent && active.id !== over.id) {
        const activeId = String(active.id);
        const overId = String(over.id);
        
        setComponents((prev) => {
            const activeIndex = prev.findIndex((c) => c.id === activeId);
            const overIndex = prev.findIndex((c) => c.id === overId);
            if (activeIndex !== -1 && overIndex !== -1) {
                return arrayMove(prev, activeIndex, overIndex);
            }
            return prev;
        });
    }
  }, [components, addComponent]);


  const savePage = async () => {
    setIsSaving(true);
    try {
      await setDoc(pageDocRef, { 
        content: JSON.stringify(components),
        ...pageSettings
      }, { merge: true });
      toast({
        title: "Halaman Disimpan",
        description: "Perubahan Anda telah berhasil disimpan.",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const publishPage = async (published: boolean) => {
    setIsSaving(true);
    try {
      await setDoc(pageDocRef, { published }, { merge: true });
      toast({
        title: `Halaman ${published ? 'Dipublikasikan' : 'Dibatalkan Publikasinya'}`,
        description: `Halaman Anda sekarang ${published ? `dapat diakses di /p/${pageId}` : 'bersifat pribadi'}.`,
      });
    } catch (error) {
      console.error("Error updating publish status:", error);
       toast({
        variant: "destructive",
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui status publikasi.",
      });
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
        pageSettings,
        addComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        moveComponent,
        handleDragEnd,
        savePage,
        isLoading,
        updatePageSettings,
        publishPage,
        isPublished
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
