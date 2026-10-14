// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import customErrorOverlayPlugin from "./vite-error-overlay-plugin.js";

// Single source of truth for the public domain. Exposed as `site` (Astro.site in
// pages/endpoints) and used for canonical/OG URLs, JSON-LD, the sitemap and
// robots.txt. Astro.url.origin can't be trusted for this on Vercel's serverless
// runtime, which resolves it to "https://localhost".
export const SITE_URL = "https://learnledgerlab.com";

// Every build — production and Vercel previews alike — canonicalizes to the real
// domain so preview URLs never compete in search results. Only `astro dev` uses
// localhost.
const isDev = process.argv.includes("dev");
const site = isDev ? "http://localhost:4321" : SITE_URL;

// https://astro.build/config
export default defineConfig({
  site,
  output: "server",
  adapter: vercel(),
  integrations: [tailwind(), react()],
  vite: {
    plugins: [customErrorOverlayPlugin()],
    cacheDir: 'node_modules/.cache/.vite',
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'framer-motion',
        'date-fns',
        'clsx',
        'class-variance-authority',
        'tailwind-merge',
        '@radix-ui/*',
        'zod',
      ],
    },
  },
  devToolbar: {
    enabled: false,
  },
  image: {
    domains: ["static.wixstatic.com"],
  },
});
