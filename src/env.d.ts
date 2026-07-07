/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare const Astro: Readonly<import("astro").AstroGlobal>;

declare global {
  interface SDKTypeMode {
    strict: true;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly WIX_API_KEY: string;
    readonly WIX_SITE_ID: string;
  }
}
