import { Link } from 'react-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PAGE_TITLES } from '@/lib/structured-data';
import { useDocumentTitle } from '@/hooks/use-document-title';

// The server already answers unknown URLs with HTTP 404; this is what visitors see.
export default function NotFoundPage() {
  useDocumentTitle(PAGE_TITLES.notFound);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full max-w-[100rem] mx-auto px-6 md:px-8 py-20 text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="font-paragraph text-lg text-secondary mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/writing">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Writing
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
