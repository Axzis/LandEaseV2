'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function InspectorPanel() {
  return (
    <aside className="w-80 h-full bg-muted/40 border-l p-4 overflow-y-auto">
       <h2 className="text-lg font-semibold mb-4">Properti</h2>
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
    </aside>
  );
}
