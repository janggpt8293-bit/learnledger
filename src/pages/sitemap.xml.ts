import type { APIRoute } from "astro";
import { BaseCrudService } from "@/integrations";
import type { Articles, Projects } from "@/entities";
import { aiEnglishWeaknessArticle } from "@/data/ai-english-weakness-article";

const STATIC_ROUTES = ["/", "/writing", "/about", "/projects", aiEnglishWeaknessArticle.path];

function urlEntry(loc: string, lastmod?: string) {
  return `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>`;
}

export const GET: APIRoute = async ({ url, site }) => {
  // Same fix as [...slug].astro: url.origin resolves to "https://localhost" on
  // Vercel's serverless runtime, so prefer the configured `site` origin instead.
  const siteUrl = site ? site.origin : url.origin;
  const entries = STATIC_ROUTES.map((route) => urlEntry(`${siteUrl}${route}`));

  try {
    const articles = await BaseCrudService.getAll<Articles>("articles", undefined, { limit: 1000 });
    for (const article of articles.items) {
      const slug = article.slug || article._id;
      const lastmod = article._updatedDate ? new Date(article._updatedDate).toISOString() : undefined;
      entries.push(urlEntry(`${siteUrl}/writing/${slug}`, lastmod));
    }
  } catch (error) {
    console.error("Error building sitemap entries for articles:", error);
  }

  try {
    const projects = await BaseCrudService.getAll<Projects>("projects", undefined, { limit: 1000 });
    for (const project of projects.items) {
      const lastmod = project._updatedDate ? new Date(project._updatedDate).toISOString() : undefined;
      entries.push(urlEntry(`${siteUrl}/projects/${project._id}`, lastmod));
    }
  } catch (error) {
    console.error("Error building sitemap entries for projects:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
