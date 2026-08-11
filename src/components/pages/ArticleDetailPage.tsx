import ContentDetailPage from '@/components/pages/ContentDetailPage';

export default function ArticleDetailPage() {
  return (
    <ContentDetailPage
      basePath="/writing"
      backLabel="Back to Writing"
      notFoundLabel="Article Not Found"
    />
  );
}
