type PublishedPageProps = {
  params: {
    pageId: string;
  };
};

export default function PublishedPage({ params }: PublishedPageProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <h1 className="text-4xl font-bold font-headline text-center">
        Published Landing Page
      </h1>
      <p className="text-muted-foreground mt-4">
        Viewing page: <span className="font-mono p-1 bg-muted rounded">{params.pageId}</span>
      </p>
    </div>
  );
}
