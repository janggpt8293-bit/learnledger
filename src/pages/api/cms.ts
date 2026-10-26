import type { APIRoute } from "astro";
import { BaseCrudService } from "@/integrations";

/**
 * Server-side proxy for BaseCrudService's *Direct methods. Exists because
 * wixClient's API key is a server-only secret, but several page components
 * mount with client:only="react" and call BaseCrudService from the browser.
 *
 * This endpoint is public, and the API key behind it has admin rights over
 * every collection, so it only allows what the browser actually needs:
 * reading the public "articles" collection and submitting the contact form.
 * Everything else is rejected with 403.
 */

const ARTICLES = "articles";
const CONTACT_SUBMISSIONS = "contactsubmissions";

/** Max items per getAll call from the browser. */
const MAX_PAGE_SIZE = 100;

/** Contact-form fields accepted, mapped to their max lengths. Anything else is dropped. */
const CONTACT_FIELD_LIMITS = {
  senderName: 200,
  senderEmail: 254,
  subject: 300,
  messageContent: 5000,
} as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class ForbiddenError extends Error {}
class BadRequestError extends Error {}

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.length > 0;

function requireArticles(collectionId: unknown) {
  if (collectionId !== ARTICLES) throw new ForbiddenError();
}

/** Keeps only the contact-form fields, validates them, and returns the item to insert. */
function sanitizeContactSubmission(input: unknown): Record<string, string> {
  const data = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const item: Record<string, string> = {};

  for (const [field, maxLength] of Object.entries(CONTACT_FIELD_LIMITS)) {
    const value = data[field];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value !== "string") throw new BadRequestError(`${field} must be text`);
    const trimmed = value.trim();
    if (trimmed.length > maxLength) throw new BadRequestError(`${field} is too long (max ${maxLength} characters)`);
    if (trimmed) item[field] = trimmed;
  }

  if (!item.senderEmail || !EMAIL_PATTERN.test(item.senderEmail)) {
    throw new BadRequestError("A valid email is required");
  }
  if (!item.messageContent) {
    throw new BadRequestError("A message is required");
  }

  // Keep the browser's timestamp when it's a valid date, otherwise use the server's.
  const submitted = typeof data.submissionDate === "string" ? new Date(data.submissionDate) : null;
  item.submissionDate =
    submitted && !Number.isNaN(submitted.getTime()) ? submitted.toISOString() : new Date().toISOString();

  return item;
}

const ACTIONS: Record<string, (args: unknown[]) => Promise<unknown>> = {
  getAll: (args) => {
    requireArticles(args[0]);
    const requested = (args[2] as { limit?: unknown; skip?: unknown } | undefined) ?? {};
    const limit = typeof requested.limit === "number" ? Math.min(Math.max(1, requested.limit), MAX_PAGE_SIZE) : MAX_PAGE_SIZE;
    const skip = typeof requested.skip === "number" && requested.skip > 0 ? requested.skip : 0;
    return BaseCrudService.getAllDirect(ARTICLES, undefined, { limit, skip });
  },
  getById: (args) => {
    requireArticles(args[0]);
    if (!isNonEmptyString(args[1])) throw new BadRequestError("An item id is required");
    return BaseCrudService.getByIdDirect(ARTICLES, args[1]);
  },
  getByField: (args) => {
    requireArticles(args[0]);
    if (args[1] !== "slug") throw new ForbiddenError();
    if (!isNonEmptyString(args[2])) throw new BadRequestError("A slug is required");
    return BaseCrudService.getByFieldDirect(ARTICLES, "slug", args[2]);
  },
  create: (args) => {
    if (args[0] !== CONTACT_SUBMISSIONS) throw new ForbiddenError();
    return BaseCrudService.createDirect(CONTACT_SUBMISSIONS, sanitizeContactSubmission(args[1]));
  },
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ request }) => {
  let body: { action?: string; args?: unknown[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const action = typeof body?.action === "string" ? body.action : undefined;
  const args = Array.isArray(body?.args) ? body.args : [];
  const collectionId = args[0];
  const handler = action && Object.hasOwn(ACTIONS, action) ? ACTIONS[action] : undefined;

  if (!handler) {
    console.error(`[api/cms] Rejected action: ${action} on ${String(collectionId)}`);
    return json({ error: "Forbidden" }, 403);
  }

  try {
    const data = await handler(args);
    if (data === undefined || data === null) {
      console.error(`[api/cms] action "${action}" resolved with no data`, { args });
    }
    return json({ data: data ?? null }, 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      console.error(`[api/cms] Rejected action: ${action} on ${String(collectionId)}`);
      return json({ error: "Forbidden" }, 403);
    }
    if (error instanceof BadRequestError) {
      return json({ error: error.message }, 400);
    }
    console.error(`[api/cms] action "${action}" threw:`, error);
    return json({ error: error instanceof Error ? error.message : "CMS request failed" }, 500);
  }
};
