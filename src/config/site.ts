/**
 * Hand-edited site settings. Everything personal on the site reads from here.
 * Anything left empty is simply not rendered (no placeholder text, no empty
 * headings, no JSON-LD), so the matching section appears once you fill it in.
 */

/**
 * "Start Here" on the homepage — article slugs in the order readers should
 * read them (the slug is the last part of the URL, e.g. /writing/<slug>).
 * Unknown slugs are skipped; the section is hidden until one slug matches.
 */
// TODO: replace with your 3 hand-picked slugs, in reading order.
export const START_HERE_SLUGS: string[] = [];

/** Number of "Start Here" slots shown on the homepage. */
export const START_HERE_COUNT = 3;

/**
 * Personal details for /about. A field left as '' is hidden on the page and
 * left out of the Person JSON-LD; filled fields appear in both.
 */
export const ABOUT_PROFILE = {
  // TODO: your name as you want it shown on /about.
  name: '',
  // TODO: 1-3 sentence bio in your own words.
  shortBio: '',
  // TODO: school name.
  school: '',
  // TODO: major / field of study.
  major: '',
  // TODO: photo path (e.g. '/about-photo.jpg' placed in /public) or a static.wixstatic.com URL.
  photoUrl: '',
  // TODO: alt text describing the photo (e.g. "Portrait of <name>").
  photoAlt: '',
  // TODO: public contact email.
  email: '',
  // TODO: full LinkedIn profile URL (https://www.linkedin.com/in/...).
  linkedinUrl: '',
};

/** "Best 3 articles" on /about — article slugs, in display order. Hidden until one slug matches. */
// TODO: replace with the slugs of your 3 best articles.
export const BEST_ARTICLE_SLUGS: string[] = [];

/**
 * Default social share image (og:image / twitter:image) for pages without
 * their own. Must be a 1200x630 PNG or JPG; a path in /public or an absolute URL.
 */
// TODO: add /public/og-default.png and set this to '/og-default.png'.
export const DEFAULT_OG_IMAGE: string | undefined = undefined;
