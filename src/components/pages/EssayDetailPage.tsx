import ContentDetailPage from '@/components/pages/ContentDetailPage';

export default function EssayDetailPage() {
  return (
    <ContentDetailPage
      basePath="/essays"
      backLabel="Back to Culture Notes"
      notFoundLabel="Essay Not Found"
    />
  );
}
