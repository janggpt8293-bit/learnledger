import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Articles } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatStoredDate, getDateKey, getItemPath, sortNewestFirst, splitCategories } from '@/lib/articles';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useInitialData } from '@/lib/initial-data';

interface ContentListPageProps {
  contentType: string;
  heading: string;
  subheading: string;
  emptyText: string;
  pageTitle: string;
}

/** Items of one contentType, newest first, plus their filter categories. */
function prepareList(items: Articles[], contentType: string) {
  const sorted = sortNewestFirst(items.filter(article => article.contentType === contentType));
  // "AI, Productivity" counts as two categories: "AI" and "Productivity".
  const categories = Array.from(new Set(sorted.flatMap(article => splitCategories(article.topicCategory))));
  return { sorted, categories: ['All', ...categories] };
}

export default function ContentListPage({ contentType, heading, subheading, emptyText, pageTitle }: ContentListPageProps) {
  // Server-fetched items on the first load (so hydration matches); otherwise fetched below.
  const initialData = useInitialData();
  const [initialList] = useState(() => prepareList(initialData?.items ?? [], contentType));
  const [articles, setArticles] = useState<Articles[]>(initialList.sorted);
  const [filteredArticles, setFilteredArticles] = useState<Articles[]>(initialList.sorted);
  const [isLoading, setIsLoading] = useState(!initialData?.items);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(initialList.categories);

  useDocumentTitle(pageTitle);

  useEffect(() => {
    if (initialData?.items) return;
    loadArticles();
  }, [contentType]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(
        articles.filter(article => splitCategories(article.topicCategory).includes(selectedCategory))
      );
    }
  }, [selectedCategory, articles]);

  const loadArticles = async () => {
    try {
      const result = await BaseCrudService.getAll<Articles>('articles');
      const { sorted, categories: loadedCategories } = prepareList(result.items, contentType);

      setArticles(sorted);
      setFilteredArticles(sorted);
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-6 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6">
            {heading}
          </h1>
          <p className="font-paragraph text-xl text-secondary max-w-3xl mb-12">
            {subheading}
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                aria-pressed={selectedCategory === category}
                className={`rounded-md px-6 py-2 text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border text-foreground hover:border-primary/50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Articles Grid */}
          <div style={{ minHeight: isLoading ? '600px' : 'auto' }}>
            {isLoading ? null : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link to={getItemPath(article)}>
                      <Card className="p-8 border border-border bg-background hover:border-primary/50 transition-colors h-full flex flex-col">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">
                            {article.topicCategory}
                          </span>
                          {article.publishDate && (
                            <time dateTime={getDateKey(article.publishDate)} className="text-xs text-muted-foreground shrink-0">
                              {formatStoredDate(article.publishDate)}
                            </time>
                          )}
                        </div>
                        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                          {article.articleTitle}
                        </h2>
                        <p className="font-paragraph text-base text-secondary line-clamp-3 flex-grow">
                          {article.shortDescription}
                        </p>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-lg text-muted-foreground">
                  {selectedCategory === 'All' ? emptyText : `Nothing found in "${selectedCategory}" yet.`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
