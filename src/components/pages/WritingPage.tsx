import ContentListPage from '@/components/pages/ContentListPage';
import { PAGE_TITLES } from '@/lib/structured-data';

export default function WritingPage() {
  return (
    <ContentListPage
      contentType="article"
      heading="Writing"
      subheading="Thoughts on AI and analytics. Documenting the journey of continuous learning."
      emptyText="No articles published yet."
      pageTitle={PAGE_TITLES.writing}
    />
  );
}
