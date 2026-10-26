import type { APIRoute } from "astro";
import { BaseCrudService } from "@/integrations";
import type { Articles } from "@/entities";
import { aiEnglishWeaknessArticle } from "@/data/ai-english-weakness-article";
import { getDateKey, getItemPath } from "@/lib/articles";

const STATIC_ROUTES = ["/", "/writing", "/essays", "/about"];

function urlEntry(loc: string, lastmod?: string) {
  return `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>`;
}

export const GET: APIRoute = async ({ url, site }) => {
  // Same fix as [...slug].astro: url.origin resolves to "https://localhost" on
  // Vercel's serverless runtime, so prefer the configured `site` origin instead.
  const siteUrl = site ? site.origin : url.origin;
  const entries = STATIC_ROUTES.map((route) => urlEntry(`${siteUrl}${route}`));
  entries.push(urlEntry(`${siteUrl}${aiEnglishWeaknessArticle.path}`, aiEnglishWeaknessArticle.datePublished));

  try {
    const articles = await BaseCrudService.getAll<Articles>("articles", undefined, { limit: 1000 });
    for (const article of articles.items) {
      // publishDate exactly as stored (YYYY-MM-DD) — no timezone conversion.
      const lastmod = getDateKey(article.publishDate) ?? getDateKey(article._updatedDate);
      entries.push(urlEntry(`${siteUrl}${getItemPath(article)}`, lastmod));
    }
  } catch (error) {
    console.error("Error building sitemap entries for articles:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
