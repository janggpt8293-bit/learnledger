import type { APIRoute } from "astro";

// AI/answer-engine crawlers explicitly welcomed so this content can be cited by AI
// search and chat assistants (GEO).
const USER_AGENTS = [
  // Standard search engines
  "Googlebot",
  "Bingbot",
  // GEO / AI answer-engine crawlers
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Amazonbot",
  "Applebot-Extended",
  "*",
];

export const GET: APIRoute = ({ site, url }) => {
  // Same reasoning as sitemap.xml.ts: prefer the configured `site` origin, since
  // url.origin resolves to "https://localhost" on Vercel's serverless runtime.
  const siteUrl = site ? site.origin : url.origin;
  const rules = USER_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`).join("\n\n");
  const body = `${rules}\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
