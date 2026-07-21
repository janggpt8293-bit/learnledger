// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import customErrorOverlayPlugin from "./vite-error-overlay-plugin.js";

// Absolute site origin used for canonical/OG URLs and the sitemap. Astro.url.origin
// can't be trusted for this on Vercel's serverless runtime, so we derive it from
// Vercel's own env vars instead: the production domain in prod, the per-deployment
// URL in preview builds, and localhost when running `astro dev` outside Vercel.
const site =
  process.env.VERCEL_ENV === "production"
    ? "https://learnledger-green.vercel.app"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:4321";

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
