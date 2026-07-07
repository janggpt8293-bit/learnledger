import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aiEnglishWeaknessArticle as article } from '@/data/ai-english-weakness-article';

const ArticlePage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tableOfContents = [
    ...article.sections.map((section) => ({ id: section.id, title: section.title })),
    { id: 'faq', title: 'Frequently Asked Questions' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-white pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          {/* Category Tag */}
          <div className="mb-6">
            <span className="inline-block text-xs font-medium tracking-wide text-primary uppercase">
              {article.category}
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            {article.title}
          </h1>

          {/* Subheadline */}
          <p className="font-paragraph text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
            {article.subheadline}
          </p>

          {/* Article Metadata */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8">
            <span className="font-medium">{article.author}</span>
            <span className="hidden md:inline">•</span>
            <time dateTime={article.datePublished}>
              {new Date(article.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span className="hidden md:inline">•</span>
            <span>{article.readingTime}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mt-8"></div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents Sidebar */}
            <aside className={`lg:col-span-1 ${isSticky ? 'lg:sticky lg:top-20 lg:h-fit' : ''}`}>
              <div className="hidden lg:block">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground mb-6">
                  Contents
                </h3>
                <nav className="space-y-3">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block text-sm leading-relaxed text-left transition-colors ${
                        activeSection === item.id
                          ? 'font-medium text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-3 max-w-2xl">
              {article.sections.map((section) => (
                <div key={section.id}>
                  <section id={section.id} className="mb-12 scroll-mt-24">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-foreground">
                      {section.title}
                    </h2>
                    <div className="space-y-6 font-paragraph text-base md:text-lg leading-relaxed text-foreground">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ))}
                    </div>
                  </section>

                  {section.quote && (
                    <blockquote className="my-12 pl-6 border-l-4 border-primary bg-gray-50 py-6 px-6">
                      <p className="font-paragraph text-lg md:text-xl font-medium text-foreground italic">
                        "{section.quote}"
                      </p>
                    </blockquote>
                  )}
                </div>
              ))}

              {/* FAQ Section */}
              <section id="faq" className="mb-12 scroll-mt-24">
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 text-foreground">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {article.faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                      <AccordionTrigger className="font-paragraph font-bold text-foreground hover:text-primary py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-paragraph text-base leading-relaxed text-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* Author Box */}
              <section className="mt-16 pt-12 border-t border-border">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      {article.author}
                    </h3>
                    <p className="font-paragraph text-base leading-relaxed text-muted-foreground mb-6">
                      {article.authorBio}
                    </p>
                    <a
                      href="/writing"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Read More Articles
                      <ChevronRight size={18} />
                    </a>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArticlePage;
