import { useEffect } from 'react';

/**
 * Keeps the tab title in sync on client-side navigation. The server already
 * renders the right <title> for the first page load; react-router <Link>
 * navigation would otherwise keep that first title for every later page.
 */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
