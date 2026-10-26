import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Articles } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { YouTubeEmbed } from '@/components/ui/youtube-embed';
import { ArrowLeft } from 'lucide-react';
import {
  formatStoredDate,
  getDateKey,
  getItemPath,
  getRelatedArticles,
  isArticle,
  parseArticleBody,
} from '@/lib/articles';
import { AUTHOR_BIO, AUTHOR_NAME, PAGE_TITLES } from '@/lib/structured-data';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useInitialData } from '@/lib/initial-data';

// Temporary fallback until every article has been given a videoUrl in the CMS.
const FALLBACK_VIDEO_URLS: Record<string, string> = {
  'how-ai-exposed-my-biggest-english-weakness': 'https://www.youtube.com/shorts/MHbe__LEz8U',
};

interface ContentDetailPageProps {
  basePath: string;
  backLabel: string;
  notFoundLabel: string;
}

export default function ContentDetailPage({ basePath, backLabel, notFoundLabel }: ContentDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  // Server-fetched item on the first load (so hydration matches); otherwise fetched below.
  // detail === null means the server already looked it up and it doesn't exist.
  const initialData = useInitialData();
  const hasInitialDetail = initialData?.detail !== undefined;
  const [article, setArticle] = useState<Articles | null>(initialData?.detail ?? null);
  const [relatedArticles, setRelatedArticles] = useState<Articles[]>(initialData?.related ?? []);
  const [isLoading, setIsLoading] = useState(!hasInitialDetail);

  useDocumentTitle(isLoading ? undefined : article?.articleTitle || PAGE_TITLES.notFound);

  useEffect(() => {
    if (initialData && hasInitialDetail) {
      // Back on the server-rendered URL (e.g. via the back button): reuse its data.
      setArticle(initialData.detail ?? null);
      setRelatedArticles(initialData.related ?? []);
      setIsLoading(false);
      return;
    }
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    if (!slug) return;

    try {
      // Fall back to _id lookup for articles that haven't been migrated to a slug yet
      const data = (await BaseCrudService.getByField<Articles>('articles', 'slug', slug))
        ?? await BaseCrudService.getById<Articles>('articles', slug);
      setArticle(data);

      if (data && isArticle(data)) {
        const all = await BaseCrudService.getAll<Articles>('articles');
        setRelatedArticles(getRelatedArticles(all.items, data, 3));
      } else {
        setRelatedArticles([]);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const blocks = article ? parseArticleBody(article.mainContent) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-6 md:px-8 py-20">
        <div style={{ minHeight: isLoading ? '600px' : 'auto' }}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : !article ? (
            <div className="text-center py-20">
              <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                {notFoundLabel}
              </h1>
              <p className="font-paragraph text-lg text-secondary mb-8">
                The page you're looking for doesn't exist.
              </p>
              <Link to={basePath}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <Link to={basePath}>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent mb-8 -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
                  </Button>
                </Link>

                <div className="mb-8">
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    {article.topicCategory}
                  </span>
                  {article.publishDate && (
                    <time dateTime={getDateKey(article.publishDate)} className="text-sm text-muted-foreground ml-4">
                      {formatStoredDate(article.publishDate, 'long')}
                    </time>
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

                {(() => {
                  const videoUrl = article.videoUrl || (article.slug && FALLBACK_VIDEO_URLS[article.slug]);
                  return videoUrl ? (
                    <YouTubeEmbed url={videoUrl} title={article.articleTitle || 'Article video'} />
                  ) : null;
                })()}

                {/* Body: plain-text mainContent split into headings / paragraphs / FAQ */}
                <div className="border-t border-border pt-12 space-y-6 font-paragraph text-base text-foreground leading-relaxed">
                  {blocks.map((block, index) => {
                    if (block.type === 'heading') {
                      return (
                        <h2 key={index} className="font-heading text-2xl md:text-3xl font-semibold text-foreground pt-6">
                          {block.text}
                        </h2>
                      );
                    }
                    if (block.type === 'paragraph') {
                      return <p key={index}>{block.text}</p>;
                    }
                    return (
                      <section key={index} className="pt-6">
                        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-6">
                          {block.heading}
                        </h2>
                        <div className="space-y-8">
                          {block.items.map((item, itemIndex) => (
                            <div key={itemIndex}>
                              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                                {item.question}
                              </h3>
                              <p>{item.answer}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>

                {/* Author Box */}
                <div className="mt-16 pt-12 border-t border-border flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-secondary/20" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground mb-2">
                      {AUTHOR_NAME}
                    </p>
                    <p className="font-paragraph text-base leading-relaxed text-muted-foreground">
                      {AUTHOR_BIO}
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Related articles: same topicCategory, newest first, max 3 */}
              {relatedArticles.length > 0 && (
                <section className="max-w-4xl mx-auto mt-16 pt-12 border-t border-border" aria-labelledby="related-heading">
                  <h2 id="related-heading" className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    Related articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related._id}
                        to={getItemPath(related)}
                        className="group block p-6 border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">
                            {related.topicCategory}
                          </span>
                          {related.publishDate && (
                            <time dateTime={getDateKey(related.publishDate)} className="text-xs text-muted-foreground shrink-0">
                              {formatStoredDate(related.publishDate)}
                            </time>
                          )}
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {related.articleTitle}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
