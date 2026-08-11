import ContentListPage from '@/components/pages/ContentListPage';

export default function EssaysPage() {
  return (
    <ContentListPage
      contentType="essay"
      basePath="/essays"
      heading="Culture Notes"
      subheading="Reflective essays on movies and media, viewed through a cultural and ESL lens — not reviews, but a record of what they surfaced."
      emptyText="No essays published yet."
    />
  );
}
