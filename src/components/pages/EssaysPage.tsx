import ContentListPage from '@/components/pages/ContentListPage';
import { PAGE_TITLES } from '@/lib/structured-data';

export default function EssaysPage() {
  return (
    <ContentListPage
      contentType="essay"
      heading="Culture Notes"
      subheading="Reflective essays on movies and media, viewed through a cultural and ESL lens — not reviews, but a record of what they surfaced."
      emptyText="No essays published yet."
      pageTitle={PAGE_TITLES.essays}
    />
  );
}
