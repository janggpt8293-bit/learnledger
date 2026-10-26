/**
 * JSON-LD builders for the pages rendered from src/pages/[...slug].astro.
 * Kept framework-agnostic (plain objects) so they can be embedded server-side
 * in <head>, where they're crawlable regardless of client-side rendering.
 */
import { ABOUT_PROFILE } from '@/config/site';

export const SITE_NAME = 'LearnLedger';
export const AUTHOR_NAME = 'Jinwon Jang';
export const AUTHOR_BIO =
  'Student, self-learner, and builder documenting experiments in AI, analytics, language learning, and deliberate practice.';

/** Page <title>s — shared by the server-rendered <head> and the client-side router. */
export const PAGE_TITLES = {
  home: `${SITE_NAME} — Learning in Public`,
  writing: `Writing | ${SITE_NAME}`,
  essays: `Culture Notes | ${SITE_NAME}`,
  about: `About | ${SITE_NAME}`,
  notFound: `Page Not Found | ${SITE_NAME}`,
};

const personId = (siteUrl: string) => `${siteUrl}/about#person`;
const websiteId = (siteUrl: string) => `${siteUrl}/#website`;

/** Minimal Person reference used as author/publisher on other entities. */
function personRef(siteUrl: string, name?: string) {
  return {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: name ?? (ABOUT_PROFILE.name || AUTHOR_NAME),
    url: `${siteUrl}/about`,
  };
}

/** Serializes JSON-LD for a <script> tag; escapes "<" so content can't close the tag early. */
export function serializeJsonLd(entry: Record<string, unknown>): string {
  return JSON.stringify(entry).replace(/</g, '\\u003c');
}

export function buildWebsiteLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: 'en',
    author: { '@id': personId(siteUrl) },
    publisher: { '@id': personId(siteUrl) },
  };
}

/** Full Person entity for /about. Only fields filled in src/config/site.ts are added. */
export function buildPersonLd(siteUrl: string) {
  const profile = ABOUT_PROFILE;
  const image = profile.photoUrl ? new URL(profile.photoUrl, siteUrl).href : undefined;
  return {
    '@context': 'https://schema.org',
    ...personRef(siteUrl),
    description: profile.shortBio || AUTHOR_BIO,
    image,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    sameAs: profile.linkedinUrl ? [profile.linkedinUrl] : undefined,
    alumniOf: profile.school ? { '@type': 'EducationalOrganization', name: profile.school } : undefined,
    mainEntityOfPage: `${siteUrl}/about`,
  };
}

export function buildArticleLd(opts: {
  siteUrl: string;
  url: string;
  headline: string;
  description?: string;
  image?: string;
  /** YYYY-MM-DD as stored */
  datePublished?: string;
  /** YYYY-MM-DD; never earlier than datePublished */
  dateModified?: string;
  authorName?: string;
  keywords?: string;
  articleSection?: string;
}) {
  const dateModified =
    opts.dateModified && opts.datePublished && opts.dateModified < opts.datePublished
      ? opts.datePublished
      : opts.dateModified ?? opts.datePublished;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${opts.url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    url: opts.url,
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified,
    inLanguage: 'en',
    keywords: opts.keywords,
    articleSection: opts.articleSection,
    author: personRef(opts.siteUrl, opts.authorName),
    publisher: personRef(opts.siteUrl, opts.authorName),
    isPartOf: { '@id': websiteId(opts.siteUrl) },
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
