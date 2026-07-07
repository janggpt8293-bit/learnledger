import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Articles } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function WritingPage() {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Articles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.topicCategory === selectedCategory));
    }
  }, [selectedCategory, articles]);

  const loadArticles = async () => {
    try {
      const result = await BaseCrudService.getAll<Articles>('articles');
      const sortedArticles = result.items.sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      });
      
      setArticles(sortedArticles);
      setFilteredArticles(sortedArticles);

      const uniqueCategories = Array.from(
        new Set(sortedArticles.map(article => article.topicCategory).filter(Boolean))
      ) as string[];
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full max-w-[100rem] mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6">
            Writing
          </h1>
          <p className="font-paragraph text-xl text-secondary max-w-3xl mb-12">
            Thoughts on AI and analytics. Documenting the journey of continuous learning.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
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
                    <Link to={`/writing/${article.slug || article._id}`}>
                      <Card className="p-8 border border-border bg-background hover:border-primary/50 transition-colors h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">
                            {article.topicCategory}
                          </span>
                          {article.publishDate && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(article.publishDate), 'MMM d, yyyy')}
                            </span>
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
                  {selectedCategory === 'All' 
                    ? 'No articles published yet.' 
                    : `No articles found in "${selectedCategory}" category.`}
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
