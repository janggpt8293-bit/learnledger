/**
 * Shared article helpers used by both the React pages and the server-rendered
 * Astro fallback, so sorting, dates, FAQ detection and body formatting agree
 * everywhere.
 */
import type { Articles } from '@/entities';

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Returns the stored calendar date as "YYYY-MM-DD", without ever going through
 * a timezone conversion. Wix stores date-only fields as "YYYY-MM-DD" strings;
 * `new Date("2026-10-07")` would read that as UTC midnight and show Oct 6 in
 * any timezone west of UTC.
 */
export function getDateKey(value: Date | string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : undefined;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    // Date-only values arrive as UTC midnight, so read the UTC calendar date.
    return value.toISOString().slice(0, 10);
  }
  return undefined;
}

/** Formats a stored date as "Oct 7, 2026" (short) or "October 7, 2026" (long). */
export function formatStoredDate(
  value: Date | string | undefined | null,
  style: 'short' | 'long' = 'short'
): string | undefined {
  const key = getDateKey(value);
  if (!key) return undefined;
  const [year, month, day] = key.split('-').map(Number);
  const months = style === 'long' ? MONTHS_LONG : MONTHS_SHORT;
  return `${months[month - 1]} ${day}, ${year}`;
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

/** Newest first by stored publishDate (string compare on YYYY-MM-DD). Undated items go last. */
export function sortNewestFirst<T extends Articles>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = getDateKey(a.publishDate) ?? '';
    const dateB = getDateKey(b.publishDate) ?? '';
    return dateB.localeCompare(dateA);
  });
}

export const isArticle = (item: Articles) => item.contentType === 'article';
export const isEssay = (item: Articles) => item.contentType === 'essay';

/** URL path for a CMS item — essays live under /essays, everything else under /writing. */
export function getItemPath(item: Articles): string {
  return `${isEssay(item) ? '/essays' : '/writing'}/${item.slug || item._id}`;
}

/** "AI, Productivity" -> ["AI", "Productivity"] */
export function splitCategories(topicCategory: string | undefined): string[] {
  if (!topicCategory) return [];
  return topicCategory.split(',').map((category) => category.trim()).filter(Boolean);
}

/** Newest item with contentType "article" (never an essay). */
export function getLatestArticle(items: Articles[]): Articles | undefined {
  return sortNewestFirst(items.filter(isArticle))[0];
}

/** isFeatured articles only (no essays), newest first. */
export function getFeaturedArticles(items: Articles[], max = 3): Articles[] {
  return sortNewestFirst(items.filter((item) => isArticle(item) && item.isFeatured)).slice(0, max);
}

/** Other articles (no essays) sharing at least one topicCategory, newest first. */
export function getRelatedArticles(items: Articles[], current: Articles, max = 3): Articles[] {
  const currentCategories = splitCategories(current.topicCategory);
  if (currentCategories.length === 0) return [];
  return sortNewestFirst(
    items.filter(
      (item) =>
        isArticle(item) &&
        item._id !== current._id &&
        splitCategories(item.topicCategory).some((category) => currentCategories.includes(category))
    )
  ).slice(0, max);
}

/** Looks up items by slug, keeping the order of `slugs`; missing slugs become undefined. */
export function pickBySlugs(items: Articles[], slugs: string[]): (Articles | undefined)[] {
  return slugs.map((slug) => items.find((item) => (item.slug || '').trim() === slug.trim()));
}

// ---------------------------------------------------------------------------
// Body parsing (mainContent is plain text with blank-line separated paragraphs)
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

export type BodyBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'faq'; heading: string; items: FaqItem[] };

const FAQ_HEADING = /^(faqs?|frequently asked questions)\s*:?$/i;
const BYLINE = /^by\s/i;
const DATE_LINE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
// Closing call-to-action appended after some FAQs — not part of the last answer.
const CLOSING_CTA = /^if this resonated with you/i;
// "Question? Answer..." on a single line.
const INLINE_QA = /^(.{5,200}?\?)\s+(.+)$/;

