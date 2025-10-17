type EditorPageProps = {
  params: {
    pageId: string;
  };
};

export default function EditorPage({ params }: EditorPageProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <h1 className="text-4xl font-bold font-headline text-center">
        Landing Page Editor
      </h1>
      <p className="text-muted-foreground mt-4">
        Editing page: <span className="font-mono p-1 bg-muted rounded">{params.pageId}</span>
      </p>
    </div>
  );
}
