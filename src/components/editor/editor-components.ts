'use client';
import { v4 as uuid } from 'uuid';

export enum ComponentType {
    Heading = 'Heading',
    Text = 'Teks',
    Button = 'Tombol',
    Image = 'Gambar',
    Columns = 'Kolom',
    Form = 'Formulir',
}

export interface Component {
    id: string;
    type: ComponentType;
    properties: Record<string, any>;
}

export const getDefaultProperties = (type: ComponentType): Record<string, any> => {
    switch (type) {
      case ComponentType.Heading:
        return { text: 'Judul Utama' };
      case ComponentType.Text:
        return { text: 'Ini adalah paragraf. Klik untuk mengedit.' };
      case ComponentType.Button:
        return { text: 'Klik Saya' };
      case ComponentType.Image:
        return { src: 'https://picsum.photos/seed/editor-image/600/400', alt: 'Gambar Placeholder' };
      case ComponentType.Columns:
        return { count: 2, content: [[], []] }; // Array of arrays for components in each column
      case ComponentType.Form:
        return { fields: ['Email'], submitText: 'Kirim' };
      default:
        return {};
    }
};
  
export const createNewComponent = (type: ComponentType): Component => {
    return {
        id: uuid(),
        type,
        properties: getDefaultProperties(type),
    };
};