/** Short line with no closing punctuation = a section heading in the plain-text body. */
function isHeadingLine(line: string): boolean {
  return (
    line.length >= 3 &&
    line.length <= 90 &&
    !/[.!?,:;"'”’)…\]]$/.test(line) &&
    !BYLINE.test(line) &&
    !DATE_LINE.test(line)
  );
}

function toLines(content: string): string[] {
  return content.split(/\r?\n/).map((line) => line.trim());
}

/**
 * Extracts Q&A pairs from the FAQ section. Supports both styles used in the CMS:
 *  - question on its own line ending in "?", answer on the following line(s)
 *  - "Question? Answer." on a single line
 */
function parseFaqLines(lines: string[]): FaqItem[] {
  const content = lines.filter(Boolean);
  const endIndex = content.findIndex((line) => CLOSING_CTA.test(line));
  const faqLines = endIndex === -1 ? content : content.slice(0, endIndex);
  if (faqLines.length === 0) return [];

  const questionOnOwnLine = faqLines[0].endsWith('?');
  const items: FaqItem[] = [];

  for (const line of faqLines) {
    if (questionOnOwnLine) {
      if (line.endsWith('?')) {
        items.push({ question: line, answer: '' });
      } else if (items.length > 0) {
        const last = items[items.length - 1];
        last.answer = last.answer ? `${last.answer} ${line}` : line;
      }
    } else {
      const match = line.match(INLINE_QA);
      if (match) {
        items.push({ question: match[1].trim(), answer: match[2].trim() });
      } else if (items.length > 0) {
        const last = items[items.length - 1];
        last.answer = `${last.answer} ${line}`.trim();
      }
    }
  }

  return items.filter((item) => item.question && item.answer);
}

function findFaqStart(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (FAQ_HEADING.test(lines[i])) return i;
  }
  return -1;
}

/** FAQ pairs from mainContent, or [] if no FAQ section is found. */
export function extractFaq(mainContent: string | undefined): FaqItem[] {
  if (!mainContent) return [];
  const lines = toLines(mainContent);
  const start = findFaqStart(lines);
  return start === -1 ? [] : parseFaqLines(lines.slice(start + 1));
}

/** Minimum Q&A pairs before an FAQ is rendered as such and emitted as FAQPage JSON-LD. */
export const MIN_FAQ_ITEMS = 2;

/**
 * Splits mainContent into headings, paragraphs and an FAQ block for display.
 * The title / byline / date lines repeated at the top of the stored body are
 * dropped (the page already renders them). Nothing is changed in the CMS.
 */
export function parseArticleBody(mainContent: string | undefined): BodyBlock[] {
  if (!mainContent) return [];
  const lines = toLines(mainContent);

  // Drop the leading title / byline / date header (up to 3 lines, title only as the very first).
  const hasHeader = lines
    .filter(Boolean)
    .slice(0, 3)
    .some((line) => BYLINE.test(line) || DATE_LINE.test(line));
  if (hasHeader) {
    let dropped = 0;
    for (let i = 0; i < lines.length && dropped < 3; i++) {
      if (!lines[i]) continue;
      const isHeaderLine =
        BYLINE.test(lines[i]) || DATE_LINE.test(lines[i]) || (dropped === 0 && lines[i].length <= 120);
      if (!isHeaderLine) break;
      lines[i] = '';
      dropped++;
    }
  }

  const blocks: BodyBlock[] = [];
  const faqStart = findFaqStart(lines);
  const faqItems = faqStart === -1 ? [] : parseFaqLines(lines.slice(faqStart + 1));
  const useFaqBlock = faqItems.length >= MIN_FAQ_ITEMS;
  const bodyLines = useFaqBlock ? lines.slice(0, faqStart) : lines;

  for (const line of bodyLines) {
    if (!line) continue;
    blocks.push(isHeadingLine(line) ? { type: 'heading', text: line } : { type: 'paragraph', text: line });
  }

  if (useFaqBlock) {
    blocks.push({ type: 'faq', heading: lines[faqStart], items: faqItems });
    // Keep any closing call-to-action that followed the FAQ.
    const ctaLine = lines.slice(faqStart + 1).find((line) => CLOSING_CTA.test(line));
    if (ctaLine) blocks.push({ type: 'paragraph', text: ctaLine });
  }

  return blocks;
}
