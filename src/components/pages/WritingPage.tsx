import ContentListPage from '@/components/pages/ContentListPage';

export default function WritingPage() {
  return (
    <ContentListPage
      contentType="article"
      basePath="/writing"
      heading="Writing"
      subheading="Thoughts on AI and analytics. Documenting the journey of continuous learning."
      emptyText="No articles published yet."
    />
  );
}
