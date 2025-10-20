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
        return { 
          text: 'Judul Utama',
          fontSize: '4xl',
          color: '#000000',
          textAlign: 'left'
        };
      case ComponentType.Text:
        return { 
          text: 'Ini adalah paragraf. Klik untuk mengedit.',
          fontSize: 'base',
          color: '#333333',
          textAlign: 'left'
        };
      case ComponentType.Button:
        return { 
          text: 'Klik Saya',
          href: '#',
          variant: 'default',
          size: 'default',
          rounded: 'md'
        };
      case ComponentType.Image:
        return { 
          src: 'https://picsum.photos/seed/editor-image/600/400', 
          alt: 'Gambar Placeholder',
          width: 600,
          height: 400
        };
      case ComponentType.Columns:
        // Note: Column content management will be complex. This is a simplified start.
        return { count: 2 };
      case ComponentType.Form:
         // Note: Form field management will be complex. This is a simplified start.
        return { fields: 'Email, Nama', submitText: 'Kirim' };
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
