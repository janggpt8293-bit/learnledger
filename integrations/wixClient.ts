import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { items } from "@wix/data";

/**
 * Standalone (non-Wix-hosted) sites don't get ambient Wix auth context, so
 * every @wix/data call goes through this explicitly authenticated client.
 * See: https://dev.wix.com/docs/go-headless/develop-your-project/admin-operations/create-a-java-script-sdk-client-with-an-api-key
 */
export const wixClient = createClient({
  auth: ApiKeyStrategy({
    apiKey: import.meta.env.WIX_API_KEY,
    siteId: import.meta.env.WIX_SITE_ID,
  }),
  modules: { items },
});
