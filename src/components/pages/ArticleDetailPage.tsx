import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Articles } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Articles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    if (!slug) return;

    try {
      // Fall back to _id lookup for articles that haven't been migrated to a slug yet
      const data = (await BaseCrudService.getByField<Articles>('articles', 'slug', slug))
        ?? await BaseCrudService.getById<Articles>('articles', slug);
      setArticle(data);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 py-20">
        <div style={{ minHeight: isLoading ? '600px' : 'auto' }}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : !article ? (
            <div className="text-center py-20">
              <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                Article Not Found
              </h1>
              <p className="font-paragraph text-lg text-secondary mb-8">
                The article you're looking for doesn't exist.
              </p>
              <Link to="/writing">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Writing
                </Button>
              </Link>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Link to="/writing">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent mb-8 -ml-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Writing
                </Button>
              </Link>

              <div className="mb-8">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {article.topicCategory}
                </span>
                {article.publishDate && (
                  <span className="text-sm text-muted-foreground ml-4">
                    {format(new Date(article.publishDate), 'MMMM d, yyyy')}
                  </span>
                )}
              </div>

              <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-8">
                {article.articleTitle}
              </h1>

              {article.shortDescription && (
                <p className="font-paragraph text-xl text-secondary mb-12 leading-relaxed">
                  {article.shortDescription}
                </p>
              )}

              <div className="border-t border-border pt-12">
                <div className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {article.mainContent}
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-16 pt-12 border-t border-border flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-secondary/20" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground mb-2">
                    Jinwon Jang
                  </h2>
                  <p className="font-paragraph text-base leading-relaxed text-muted-foreground">
                    Student, self-learner, and builder documenting experiments in AI, analytics, language learning, and deliberate practice.
                  </p>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
