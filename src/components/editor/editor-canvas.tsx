'use client';

export function EditorCanvas() {
  return (
    <div className="flex-1 bg-background p-8 h-full">
      <div className="w-full h-full bg-white dark:bg-muted/20 rounded-md shadow-inner flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h2 className="text-2xl font-semibold">Kanvas</h2>
          <p>Seret komponen dari panel kiri untuk mulai membangun halaman Anda.</p>
        </div>
      </div>
    </div>
  );
}
