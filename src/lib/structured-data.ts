/**
 * JSON-LD builders for the pages rendered from src/pages/[...slug].astro.
 * Kept framework-agnostic (plain objects) so they can be embedded server-side
 * in <head>, where they're crawlable regardless of client-side rendering.
 */

export const SITE_NAME = 'Learning Lab';
export const AUTHOR_NAME = 'Jinwon Jang';
export const AUTHOR_BIO =
  'Student, self-learner, and builder documenting experiments in AI, analytics, language learning, and deliberate practice.';

export function buildWebsiteLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
  };
}

export function buildPersonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: siteUrl,
    description: AUTHOR_BIO,
  };
}

export function buildArticleLd(opts: {
  url: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: opts.url,
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    author: { '@type': 'Person', name: opts.authorName ?? AUTHOR_NAME },
  };
}

export function buildFaqLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function buildBreadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
