import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Articles, ContactSubmissions } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import {
  formatStoredDate,
  getDateKey,
  getFeaturedArticles,
  getItemPath,
  getLatestArticle,
  pickBySlugs,
} from '@/lib/articles';
import { START_HERE_COUNT, START_HERE_SLUGS } from '@/config/site';
import { PAGE_TITLES } from '@/lib/structured-data';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Articles[]>([]);
  const [latestArticle, setLatestArticle] = useState<Articles | undefined>();
  const [startHereArticles, setStartHereArticles] = useState<(Articles | undefined)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useDocumentTitle(PAGE_TITLES.home);

  // Only configured slugs that match a published item; unfilled slots are skipped.
  const startHereList = startHereArticles.filter((article): article is Articles => Boolean(article));
  // Section labels stay sequential (01, 02, ...) whether or not Start Here is shown.
  const sectionNumber = (position: number) =>
    String(position + (startHereList.length > 0 ? 1 : 0)).padStart(2, '0');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const articlesResult = await BaseCrudService.getAll<Articles>('articles');

      // Articles only (never essays); dates compared as stored YYYY-MM-DD strings.
      setFeaturedArticles(getFeaturedArticles(articlesResult.items, 3));
      setLatestArticle(getLatestArticle(articlesResult.items));
      setStartHereArticles(pickBySlugs(articlesResult.items, START_HERE_SLUGS.slice(0, START_HERE_COUNT)));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await BaseCrudService.create('contactsubmissions', {
        _id: crypto.randomUUID(),
        senderName: formData.name,
        senderEmail: formData.email,
        subject: formData.subject,
        messageContent: formData.message,
        submissionDate: new Date().toISOString()
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-clip">
      <style>{`
        .hairline-t { border-top: 1px solid theme('colors.border'); }
        .hairline-b { border-bottom: 1px solid theme('colors.border'); }
        .hairline-l { border-left: 1px solid theme('colors.border'); }
        .hairline-r { border-right: 1px solid theme('colors.border'); }
        
        .grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(222, 226, 230, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(222, 226, 230, 0.4) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
      `}</style>

      {/* Global Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center pt-32 pb-24">
        <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
        
        <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 text-balance">
                  Learning in public.<br />
                  Building with data.<br />
                  Thinking through systems.
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <p className="font-paragraph text-xl md:text-2xl text-secondary max-w-2xl text-balance">
                  Exploring AI, analytics, and learning systems while documenting the journey publicly.
                </p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="lg:col-span-3 flex flex-col gap-4 lg:pb-4"
            >
              <Link to="/writing" className="w-full">
                <Button className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-none h-14 text-base font-medium transition-colors duration-300 flex justify-between items-center px-6 group">
                  Read Writing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Start Here - hand-picked reading order from START_HERE_SLUGS in src/config/site.ts.
          Hidden until at least one configured slug matches a published item. */}
      {startHereList.length > 0 && (
        <section className="w-full hairline-t bg-background relative z-20" aria-labelledby="start-here-heading">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 py-24">
            <span className="text-xs font-medium text-secondary uppercase tracking-widest mb-4 block">01</span>
            <h2 id="start-here-heading" className="font-heading text-4xl md:text-5xl font-semibold mb-6">Start Here</h2>
            {/* TODO: optional — replace this intro with your own sentence about the reading order. */}
            <p className="font-paragraph text-secondary mb-12 max-w-2xl">
              New here? Read these in order.
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {startHereList.map((article, index) => (
                <li key={article._id}>
                  <Link
                    to={getItemPath(article)}
                    className="group flex flex-col h-full p-8 border border-border hover:border-primary hover:bg-secondary/5 transition-all"
                  >
                    <span className="text-xs font-medium text-secondary uppercase tracking-widest mb-4">
                      Step {index + 1}
                    </span>
                    <h3 className="font-heading text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                      {article.articleTitle}
                    </h3>
                    <p className="font-paragraph text-secondary line-clamp-3">
                      {article.shortDescription}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Featured Writing - Sticky Layout */}
      <section className="w-full hairline-t bg-background relative z-20">
        <div className="w-full max-w-[120rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Sticky Sidebar */}
            <div className="lg:col-span-4 p-6 md:p-12 hairline-b lg:hairline-b-0 lg:hairline-r relative">
              <div className="lg:sticky lg:top-32">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-xs font-medium text-secondary uppercase tracking-widest mb-4 block">{sectionNumber(1)}</span>
                  <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-8">Featured Writing</h2>
                  <p className="font-paragraph text-secondary mb-12 max-w-sm">
                    Documenting observations, systems, and analytical approaches to continuous learning.
                  </p>
                  <Link to="/writing">
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary hover:text-primary/80 group font-medium">
                      View All Articles <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Scrolling Content */}
            <div className="lg:col-span-8">
              <div className="flex flex-col">
                {isLoading ? (
                  <div className="p-12 text-secondary">Loading articles...</div>
                ) : featuredArticles.length > 0 ? (
                  featuredArticles.map((article, index) => (
                    <motion.div
                      key={article._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className={`group block p-6 md:p-12 hover:bg-secondary/5 transition-colors ${index !== featuredArticles.length - 1 ? 'hairline-b' : ''}`}
                    >
                      <Link to={getItemPath(article)} className="block h-full">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-4">
                          <div className="text-xs font-medium text-primary uppercase tracking-wider">
                            {article.topicCategory || 'Uncategorized'}
                          </div>
                          <time dateTime={getDateKey(article.publishDate)} className="text-sm text-secondary font-mono">
                            {formatStoredDate(article.publishDate) ?? 'Recent'}
                          </time>
                        </div>
                        <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-4 group-hover:text-primary transition-colors flex items-center gap-3">
                          {article.articleTitle}
                          <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="font-paragraph text-lg text-secondary line-clamp-2 max-w-3xl">
                          {article.shortDescription}
                        </p>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-secondary">No featured articles yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Latest Article Section */}
      <section className="w-full hairline-t bg-background relative z-20">
        <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-medium text-secondary uppercase tracking-widest mb-4 block">Latest Article</span>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-12">Recent Writing</h2>

            {!isLoading && latestArticle && (
              <div className="max-w-2xl">
                <Link to={getItemPath(latestArticle)}>
                  <div className="group block p-8 border border-border bg-background hover:border-primary hover:bg-secondary/5 transition-all">
                    {latestArticle.topicCategory && (
                      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
                        {latestArticle.topicCategory}
                      </p>
                    )}
                    <h3 className="font-heading text-3xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors flex items-center gap-3">
                      {latestArticle.articleTitle}
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="font-paragraph text-lg text-secondary mb-6">
                      {latestArticle.shortDescription}
                    </p>
                    <div className="flex items-center gap-4">
                      <time dateTime={getDateKey(latestArticle.publishDate)} className="text-sm text-secondary font-mono">
                        {formatStoredDate(latestArticle.publishDate) ?? 'Recent'}
                      </time>
                      <Button variant="ghost" className="p-0 hover:bg-transparent text-primary hover:text-primary/80 group font-medium">
                        Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full hairline-t bg-background relative z-20">
        <div className="w-full max-w-[120rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            <div className="p-6 md:p-12 lg:p-24 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-center bg-secondary/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs font-medium text-secondary uppercase tracking-widest mb-4 block">{sectionNumber(2)}</span>
                <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">Get in Touch</h2>
                <p className="font-paragraph text-xl text-secondary max-w-md mb-12">
                  Open to discussions on data, learning systems, or potential collaborations.
                </p>
                <div className="flex items-center gap-4 text-secondary">
                  <Mail className="w-5 h-5" />
                  <span className="font-mono text-sm">Direct message via form</span>
                </div>
              </motion.div>
            </div>

            <div className="p-6 md:p-12 lg:p-24 flex flex-col justify-center">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-8 max-w-xl w-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Name"
                      aria-label="Name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-0 py-4 border-0 hairline-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary text-lg placeholder:text-secondary transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Email"
                      aria-label="Email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-0 py-4 border-0 hairline-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary text-lg placeholder:text-secondary transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Subject"
                      aria-label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-0 py-4 border-0 hairline-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary text-lg placeholder:text-secondary transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Textarea
                      placeholder="Message"
                      aria-label="Message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-0 py-4 border-0 hairline-b rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary text-lg placeholder:text-secondary resize-none transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-none h-14 text-base font-medium transition-colors duration-300"
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Message'}
                </Button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-sm text-primary text-center"
                    >
                      Message received. I will respond shortly.
                    </motion.p>
                  )}
                  {submitStatus === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-sm text-destructive text-center"
                    >
                      Transmission failed. Please try again.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
