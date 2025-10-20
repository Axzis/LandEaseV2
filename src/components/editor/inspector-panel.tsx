'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEditor } from './editor-provider';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ComponentType } from './editor-components';
import { Button } from '../ui/button';
import ImageKit from 'imagekit-javascript';
import { IKUpload } from 'imagekit-javascript/dist/src/interfaces';
import { useRef } from 'react';
import { Separator } from '../ui/separator';

// Generic Property Editor
function ComponentPropertyEditor() {
    const { selectedComponent, updateComponent, deleteComponent } = useEditor();
  
    if (!selectedComponent) {
      return null;
    }

    const handlePropertyChange = (propName: string, value: any) => {
      if (!selectedComponent) return;
        updateComponent(selectedComponent.id, {
            ...selectedComponent.properties,
            [propName]: value,
        });
    };
    
    const renderInspector = () => {
      switch (selectedComponent.type) {
        case ComponentType.Heading:
        case ComponentType.Text:
          return <TextInspector props={selectedComponent.properties} onChange={handlePropertyChange} />;
        case ComponentType.Button:
          return <ButtonInspector props={selectedComponent.properties} onChange={handlePropertyChange} />;
        case ComponentType.Image:
          return <ImageInspector props={selectedComponent.properties} onChange={handlePropertyChange} />;
        case ComponentType.Columns:
          return <ColumnsInspector props={selectedComponent.properties} onChange={handlePropertyChange} />;
        case ComponentType.Form:
          return <FormInspector props={selectedComponent.properties} onChange={handlePropertyChange} />;
        default:
          return <p>Inspektor tidak tersedia untuk komponen ini.</p>;
      }
    }
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Properti {selectedComponent.type}</CardTitle>
           <Button variant="destructive" size="sm" onClick={() => deleteComponent(selectedComponent.id)}>
            Hapus
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderInspector()}
        </CardContent>
      </Card>
    );
}


// Specific Inspectors
type InspectorProps = {
  props: Record<string, any>;
  onChange: (propName: string, value: any) => void;
};

function TextInspector({ props, onChange }: InspectorProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="prop-text">Teks</Label>
        <Textarea id="prop-text" value={props.text} onChange={(e) => onChange('text', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-fontSize">Ukuran Font</Label>
        <Select value={props.fontSize} onValueChange={(value) => onChange('fontSize', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Kecil</SelectItem>
            <SelectItem value="base">Normal</SelectItem>
            <SelectItem value="lg">Besar</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
            <SelectItem value="2xl">2XL</SelectItem>
            <SelectItem value="3xl">3XL</SelectItem>
            <SelectItem value="4xl">4XL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-color">Warna Teks</Label>
        <Input id="prop-color" type="color" value={props.color} onChange={(e) => onChange('color', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-textAlign">Perataan Teks</Label>
        <Select value={props.textAlign} onValueChange={(value) => onChange('textAlign', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Kiri</SelectItem>
            <SelectItem value="center">Tengah</SelectItem>
            <SelectItem value="right">Kanan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function ButtonInspector({ props, onChange }: InspectorProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="prop-text">Teks Tombol</Label>
        <Input id="prop-text" value={props.text} onChange={(e) => onChange('text', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-href">URL Tautan</Label>
        <Input id="prop-href" value={props.href} onChange={(e) => onChange('href', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-variant">Varian</Label>
        <Select value={props.variant} onValueChange={(value) => onChange('variant', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>
       <div className="space-y-2">
        <Label htmlFor="prop-size">Ukuran</Label>
        <Select value={props.size} onValueChange={(value) => onChange('size', value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="sm">Kecil</SelectItem>
            <SelectItem value="lg">Besar</SelectItem>
            <SelectItem value="icon">Ikon</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function ImageInspector({ props, onChange }: InspectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageKit = new ImageKit({
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    authenticationEndpoint: '/api/imagekit/auth',
  });

  const handleUpload = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      imageKit.upload({
        file,
        fileName: file.name,
      }, (err: Error | null, result: IKUpload | null) => {
        if (err) {
          console.error("ImageKit upload error", err);
          alert("Gagal mengunggah gambar.");
        } else if (result) {
          onChange('src', result.url);
          onChange('width', result.width);
          onChange('height', result.height);
        }
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Sumber Gambar</Label>
        <div className="flex gap-2">
            <Input value={props.src} onChange={(e) => onChange('src', e.target.value)} placeholder="URL Gambar" />
            <Button onClick={triggerFileInput} variant="outline">Unggah</Button>
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-alt">Teks Alternatif</Label>
        <Input id="prop-alt" value={props.alt} onChange={(e) => onChange('alt', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="prop-width">Lebar (px)</Label>
            <Input id="prop-width" type="number" value={props.width} onChange={(e) => onChange('width', parseInt(e.target.value, 10))} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="prop-height">Tinggi (px)</Label>
            <Input id="prop-height" type="number" value={props.height} onChange={(e) => onChange('height', parseInt(e.target.value, 10))} />
        </div>
      </div>
    </>
  );
}

function ColumnsInspector({ props, onChange }: InspectorProps) {
    return (
      <div className="space-y-2">
        <Label htmlFor="prop-count">Jumlah Kolom</Label>
        <Select value={String(props.count)} onValueChange={(value) => onChange('count', parseInt(value, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  function FormInspector({ props, onChange }: InspectorProps) {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="prop-fields">Label Field (pisahkan dengan koma)</Label>
          <Textarea id="prop-fields" value={props.fields} onChange={(e) => onChange('fields', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prop-submitText">Teks Tombol Kirim</Label>
          <Input id="prop-submitText" value={props.submitText} onChange={(e) => onChange('submitText', e.target.value)} />
        </div>
      </>
    );
  }

function PageSettingsInspector() {
  const { pageSettings, updatePageSettings } = useEditor();
  
  const handlePageBgChange = (color: string) => {
    updatePageSettings({ ...pageSettings, pageBgColor: color });
  };

  return (
     <Card>
       <CardHeader>
         <CardTitle>Pengaturan Halaman</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-color">Warna Latar Halaman</Label>
            <Input id="bg-color" type="color" value={pageSettings?.pageBgColor || '#ffffff'} onChange={e => handlePageBgChange(e.target.value)} />
          </div>
       </CardContent>
     </Card>
  );
}


export function InspectorPanel() {
  const { selectedComponent } = useEditor();

  return (
    <div className="p-4">
       <h2 className="text-lg font-semibold mb-4">Properti</h2>
       <div className='space-y-4'>
        {selectedComponent ? <ComponentPropertyEditor /> : <PageSettingsInspector />}
       </div>
    </div>
  );
}
