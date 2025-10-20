'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEditor } from './editor-provider';
import { Textarea } from '../ui/textarea';

function PageSettingsInspector() {
  return (
     <Card>
       <CardHeader>
         <CardTitle>Pengaturan Halaman</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-color">Warna Latar</Label>
            <Input id="bg-color" type="color" defaultValue="#ffffff" />
          </div>
       </CardContent>
     </Card>
  );
}

function ComponentPropertyEditor() {
    const { selectedComponent, updateComponent } = useEditor();
  
    if (!selectedComponent) {
      return null;
    }
  
    const handlePropertyChange = (propName: string, value: any) => {
        updateComponent(selectedComponent.id, {
            ...selectedComponent.properties,
            [propName]: value,
        });
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properti {selectedComponent.type}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(selectedComponent.properties).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`prop-${key}`} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              {typeof value === 'string' && (
                 <Textarea
                    id={`prop-${key}`}
                    value={value}
                    onChange={(e) => handlePropertyChange(key, e.target.value)}
                    placeholder={`Masukkan ${key}`}
                 />
              )}
            </div>
          ))}
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
