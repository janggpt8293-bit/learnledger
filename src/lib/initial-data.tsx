import { createContext, useContext } from 'react';
import { useLocation } from 'react-router';
import type { Articles } from '@/entities';

/**
 * CMS data the server already fetched for the first URL it rendered. Pages
 * start from it so their first browser render matches the server HTML
 * (required for hydration) and they skip the duplicate /api/cms request.
 * After client-side navigation to another URL it no longer applies, and
 * pages fetch through /api/cms as before.
 */
export interface InitialData {
  /** Normalized path (no trailing slash) the data belongs to. */
  path: string;
  /** Listing data (home, /writing, /essays, /about best articles), without mainContent. */
  items?: Articles[];
  /** Detail page item; null means the server looked it up and it doesn't exist. */
  detail?: Articles | null;
  /** Related articles for a detail page, without mainContent. */
  related?: Articles[];
}

const InitialDataContext = createContext<InitialData | null>(null);

export const InitialDataProvider = InitialDataContext.Provider;

export const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

/** The server-fetched data, but only while the current URL is the one it was fetched for. */
export function useInitialData(): InitialData | null {
  const data = useContext(InitialDataContext);
  const { pathname } = useLocation();
  return data && data.path === normalizePath(pathname) ? data : null;
}
