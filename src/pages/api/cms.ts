import type { APIRoute } from "astro";
import { BaseCrudService } from "@/integrations";

/**
 * Server-side proxy for BaseCrudService's *Direct methods. Exists because
 * wixClient's API key is a server-only secret, but several page components
 * mount with client:only="react" and call BaseCrudService from the browser.
 */
const ACTIONS: Record<string, (args: any[]) => Promise<unknown>> = {
  create: (args) => BaseCrudService.createDirect(args[0], args[1], args[2]),
  getAll: (args) => BaseCrudService.getAllDirect(args[0], args[1], args[2]),
  getById: (args) => BaseCrudService.getByIdDirect(args[0], args[1], args[2]),
  getByField: (args) => BaseCrudService.getByFieldDirect(args[0], args[1], args[2], args[3]),
  update: (args) => BaseCrudService.updateDirect(args[0], args[1]),
  delete: (args) => BaseCrudService.deleteDirect(args[0], args[1]),
  addReferences: (args) => BaseCrudService.addReferencesDirect(args[0], args[1], args[2]),
  removeReferences: (args) => BaseCrudService.removeReferencesDirect(args[0], args[1], args[2]),
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, args } = (await request.json()) as { action?: string; args?: unknown[] };
    const handler = action ? ACTIONS[action] : undefined;

    if (!handler) {
      return new Response(JSON.stringify({ error: `Unknown CMS action: ${action}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await handler(args ?? []);
    return new Response(JSON.stringify({ data: data ?? null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "CMS request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
