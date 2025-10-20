'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEditor } from './editor-provider';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ComponentType } from './editor-components';

// Generic Property Editor
function ComponentPropertyEditor() {
    const { selectedComponent, updateComponent } = useEditor();
  
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
        <CardHeader>
          <CardTitle>Properti {selectedComponent.type}</CardTitle>
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
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="prop-src">URL Gambar</Label>
        <Input id="prop-src" value={props.src} onChange={(e) => onChange('src', e.target.value)} />
        <p className="text-xs text-muted-foreground">Gunakan URL dari Picsum atau Unsplash.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prop-alt">Teks Alternatif</Label>
        <Input id="prop-alt" value={props.alt} onChange={(e) => onChange('alt', e.target.value)} />
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
    <aside className="w-80 h-full bg-muted/40 border-l p-4 overflow-y-auto">
       <h2 className="text-lg font-semibold mb-4">Properti</h2>
       {selectedComponent ? <ComponentPropertyEditor /> : <PageSettingsInspector />}
    </aside>
  );
}
