import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolvePageTitle, BRAND_TITLE, formatPageTitle } from '../utils/pageTitle';

/**
 * Hook to dynamically update document title and manage focus/scroll on route changes
 */
export function usePageMetadata() {
  const location = useLocation();

  useEffect(() => {
    // Dynamically resolve and set exact document title
    const nextTitle = resolvePageTitle(location.pathname);
    if (document.title !== nextTitle) {
      document.title = nextTitle;
    }

    // Scroll to top on route change unless anchor hash is present
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);
}

export { BRAND_TITLE, formatPageTitle, resolvePageTitle };
export default usePageMetadata;

