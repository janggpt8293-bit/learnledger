import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Articles } from '@/entities';
import { ABOUT_PROFILE, BEST_ARTICLE_SLUGS } from '@/config/site';
import { formatStoredDate, getDateKey, getItemPath, pickBySlugs } from '@/lib/articles';
import { PAGE_TITLES } from '@/lib/structured-data';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useInitialData } from '@/lib/initial-data';

const BEST_ARTICLE_COUNT = 3;

/** BEST_ARTICLE_SLUGS that match a published item, in configured order. */
const pickBestArticles = (items: Articles[]) =>
  pickBySlugs(items, BEST_ARTICLE_SLUGS.slice(0, BEST_ARTICLE_COUNT)).filter(
    (article): article is Articles => Boolean(article)
  );

export default function AboutPage() {
  // Server-fetched items on the first load (so hydration matches); otherwise fetched below.
  const initialData = useInitialData();
  const [bestArticles, setBestArticles] = useState<Articles[]>(() => pickBestArticles(initialData?.items ?? []));
  const profile = ABOUT_PROFILE;

  // Unfilled ABOUT_PROFILE fields are not rendered; the whole profile block is
  // hidden until at least one field is filled in.
  const details = [
    { label: 'School', value: profile.school },
    { label: 'Major', value: profile.major },
  ].filter((detail) => detail.value);
  const hasContact = Boolean(profile.email || profile.linkedinUrl);
  const hasProfile = Boolean(
    profile.name || profile.shortBio || profile.photoUrl || details.length > 0 || hasContact
  );

  useDocumentTitle(PAGE_TITLES.about);

  useEffect(() => {
    if (BEST_ARTICLE_SLUGS.length === 0 || initialData?.items) return;
    BaseCrudService.getAll<Articles>('articles')
      .then((result) => setBestArticles(pickBestArticles(result.items)))
      .catch((error) => console.error('Error loading best articles:', error));
  }, []);

  const skills = [
    'AI & Prompt Engineering',
    'ESL & Language Learning',
    'Writing & Storytelling',
    'Cross-Cultural Perspective',
    'Lifelong Curiosity'
  ];

  const principles = [
    {
      title: 'Learn in Public',
      description: 'Documenting the journey, sharing insights, and building a body of work that tracks growth over time.'
    },
    {
      title: 'Build to Understand',
      description: 'Creating projects and tools to apply theoretical knowledge in practical, real-world scenarios.'
    },
    {
      title: 'Think Through Systems',
      description: 'Approaching problems analytically, breaking down complexity, and finding patterns across domains.'
    },
    {
      title: 'Stay Curious',
      description: 'Maintaining intellectual curiosity, asking questions, and pursuing understanding beyond surface-level knowledge.'
    }
  ];

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
            About
          </h1>
          <p className="font-paragraph text-xl text-secondary max-w-3xl mb-16">
            A student on a long-term journey to build expertise in AI, analytics, and analytical thinking.
          </p>

          {/* Profile — from ABOUT_PROFILE in src/config/site.ts.
              TODO: fill in name, shortBio, school, major, photoUrl/photoAlt, email, linkedinUrl.
              Each field (and this whole block) stays hidden until it has a value. */}
          {hasProfile && (
            <section className="mb-20" aria-label="Profile">
              <div className={`grid grid-cols-1 gap-8 md:gap-12 max-w-5xl items-start ${profile.photoUrl ? 'md:grid-cols-[16rem_1fr]' : ''}`}>
                {profile.photoUrl && (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.photoAlt || profile.name || 'Profile photo'}
                    width={256}
                    height={256}
                    loading="lazy"
                    className="w-48 h-48 md:w-64 md:h-64 object-cover border border-border"
                  />
                )}

                <div className="space-y-6">
                  {profile.name && (
                    <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                      {profile.name}
                    </h2>
                  )}

                  {profile.shortBio && (
                    <p className="font-paragraph text-lg text-foreground leading-relaxed max-w-2xl">
                      {profile.shortBio}
                    </p>
                  )}

                  {(details.length > 0 || hasContact) && (
                    <dl className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-3 font-paragraph text-base">
                      {details.map((detail) => (
                        <div key={detail.label} className="contents">
                          <dt className="font-medium text-secondary">{detail.label}</dt>
                          <dd className="text-foreground">{detail.value}</dd>
                        </div>
                      ))}
                      {profile.email && (
                        <>
                          <dt className="font-medium text-secondary">Email</dt>
                          <dd className="text-foreground">
                            <a href={`mailto:${profile.email}`} className="text-primary underline underline-offset-4">
                              {profile.email}
                            </a>
                          </dd>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <dt className="font-medium text-secondary">LinkedIn</dt>
                          <dd className="text-foreground">
                            <a
                              href={profile.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline underline-offset-4"
                            >
                              LinkedIn profile
                            </a>
                          </dd>
                        </>
                      )}
                    </dl>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Bio Section */}
          <section className="mb-20">
            <div className="max-w-4xl">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
                The Journey
              </h2>
              <div className="space-y-6 font-paragraph text-base text-foreground leading-relaxed">
                <p>
                  This website exists to document a long-term learning journey. It's not about claiming expertise or selling a product. It's about building skills systematically, thinking deeply, and sharing the process publicly.
                </p>
                <p>
                  I'm a student focused on developing capabilities in artificial intelligence and data analytics. The goal is to understand these domains deeply, build practical projects, and document insights along the way.
                </p>
                <p>
                  Every article, project, and progress update represents a step in this journey. Some ideas will be refined over time. Some projects will evolve. That's the nature of learning in public—it's messy, iterative, and honest.
                </p>
                <p>
                  This is not a portfolio of perfection. It's a laboratory for continuous improvement.
                </p>
              </div>
            </div>
          </section>

          {/* Best 3 Articles — slugs from BEST_ARTICLE_SLUGS in src/config/site.ts.
              TODO: add your 3 slugs. Hidden until at least one slug matches a published item. */}
          {bestArticles.length > 0 && (
            <section className="mb-20" aria-labelledby="best-articles-heading">
              <h2 id="best-articles-heading" className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
                Best 3 Articles
              </h2>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                {bestArticles.map((article) => (
                  <li key={article._id}>
                    <Link
                      to={getItemPath(article)}
                      className="group flex flex-col h-full p-6 border border-border hover:border-primary/50 transition-colors"
                    >
                      <span className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
                        {article.topicCategory}
                      </span>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {article.articleTitle}
                      </h3>
                      {article.publishDate && (
                        <time dateTime={getDateKey(article.publishDate)} className="text-xs text-muted-foreground mt-auto">
                          {formatStoredDate(article.publishDate)}
                        </time>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Skills Section */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
              Areas of Focus
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="p-6 border border-border bg-background text-center">
                    <p className="font-paragraph text-sm font-medium text-foreground">
                      {skill}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Principles Section */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
              Guiding Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 border border-border bg-background h-full">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      {principle.title}
                    </h3>
                    <p className="font-paragraph text-base text-secondary">
                      {principle.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Philosophy Section */}
          <section>
            <div className="max-w-4xl">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
                Philosophy
              </h2>
              <div className="space-y-6 font-paragraph text-base text-foreground leading-relaxed">
                <p>
                  I believe in the power of consistent, deliberate practice. Expertise isn't built overnight—it's the result of showing up daily, tackling difficult problems, and refining understanding over time.
                </p>
                <p>
                  This website reflects that philosophy. It's a commitment to transparency, intellectual honesty, and the long game of skill development.
                </p>
                <p>
                  If you're on a similar journey, I hope this serves as inspiration or a useful resource. If you have feedback, questions, or want to connect, feel free to reach out through the contact form.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
